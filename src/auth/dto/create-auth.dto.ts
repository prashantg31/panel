import { IsString, IsEnum } from 'class-validator';
enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}
export class CreateAuthDto {
    @IsString()
    readonly username: string;

    @IsString()
    readonly password: string;

    @IsEnum(Role, { message: 'role must be either USER or ADMIN' })
    readonly role: Role;

}
