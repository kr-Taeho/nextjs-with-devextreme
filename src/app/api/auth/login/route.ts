import { LoginUserDto } from '@/dtos/user.dto'
import { jwtHelper } from '@/helpers/jwtHelper'
import { HttpJsonResult } from '@/helpers/resultHelper'
import { authService } from '@/services/authService'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const loginForm = (await req.json()) as LoginUserDto
        const user = await authService.validateUser(loginForm)
        if (user) {
            return jwtHelper.setUserCookie(user.email, HttpJsonResult.message('로그인 성공').toResponse())
        } else {
            throw HttpJsonResult.fail('이메일 또는 패스워드가 틀렸습니다.').toException()
        }
    } catch (error) {
        return HttpJsonResult.exception(error).toResponse()
    }
}
