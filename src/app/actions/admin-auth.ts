'use server'

import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import loginSchemaJoi from '@/validations/auth.validations'

export type AdminLoginState = {
    errors?: Record<string, string[]>
    message?: string
}

export async function adminLogin(prevState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
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
        // Rate limiting plus strict pour les admins (3 tentatives au lieu de 5)
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
        const recentFailures = await prisma.auditLog.count({
            where: {
                action: 'ADMIN_LOGIN_FAILED',
                details: { contains: validatedEmail },
                createdAt: { gte: fifteenMinutesAgo }
            }
        })

        if (recentFailures >= 3) {
            await prisma.auditLog.create({
                data: {
                    action: 'ADMIN_LOGIN_BLOCKED',
                    details: `Rate limit exceeded for admin attempt: ${validatedEmail}`,
                    ipAddress: ip,
                    userAgent: userAgent,
                }
            })
            return {
                message: 'Trop de tentatives échouées. Accès bloqué pendant 15 minutes.',
            }
        }

        // Find user in DB
        const user = await prisma.user.findUnique({
            where: { email: validatedEmail },
        })

        if (!user) {
            await prisma.auditLog.create({
                data: {
                    action: 'ADMIN_LOGIN_FAILED',
                    details: `Admin login attempt - User not found: ${validatedEmail}`,
                    ipAddress: ip,
                    userAgent: userAgent,
                }
            })

            return {
                message: 'Accès refusé. Identifiants invalides.',
            }
        }

        // CRITICAL: Verify user is actually an ADMIN
        if (user.role !== 'ADMIN') {
            await prisma.auditLog.create({
                data: {
                    action: 'ADMIN_LOGIN_FAILED',
                    details: `Non-admin user attempted admin login: ${validatedEmail} (Role: ${user.role})`,
                    ipAddress: ip,
                    userAgent: userAgent,
                    userId: user.id
                }
            })
            return {
                message: 'Accès refusé. Privilèges administrateur requis.',
            }
        }

        if (!user.isActive) {
            await prisma.auditLog.create({
                data: {
                    action: 'ADMIN_LOGIN_FAILED',
                    details: `Inactive admin attempted login: ${validatedEmail}`,
                    ipAddress: ip,
                    userAgent: userAgent,
                    userId: user.id
                }
            })
            return {
                message: 'Ce compte a été désactivé. Contactez le support technique.',
            }
        }

        // Verify password
        const passwordsMatch = await bcrypt.compare(validatedPassword, user.passwordHash)
        if (!passwordsMatch) {
            await prisma.auditLog.create({
                data: {
                    action: 'ADMIN_LOGIN_FAILED',
                    details: `Invalid password for admin: ${validatedEmail}`,
                    ipAddress: ip,
                    userAgent: userAgent,
                    userId: user.id
                }
            })

            return {
                message: 'Accès refusé. Identifiants invalides.',
            }
        }

        // Create Session
        const session = await encrypt({
            id: user.id,
            email: user.email,
            role: user.role,
            name: `${user.firstName} ${user.lastName}`
        })

        await prisma.auditLog.create({
            data: {
                action: 'ADMIN_LOGIN_SUCCESS',
                details: `Admin logged in: ${validatedEmail}`,
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

        redirect('/admin')

    } catch (error) {
        console.error('Admin login error:', error)
        return {
            message: 'Une erreur système est survenue. Veuillez réessayer.',
        }
    }

    return { message: 'Connexion réussie' }
}
