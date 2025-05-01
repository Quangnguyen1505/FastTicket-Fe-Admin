import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { axiosClient } from '@/helpers/call-apis';

interface VerifyTokenResponse {
  metadata: boolean;
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const userId = request.cookies.get('userId')?.value
  const pathname = request.nextUrl.pathname

  if (pathname === '/signin' || pathname === '/signup') {
    if (token && userId) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!token || !userId) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  let isAdmin = false
  try {
    const res = await axiosClient.get<VerifyTokenResponse>('/v1/api/access/verify', {
      headers: {
        'x-client-id': userId,
        'authorization': `Bearer ${token}`,
      }
    })
    isAdmin = res.data.metadata
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Token not accept:', error)
    const response = NextResponse.redirect(new URL('/signin', request.url))
    response.cookies.delete('accessToken')
    response.cookies.delete('userId')
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|signin|signup).*)',
  ],
}
