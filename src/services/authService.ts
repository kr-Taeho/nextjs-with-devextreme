import { HttpJsonResult } from '@/helpers/resultHelper'
import { AuthUser, User } from '@/interfaces/auth.interface'
import { DetailUserDto, LoginUserDto } from './../dtos/user.dto'

export default class AuthService {
    private users = [
        {
            loginId: 'user1',
            email: 'user@gmail.com',
            password: '1234',
            name: 'user',
            role: 'admin',
            avatarUrl: 'https://picsum.photos/200',
        },
    ]

    public validateUser = async (loginForm: LoginUserDto): Promise<DetailUserDto> => {
        const user = await this.findUserByEmail(loginForm.email)
        if (!user) throw HttpJsonResult.fail('아이디 또는 비밀번호가 틀렸습니다.').toException()
        if (user.password === loginForm.password) {
            const dto: DetailUserDto = {
                name: user.name,
                email: user.email,
                role: user.role,
                avatarUrl: user.avatarUrl,
            }
            return dto
        } else {
            throw HttpJsonResult.fail('이메일 또는 패스워드가 틀렸습니다.').toException()
        }
    }
    public findUserByEmail = async (email?: string | undefined | null): Promise<User> => {
        if (!email) throw HttpJsonResult.fail('아이디가 올바르지 않습니다.').toException()
        return this.users.find((f) => f.email === email) as User
    }
    public findUserDtoByEmail = async (email?: string | null): Promise<DetailUserDto | null> => {
        const user = await this.findUserByEmail(email)
        if (!user) return null
        const dto: DetailUserDto = {
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
        }
        return dto
    }
}

export const authService = new AuthService()
