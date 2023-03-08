'use client'
import { useUser } from '@/client/contexts/UserContext'
import ContextMenu, { Position } from 'devextreme-react/context-menu'
import List from 'devextreme-react/list'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import './UserPanel.scss'

export default function UserPanel({ menuMode }: { menuMode: 'context' | 'list' }) {
    const { user, logout } = useUser()
    const { push } = useRouter()

    function navigateToProfile() {
        push('/profile')
    }
    const menuItems = useMemo(
        () => [
            {
                text: 'Profile',
                icon: 'user',
                onClick: navigateToProfile,
            },
            {
                text: 'Logout',
                icon: 'runner',
                onClick: logout,
            },
        ],
        [logout]
    )
    return (
        <div className={'user-panel'}>
            <div className={'user-info'}>
                <div className={'image-container'}>
                    <div
                        style={{
                            background: `url(${user?.avatarUrl}) no-repeat #fff`,
                            backgroundSize: 'cover',
                        }}
                        className={'user-image'}
                    />
                </div>
                <div className={'user-name'}>{user?.email}</div>
            </div>

            {menuMode === 'context' && (
                <ContextMenu
                    items={menuItems}
                    target={'.user-button'}
                    showEvent={'dxclick'}
                    width={210}
                    cssClass={'user-menu'}
                >
                    <Position my={'top center'} at={'bottom center'} />
                </ContextMenu>
            )}
            {menuMode === 'list' && <List className={'dx-toolbar-menu-action'} items={menuItems} />}
        </div>
    )
}
