'use client'
import { useUser } from '@/client/contexts/UserContext'
import TreeView from 'devextreme-react/tree-view'
import * as events from 'devextreme/events'
import { EventInfo } from 'devextreme/events'
import dxTreeView, { ItemClickEvent } from 'devextreme/ui/tree_view'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './NavBar.scss'

export default function NavBar(
    props: React.PropsWithChildren<{
        selectedItemChanged: (e: ItemClickEvent) => void
        openMenu: (e: React.PointerEvent) => void
        compactMode: boolean
        onMenuReady: (e: EventInfo<dxTreeView>) => void
    }>
) {
    const { menus, currentPath } = useUser()
    const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } = props
    const [expend, setExpend] = useState(true)
    function normalizePath() {
        return menus?.map((item) => ({
            ...item,
            expanded: true,
            path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
        }))
    }

    const items = useMemo(normalizePath, [])
    useEffect(() => {
        const treeView = treeViewRef.current && treeViewRef.current.instance
        if (!treeView) {
            return
        }

        if (currentPath !== undefined) {
            treeView.selectItem(currentPath)
            treeView.expandItem(currentPath)
        }

        if (compactMode) {
            setExpend(false)
            treeView.collapseAll()
        } else {
            setExpend(true)
            treeView.expandAll()
        }
    }, [currentPath, compactMode])

    const treeViewRef = useRef<TreeView>(null)
    const wrapperRef = useRef<HTMLDivElement>()
    const getWrapperRef = useCallback(
        (element: HTMLDivElement) => {
            const prevElement = wrapperRef.current
            if (prevElement) {
                events.off(prevElement, 'dxclick')
            }

            wrapperRef.current = element
            events.on(element, 'dxclick', (e: React.PointerEvent) => {
                openMenu(e)
            })
        },
        [openMenu]
    )

    return (
        <div className={`menu-wrap ${expend ? 'menu-expend' : 'menu-collapse'}`}>
            <div className={`dx-swatch-additional side-navigation-menu`} ref={getWrapperRef}>
                {children}
                <div className={'menu-container'}>
                    <TreeView
                        // searchMode={'contains'}
                        // searchEnabled={true}
                        ref={treeViewRef}
                        items={items}
                        keyExpr={'path'}
                        selectionMode={'single'}
                        focusStateEnabled={false}
                        expandEvent={'click'}
                        onItemClick={selectedItemChanged}
                        onContentReady={onMenuReady}
                        width={'100%'}
                    />
                </div>
            </div>
        </div>
    )
}
