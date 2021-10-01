import { Module } from '@nestjs/common';
import { AuthModule } from './server/api/auth/auth.module';
import { UserModule } from './server/api/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { RouterModule } from 'nest-router';
import { routes } from './server/common/router';
import { User } from './server/models';
import { CustomerModule } from './server/api/customer/customer.module';
import { PaymentModule } from './server/api/payment/payment.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: User
      }
    ]),
    RouterModule.forRoutes(routes),
    AuthModule, 
    UserModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    CustomerModule,
    PaymentModule
  ],
  
})
export class AppModule {}
