import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesSchema } from './files.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Files',
        schema: FilesSchema
      }
    ])
  ],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
