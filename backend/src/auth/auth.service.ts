import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor( 
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        try{

            const user = await this.userService.findByEmail(email);

            const isMatch = await bcrypt.compare(pass,user.senha);

            if (isMatch){
                //retira a senha do resultado
                const { senha, ...result } = user
                return result;
            }
        }catch(error){
            throw new UnauthorizedException('Email ou senha inválidos.');
        }
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id};
        return{
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
            }
        };
    }
}
