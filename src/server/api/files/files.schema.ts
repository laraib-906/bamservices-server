import { SchemaTypes, Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

const Types = SchemaTypes;

export type FilesDocument = Files & Document;

@Schema()
export class Files {
  
}

const FilesSchemaClass = SchemaFactory.createForClass(Files);

FilesSchemaClass.plugin(mongoosePaginate);

export const FilesSchema = FilesSchemaClass;
