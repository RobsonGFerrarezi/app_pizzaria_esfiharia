import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty({description: 'Email do usuário'})
    @IsEmail()
    email:      string;

    @ApiProperty({description: 'Senha do usuário'})
    @IsString()
    @IsNotEmpty()
    senha:      string;
}