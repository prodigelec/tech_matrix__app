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
    // Allow access to /admin/login without authentication
    if (path === '/admin/login') {
      // If already logged in as admin, redirect to admin dashboard
      if (payload && payload.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      // If logged in as non-admin, redirect to their dashboard
      if (payload && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      // Allow unauthenticated access to admin login page
      return NextResponse.next()
    }

    // For all other /admin/* routes, require authentication
    if (!payload) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 2. Protect Dashboard Routes (Technicians and other authenticated users)
  if (path.startsWith('/dashboard')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 3. Redirect authenticated users away from Login pages
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
