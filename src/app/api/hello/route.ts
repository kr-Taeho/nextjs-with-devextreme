import { HttpJsonResult } from '@/helpers/resultHelper'

export function GET() {
    try {
        return HttpJsonResult.message('world').toResponse()
    } catch (error) {
        return HttpJsonResult.exception(error).toResponse()
    }
}
