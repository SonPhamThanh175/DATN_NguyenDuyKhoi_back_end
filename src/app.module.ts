import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { TypeModule } from './type/type.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadModule } from './upload/upload.module';
import { MenuModule } from './menu/menu.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { ReviewModule } from './review/review.module';

require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/adidas'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'products'),
      serveRoot: '/api/uploads/products',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'avatars'),
      serveRoot: '/api/uploads/avatars',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads', 'types'),
      serveRoot: '/api/uploads/types',
    }),
    AuthModule,
    UserModule,
    TypeModule,
    MenuModule,
    CategoryModule,
    ProductModule,
    UploadModule,
    CartModule,
    OrderModule,
    RecommendationModule,
    ReviewModule
  ],
})
export class AppModule {}
