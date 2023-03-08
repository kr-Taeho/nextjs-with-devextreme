'use client'
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '@/client/lib/api'
import { usePathname, useRouter } from 'next/navigation'
import LoadPanel from 'devextreme-react/load-panel'

export interface NavItem {
    path?: string
    icon?: string
    text: string
    items?: NavItem[]
}

export class UserData {
    public email!: string
    public name!: string
    public role!: string
    public avatarUrl!: string
}

type UserContextType = {
    user?: UserData | null
    menus?: NavItem[]
    logout: () => Promise<void>
    loading: boolean
    currentPath: string
    setCurrentPath: (path: string) => void
}

const UserProvider = ({ user, menus, children }: { user: UserData; menus: NavItem[]; children: ReactNode }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [currentPath, setCurrentPath] = useState(pathname)

    const logout = useCallback(async () => {
        const response = await api.call('/api/auth/logout', { method: 'POST' })
        setLoading(true)
        router.push('/login')
    }, [router])

    useEffect(() => {
        if (user) {
            setLoading(false)
        }
    }, [user])

    return (
        <UserContext.Provider value={{ user, menus, logout, loading, currentPath, setCurrentPath }}>
            {loading ? <LoadPanel visible={true} /> : children}
        </UserContext.Provider>
    )
}

const UserContext = createContext<UserContextType>({} as UserContextType)
const useUser = () => useContext(UserContext)

export { UserProvider, useUser }
