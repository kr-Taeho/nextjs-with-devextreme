import { USER_TOKEN, REFRESH_TOKEN, TokenData } from '@/client/lib/auth'
import { JWT_ACCESS_KEY, JWT_REFRESH_KEY } from '@/config'
import { serialize } from 'cookie'
import { JWTPayload, jwtVerify, SignJWT } from 'jose'
import { nanoid } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'

export default class JwtHelper {
    private static ACCESS_TOKEN_EXPIRE_MIN = 60
    private static REFRESH_TOKEN_EXPIRE_MIN = 1440 // 24시간
    public static TOKEN_VALID_SUCCESS = 'SUCC'
    public static TOKEN_VALID_EXPIRE = 'TokenExpiredError'
    public static TOKEN_VALID_JWTERR = 'JsonWebTokenError'
    public static TOKEN_VALID_NOT_BEFORE = 'NotBeforeError'
    public static TOKEN_VALID_ERROR = 'Error'

    private static instance: JwtHelper

    private jwtAccessKey: Uint8Array
    private jwtRefreshKey: Uint8Array
    constructor() {
        if (!JWT_ACCESS_KEY) throw new Error('JWT_ACCESS_KEY is undefined')
        this.jwtAccessKey = new TextEncoder().encode(JWT_ACCESS_KEY)
        if (!JWT_REFRESH_KEY) throw new Error('JWT_REFRESH_KEY is undefined')
        this.jwtRefreshKey = new TextEncoder().encode(JWT_REFRESH_KEY)
    }

    public static getInstance = (): JwtHelper => {
        if (!JwtHelper.instance) JwtHelper.instance = new JwtHelper()
        return JwtHelper.instance
    }
    private getToken = (req: NextRequest) => {
        return req.cookies.get(USER_TOKEN)?.value || req.headers.get(USER_TOKEN)?.toString().split('Bearer ')[1]
    }

    private getRefreshToken = (req: NextRequest) => {
        return req.cookies.get(REFRESH_TOKEN)?.value
    }

    public verify = async (
        req: NextRequest
    ): Promise<{
        valid: boolean
        reason: string
        payload: JWTPayload | null
    }> => {
        const token = this.getToken(req)
        return this.verifyForToken(token)
    }

    public verifyForToken = async (
        token?: string
    ): Promise<{
        valid: boolean
        reason: string
        payload: JWTPayload | null
    }> => {
        if (!token) {
            return { valid: false, reason: JwtHelper.TOKEN_VALID_JWTERR, payload: null }
        }
        try {
            const verified = await jwtVerify(token, this.jwtAccessKey)
            return { valid: true, reason: JwtHelper.TOKEN_VALID_SUCCESS, payload: verified.payload }
        } catch (error) {
            return { valid: false, reason: JwtHelper.TOKEN_VALID_EXPIRE, payload: null }
        }
    }

    public verifyRefresh = async (
        req: NextRequest
    ): Promise<{
        valid: boolean
        reason: string
        payload: JWTPayload | null
    }> => {
        const token = this.getToken(req)
        if (!token) {
            return { valid: false, reason: JwtHelper.TOKEN_VALID_JWTERR, payload: null }
        }
        try {
            const verified = await jwtVerify(token, this.jwtRefreshKey)
            return { valid: true, reason: JwtHelper.TOKEN_VALID_SUCCESS, payload: verified.payload }
        } catch (error) {
            return { valid: false, reason: JwtHelper.TOKEN_VALID_EXPIRE, payload: null }
        }
    }

    public generateToken = async (unique: string): Promise<TokenData> => {
        const token = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setJti(unique)
            .setIssuedAt()
            .setExpirationTime(`${JwtHelper.ACCESS_TOKEN_EXPIRE_MIN}m`)
            .sign(this.jwtAccessKey)

        const tokenData = {
            token,
            expiresIn: JwtHelper.ACCESS_TOKEN_EXPIRE_MIN,
        } as TokenData
        return tokenData
    }

    public generateRefreshToken = async (): Promise<TokenData> => {
        const jti = nanoid()
        const token = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setJti(jti)
            .setIssuedAt()
            .setExpirationTime(`${JwtHelper.REFRESH_TOKEN_EXPIRE_MIN}m`)
            .sign(this.jwtRefreshKey)

        const tokenData = {
            token,
            expiresIn: JwtHelper.REFRESH_TOKEN_EXPIRE_MIN,
        } as TokenData
        return tokenData
    }

    public getCookieValue = (TOKEN: string, tokenData: TokenData): string => {
        return serialize(TOKEN, tokenData.token, { httpOnly: true, maxAge: tokenData.expiresIn * 1000 })
    }

    public getExpireCookieValue = (TOKEN: string): string => {
        return serialize(TOKEN, '', { httpOnly: true, maxAge: 0 })
    }
    public setUserCookie = async (unique: string, res: NextResponse) => {
        //현재 쿠키는 동시에 한개만 설정된다고 함..
        const authToken = await this.generateToken(unique)
        // const refreshToken = await this.generateRefreshToken()
        // const authTokenCookie = this.getCookieValue(USER_TOKEN, authToken)
        // const refreshTokenCookie = this.getCookieValue(REFRESH_TOKEN, refreshToken)
        // res.cookies.set(REFRESH_TOKEN, refreshToken.token, { httpOnly: true, maxAge: refreshToken.expiresIn * 1000 })
        res.cookies.set(USER_TOKEN, authToken.token, { httpOnly: true, maxAge: authToken.expiresIn * 1000 })
        // res.headers.set('Set-Cookie', [authTokenCookie, refreshTokenCookie])
        res.headers.set(USER_TOKEN, authToken.token)
        return res
    }
    public expireUserCookie = async (res: NextResponse) => {
        const authExpireCookieValue = this.getExpireCookieValue(USER_TOKEN)
        // const refreshExpireCookieValue = this.getExpireCookieValue(REFRESH_TOKEN)
        // res.cookies.set('Set-Cookie', authExpireCookieValue)
        res.cookies.set(USER_TOKEN, '', { httpOnly: true, maxAge: 0 })
        // res.headers.append('Set-Cookie', refreshExpireCookieValue)
        return res
    }

    public setRefreshCookie = async (unique: string, res: NextResponse) => {
        const refreshToken = await this.generateRefreshToken()
        res.cookies.set(REFRESH_TOKEN, refreshToken.token, { httpOnly: true, maxAge: refreshToken.expiresIn * 1000 })
        return res
    }
    public updateUserCookie = async (unique: string, res: NextResponse) => {
        const authToken = await this.generateToken(unique)
        res.cookies.set(USER_TOKEN, authToken.token, { httpOnly: true, maxAge: authToken.expiresIn * 1000 })
        return res
    }
    public updateRefreshCookie = async (unique: string, res: NextResponse) => {
        const refreshToken = await this.generateRefreshToken()
        res.cookies.set(REFRESH_TOKEN, refreshToken.token, { httpOnly: true, maxAge: refreshToken.expiresIn * 1000 })
        return res
    }
}

export const jwtHelper = new JwtHelper()
