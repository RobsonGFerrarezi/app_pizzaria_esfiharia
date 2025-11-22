import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
import { CategoriaModule } from './categoria/categoria.module';
import { PedidoModule } from './pedido/pedido.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ 
    isGlobal: true,
  }), DatabaseModule, ProductModule, UserModule, CarrinhoModule, CategoriaModule, PedidoModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
