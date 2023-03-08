import { HttpJsonResult } from '@/helpers/resultHelper'
import DashboardService from '@/services/dashboardService'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    try {
        const dashboardService = new DashboardService()
        const data = await dashboardService.getDailySales()
        const data2 = await dashboardService.getDailyClaims()
        const data3 = await dashboardService.getNotices()
        return HttpJsonResult.success(
            {
                dailySales: data,
                dailyClaims: data2,
                notices: data3,
            },
            '알림판 데이터 가져왔습니다.'
        ).toResponse()
    } catch (error) {
        return HttpJsonResult.exception(error).toResponse()
    }
}
