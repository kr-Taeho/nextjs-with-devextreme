import { jwtHelper } from '@/helpers/jwtHelper'
import { HttpJsonResult } from '@/helpers/resultHelper'
import { authService } from '@/services/authService'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const tokenData = await jwtHelper.verify(req)
        const user = await authService.findUserDtoByEmail(tokenData.payload?.jti)
        console.log(user)
        return HttpJsonResult.success(user, '유저 정보를 가져왔습니다.').toResponse()
    } catch (error) {
        return HttpJsonResult.exception(error).toResponse()
    }
}
