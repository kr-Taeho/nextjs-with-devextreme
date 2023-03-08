import { USER_TOKEN } from '@/client/lib/auth'
import { DetailUserDto } from '@/dtos/user.dto'
import { jwtHelper } from '@/helpers/jwtHelper'
import { navigation, NavigationItem } from '@/navigation'
import { cookies } from 'next/headers'
import AuthService from './authService'
import { notFound } from 'next/navigation'

export default class PageService {
    private authService = new AuthService()

    public getPageData = async (): Promise<{
        user: DetailUserDto | null
        menus: NavigationItem[]
    }> => {
        console.log('page load...')
        const cookie = cookies().get(USER_TOKEN)
        const tokenData = await jwtHelper.verifyForToken(cookie?.value)
        const user = tokenData.valid ? await this.authService.findUserDtoByEmail(tokenData.payload?.jti) : null
        return { user, menus: navigation }
    }
}

export const pageService = new PageService()
