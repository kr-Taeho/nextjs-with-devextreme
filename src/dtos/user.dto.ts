import { IsEmail, IsString } from 'class-validator'
export class CreateUserDto {
    public email!: string
    public password!: string
    public name!: string
    public role!: string
}

export class LoginUserDto {
    @IsEmail()
    public email!: string

    @IsString()
    public password!: string
}

export class DetailUserDto {
    public email!: string
    public name!: string
    public role!: string
    public avatarUrl!: string
}
