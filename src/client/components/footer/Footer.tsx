import { ReactNode } from 'react'
import './Footer.scss'

export default function Footer({ children }: { children: ReactNode }) {
    return <footer className={'footer content-block'}>{children}</footer>
}
