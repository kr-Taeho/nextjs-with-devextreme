import { serialize } from 'cookie'

export interface TokenData {
    token: string
    expiresIn: number
}

export const USER_TOKEN = 'Authorization'
export const REFRESH_TOKEN = 'refresh_token'

export function setAuth(data: string) {
    sessionStorage.setItem('Authorization', data)
    // const authCookie = serialize(USER_TOKEN, data.authTokenData.token, {
    //     httpOnly: true,
    //     expires: data.authTokenData.expiresIn * 1000,
    // })
}
