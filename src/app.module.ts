import { Module } from '@nestjs/common';
import { AuthModule } from './server/api/auth/auth.module';
import { UserModule } from './server/api/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { RouterModule } from 'nest-router';
import { routes } from './server/common/router';
import { User } from './server/models';
import { FilesModule } from './server/api/files/files.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    RouterModule.forRoutes(routes),
    AuthModule, 
    UserModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    FilesModule
  ],
  providers: [],
  controllers: [],
  
})
export class AppModule {}
