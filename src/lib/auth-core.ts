import { jwtVerify, SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

// Use a strong secret key from environment variable
const SECRET_KEY = process.env.JWT_SECRET || 'matrix_fitness_secure_key_2024_change_me_in_prod'
const key = new TextEncoder().encode(SECRET_KEY)

export interface SessionPayload {
  id: string
  email: string
  role: string
  name: string
  expires?: Date
}

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Session lasts 24h
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return null

  // Refresh session expiration on activity
  const parsed = await decrypt(session)
  if (!parsed) return null

  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  return res
}
