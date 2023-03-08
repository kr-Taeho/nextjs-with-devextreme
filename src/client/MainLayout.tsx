'use client'

import { useCallback, useRef, useState } from 'react'

import './MainLayout.scss'

import { Footer, Header, NavBar } from '@/client/components'
import { NavItem, UserData, UserProvider } from '@/client/contexts/UserContext'
import { useMenuPatch } from '@/client/lib/patches'
import LoadPanel from 'devextreme-react/load-panel'
import ScrollView from 'devextreme-react/scroll-view'
import { ClickEvent } from 'devextreme/ui/button'
import { ItemClickEvent } from 'devextreme/ui/tree_view'
import { useRouter } from 'next/navigation'

export default function MainLayout(
    props: React.PropsWithChildren<{ isContentBlock: boolean; title: string; user: UserData; menus: NavItem[] }>
) {
    const { children, menus, user, title, isContentBlock } = props
    const [menuStatus, setMenuStatus] = useState(MenuStatus.Opened)
    const [loading, setLoading] = useState(false)
    const [patchCssClass, onMenuReady] = useMenuPatch()
    const router = useRouter()
    const toggleMenu = useCallback(({ event }: ClickEvent) => {
        setMenuStatus((prevMenuStatus) =>
            prevMenuStatus === MenuStatus.Closed ? MenuStatus.Opened : MenuStatus.Closed
        )
        event?.stopPropagation()
    }, [])

    const scrollViewRef = useRef<ScrollView>(null)

    const temporaryOpenMenu = useCallback(() => {
        setMenuStatus((prevMenuStatus) =>
            prevMenuStatus === MenuStatus.Closed ? MenuStatus.TemporaryOpened : prevMenuStatus
        )
    }, [])

    const onNavigationChanged = useCallback(
        ({ itemData, event, node }: ItemClickEvent) => {
            if (menuStatus === MenuStatus.Closed || !itemData?.path || node?.selected) {
                event?.preventDefault()
                return
            }
            setLoading(true)
            router.push(itemData.path)
            scrollViewRef.current?.instance.scrollTo(0)

            if (menuStatus === MenuStatus.TemporaryOpened) {
                setMenuStatus(MenuStatus.Closed)
                event?.stopPropagation()
            }
        },
        [router, menuStatus]
    )
    return (
        <div className={`app screen-large`}>
            <UserProvider user={user} menus={menus}>
                <div className={'side-nav-outer-toolbar'}>
                    <Header menuToggleEnabled toggleMenu={toggleMenu} title={title} />
                    <div className={'custom-drawer'}>
                        <NavBar
                            compactMode={menuStatus === MenuStatus.Closed}
                            selectedItemChanged={onNavigationChanged}
                            openMenu={temporaryOpenMenu}
                            onMenuReady={onMenuReady}
                        ></NavBar>
                        <div id={'page-content'} className={'container'}>
                            <ScrollView ref={scrollViewRef} className={'layout-body with-footer'}>
                                <div className={isContentBlock ? 'content-block' : 'content'}>{children}</div>
                                <Footer>Footer</Footer>
                            </ScrollView>
                        </div>
                        <LoadPanel
                            shadingColor="rgba(0,0,0,0.4)"
                            showPane={true}
                            shading={true}
                            showIndicator={true}
                            visible={loading}
                            position={{ of: '#page-content' }}
                        />
                    </div>
                </div>
            </UserProvider>
        </div>
    )
}

const MenuStatus = {
    Closed: 1,
    Opened: 2,
    TemporaryOpened: 3,
}
