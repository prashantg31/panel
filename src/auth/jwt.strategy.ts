import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        const { role } = payload;
        const userId = payload.sub;

        // Fetch user by userId
        const user = await this.usersService.getUserById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        console.log("bbbbb---", user);

        // Optionally, you can perform role validation here as well.
        return { ...user, role }; // Returning user and role
    }
}
