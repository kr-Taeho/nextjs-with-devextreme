'use client'
import { LoadIndicator } from 'devextreme-react/load-indicator'
import { useCallback, useRef, useState } from 'react'
import notify from 'devextreme/ui/notify'
import Form, { Item, Label, ButtonItem, ButtonOptions, RequiredRule, EmailRule } from 'devextreme-react/form'
import Box, { Item as BoxItem } from 'devextreme-react/box'
import ScrollView from 'devextreme-react/scroll-view'
import { useRouter } from 'next/navigation'

import './LoginForm.scss'
import { setAuth } from '@/client/lib/auth'

export default function LoginForm() {
    const { push } = useRouter()
    const [loading, setLoading] = useState(false)
    const formData = useRef({ email: 'user@gmail.com', password: '1234' })
    const onSubmit = useCallback(
        async (e: any) => {
            e.preventDefault()
            const { email, password } = formData.current
            setLoading(true)

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                },
                credentials: 'same-origin',
            })
            console.log(response)
            const responseData = await response.json()
            if (responseData.code === 200) {
                const token = response.headers.get('authorization')
                if (token) {
                    setAuth(token)
                    push('/dashboard')
                } else {
                    setLoading(false)
                    notify('사용자 인증 토큰을 찾을 수 없습니다.', 'error', 2000)
                }
            } else {
                setLoading(false)
                notify(responseData.message, 'error', 2000)
            }
        },
        [push]
    )

    return (
        <ScrollView height={'100%'} width={'100%'} className={'with-footer single-card'}>
            <div className={'dx-card content'}>
                <Box width="100%">
                    <BoxItem ratio={1}>
                        <div className={'header'}>
                            <div className={'title'}>NextJS with Devextreme</div>
                            <div className={'description'}>Login</div>
                        </div>
                    </BoxItem>
                </Box>

                <form className={'login-form'} onSubmit={onSubmit}>
                    <Form formData={formData.current} disabled={loading}>
                        <Item dataField={'email'} editorType={'dxTextBox'} editorOptions={emailEditorOptions}>
                            <RequiredRule message="Email is required" />
                            <EmailRule message="Email is invalid" />
                            <Label visible={false} />
                        </Item>
                        <Item dataField={'password'} editorType={'dxTextBox'} editorOptions={passwordEditorOptions}>
                            <RequiredRule message="Password is required" />
                            <Label visible={false} />
                        </Item>
                        <Item
                            dataField={'rememberMe'}
                            editorType={'dxCheckBox'}
                            editorOptions={rememberMeEditorOptions}
                        >
                            <Label visible={false} />
                        </Item>
                        <ButtonItem>
                            <ButtonOptions width={'100%'} height={40} type={'default'} useSubmitBehavior={true}>
                                <span className="dx-button-text">
                                    {loading ? (
                                        <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                                    ) : (
                                        'Sign In'
                                    )}
                                </span>
                            </ButtonOptions>
                        </ButtonItem>
                    </Form>
                </form>
            </div>
        </ScrollView>
    )
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Email', mode: 'email' }
const passwordEditorOptions = { stylingMode: 'filled', placeholder: 'Password', mode: 'password' }
const rememberMeEditorOptions = { text: 'Remember me', elementAttr: { class: 'form-text' } }
