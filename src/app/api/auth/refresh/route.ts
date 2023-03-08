import { jwtHelper } from '@/helpers/jwtHelper'
import { HttpJsonResult } from '@/helpers/resultHelper'
import { NextRequest } from 'next/server'

export function POST(req: NextRequest) {
    try {
        
        return HttpJsonResult.message('토큰 갱신.. 미지원..').toResponse()
    } catch (error) {
        return HttpJsonResult.exception(error).toResponse()
    }
}
