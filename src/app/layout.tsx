import '@/themes/generated/dx-styles.scss'
import '@/themes/generated/theme.additional.css'
import '@/themes/generated/theme.base.css'
import '@/themes/generated/variables.additional.scss'
import '@/themes/generated/variables.base.scss'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
            <body suppressHydrationWarning={true}>{children}</body>
        </html>
    )
}
