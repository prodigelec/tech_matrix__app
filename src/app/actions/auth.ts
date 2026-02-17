'use server'

import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import loginSchemaJoi from '@/validations/auth.validations'

export type LoginState = {
  errors?: Record<string, string[]>
  message?: string
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  const userAgent = headersList.get('user-agent') || 'unknown'

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  // Validation avec Joi
  const { error, value } = loginSchemaJoi.validate({ email, password, username }, { abortEarly: false })

  if (error) {
    const formattedErrors: Record<string, string[]> = {}
    error.details.forEach((detail) => {
        const key = detail.path[0] as string
        if (!formattedErrors[key]) {
            formattedErrors[key] = []
        }
        formattedErrors[key].push(detail.message)
    })
    return { errors: formattedErrors }
  }

  const { email: validatedEmail, password: validatedPassword } = value

  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
    const recentFailures = await prisma.auditLog.count({
      where: {
        action: 'LOGIN_FAILED',
        details: { contains: validatedEmail },
        createdAt: { gte: fifteenMinutesAgo }
      }
    })

    if (recentFailures >= 5) {
      await prisma.auditLog.create({
        data: {
          action: 'LOGIN_BLOCKED',
          details: `Rate limit exceeded for ${validatedEmail}`,
          ipAddress: ip,
          userAgent: userAgent,
        }
      })
      return {
        message: 'Trop de tentatives échouées. Veuillez réessayer dans 15 minutes.',
      }
    }

    // 3. Find user in DB
    const user = await prisma.user.findUnique({
      where: { email: validatedEmail },
    })

    if (!user) {
      // Log failed attempt (generic message for security, but specific log)
      await prisma.auditLog.create({
        data: {
          action: 'LOGIN_FAILED',
          details: `User not found: ${validatedEmail}`,
          ipAddress: ip,
          userAgent: userAgent,
        }
      })

      return {
        message: 'Identifiants incorrects',
      }
    }

    if (!user.isActive) {
       await prisma.auditLog.create({
        data: {
          action: 'LOGIN_FAILED',
          details: `Inactive user attempted login: ${validatedEmail}`,
          ipAddress: ip,
          userAgent: userAgent,
          userId: user.id
        }
      })
      return {
        message: 'Ce compte a été désactivé. Contactez l\'administrateur.',
      }
    }

    // 4. Verify password
    const passwordsMatch = await bcrypt.compare(validatedPassword, user.passwordHash)
    if (!passwordsMatch) {
       await prisma.auditLog.create({
        data: {
          action: 'LOGIN_FAILED',
          details: `Invalid password for: ${validatedEmail}`,
          ipAddress: ip,
          userAgent: userAgent,
          userId: user.id
        }
      })

      return {
        message: 'Identifiants incorrects',
      }
    }

    // 5. Create Session
    const session = await encrypt({
      id: user.id,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`
    })

    await prisma.auditLog.create({
      data: {
        action: 'LOGIN_SUCCESS',
        details: `User logged in: ${validatedEmail}`,
        ipAddress: ip,
        userAgent: userAgent,
        userId: user.id
      }
    })

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'lax',
    })

  } catch (error) {
    console.error('Login error:', error)
    return {
      message: 'Une erreur est survenue lors de la connexion',
    }
  }

  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}
