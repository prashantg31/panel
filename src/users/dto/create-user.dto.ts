import { IsString, IsEnum } from 'class-validator';

export class CreateUserDto {
    @IsString()
    readonly username: string;

    @IsString()
    readonly password: string;

    @IsEnum(['USER', 'ADMIN'])
    readonly role: 'USER' | 'ADMIN';
}
