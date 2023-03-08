import { jwtHelper } from '@/helpers/jwtHelper'
import { HttpJsonResult } from '@/helpers/resultHelper'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const res = HttpJsonResult.message('로그아웃 성공').toResponse()
        // console.log(res)
        return jwtHelper.expireUserCookie(res)
    } catch (error) {
        return HttpJsonResult.exception(error).toResponse()
    }
}
