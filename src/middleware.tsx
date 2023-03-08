import { type NextRequest, NextResponse } from 'next/server'
import { jwtHelper } from '@/helpers/jwtHelper'
import { HttpJsonResult } from './helpers/resultHelper'

export const config = {
    matcher: ['/:path*', '/api/:path*'],
}

export async function middleware(req: NextRequest) {
    console.log(`${req.method} ${req.url}`)
    if (
        req.nextUrl.pathname.startsWith('/api/auth/login') ||
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.startsWith('/favicon.ico') ||
        req.nextUrl.pathname.startsWith('/images')
    ) {
        return HttpJsonResult.next()
    }

    // validate the user is authenticated
    const verifiedToken = await jwtHelper.verify(req)
    if (verifiedToken.valid) {
        if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
    } else {
        if (req.nextUrl.pathname.startsWith('/login')) {
            return HttpJsonResult.next()
        }
        if (req.nextUrl.pathname.startsWith('/api/')) {
            return HttpJsonResult.unauthorized().toResponse()
        } else {
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }
}
