import MainLayout from '@/client/MainLayout'
import { getCurrentPage } from '@/navigation'
import { pageService } from '@/services/pageService'
import { NextResponse } from 'next/server'
import Content from './content'

const page = getCurrentPage(__dirname)

export const metadata = {
    title: page.text,
}

export default async function Page() {
    const { user, menus } = await pageService.getPageData()
    if (!user) return NextResponse.error()

    return (
        <>
            <MainLayout isContentBlock={true} title={'NextJS with Devextreme'} user={user} menus={menus}>
                <Content />
            </MainLayout>
        </>
    )
}
