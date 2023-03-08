import { HttpJsonResult } from '@/helpers/resultHelper'
import { navigation } from '@/navigation'

export function GET() {
    return HttpJsonResult.success(navigation, '메뉴 목록을 가져왔습니다.').toResponse()
}
