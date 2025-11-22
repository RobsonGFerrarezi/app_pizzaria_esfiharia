import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength, Matches } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({ description: 'A senha antiga/atual.' })
    @IsString()
    @IsNotEmpty()
    senhaAntiga: string;

    @ApiProperty({ description: 'Nova senha (mín. 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo).' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:]).*$/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&.,;:).'
    })
    novaSenha: string;
}