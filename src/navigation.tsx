export interface NavigationItem {
    path?: string
    icon?: string
    text: string
    items?: NavigationItem[]
}
export const defaultItem = { text: 'NextJS with Devextreme', path: '/', icon: 'home' }

const findItem = (items: NavigationItem[], pathname: string): NavigationItem | null => {
    for (let i = 0; i < items.length; i++) {
        if (pathname === '/' || !pathname || pathname === '') break
        if (items[i].path === pathname) return items[i]

        if (items[i].items) {
            const innerItem = findItem(items[i].items!, pathname)
            if (innerItem) return innerItem
        }
    }
    return null
}

export const findNavigationItem = (items: NavigationItem[], pathname: string): NavigationItem => {
    return findItem(items, pathname) || defaultItem
}

export const getCurrentPage = (path: string) => {
    const replacedPath = path.replaceAll('\\', '/')
    const dirIndex = replacedPath.lastIndexOf('/app/')
    if (dirIndex) {
        const pathname = replacedPath.slice(dirIndex + 4)
        return findNavigationItem(navigation, pathname)
    } else {
        return defaultItem
    }
}

export const navigation: NavigationItem[] = [
    {
        text: 'Dashboard',
        path: '/dashboard',
        icon: 'home',
    },
    {
        text: 'ETC',
        icon: 'folder',
        items: [
            {
                text: 'Form',
                icon: 'file',
                path: '/etc/form',
            },
            {
                text: 'DataGrid',
                icon: 'file',
                path: '/etc/grid',
            },
            {
                text: 'Tab',
                icon: 'file',
                path: '/etc/tab',
            },
        ],
    }
]
