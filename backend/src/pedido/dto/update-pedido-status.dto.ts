import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

// Lista de status permitidos [baseado no schema.prisma]
const statusPermitidos = ['PENDENTE', 'EM_PREPARO', 'ENTREGUE', 'CANCELADO'];

export class UpdatePedidoStatusDto {
    @ApiProperty({ 
        description: 'Novo status do pedido',
        enum: statusPermitidos 
    })
    @IsString()
    @IsIn(statusPermitidos)
    status: string;
}