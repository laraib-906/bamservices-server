import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/server/models';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: User
      }
    ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
