import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-hotel-key')

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAuthRoute = path === '/admin/login'
  const isAdminRoute = path.startsWith('/admin')

  if (!isAdminRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get('admin-token')?.value

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (token) {
    try {
      await jwtVerify(token, secret)
      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    } catch (e) {
      // Invalid token
      if (!isAuthRoute) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('admin-token')
        return response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
