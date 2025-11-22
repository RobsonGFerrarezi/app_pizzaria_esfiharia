import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        UserModule, 
        PassportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule], // 3. Importar o ConfigModule aqui
          inject: [ConfigService],  // 4. Injetar o ConfigService
          useFactory: (configService: ConfigService) => ({
            // 5. Puxar o segredo do .env
            secret: configService.get<string>('SECRET'),
            signOptions: { expiresIn: '1d' },
          }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy], 
})
export class AuthModule {}