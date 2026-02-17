import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt, updateSession } from '@/lib/auth-core'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  const path = request.nextUrl.pathname

  // Decrypt session if it exists
  const payload = session ? await decrypt(session) : null

  // 1. Protect Admin Routes
  if (path.startsWith('/admin')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 2. Protect Dashboard Routes (and other protected areas)
  if (path.startsWith('/dashboard')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 3. Redirect authenticated users away from Login
  if (path === '/login' && payload) {
    if (payload.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Update session expiration if logged in
  if (payload) {
    const response = await updateSession(request)
    if (response) return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
}
