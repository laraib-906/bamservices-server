import { SchemaTypes, Document, ObjectId } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

const Types = SchemaTypes;

export type FilesDocument = Files & Document;

@Schema()
export class Files {

    @Prop({
        type: Types.String,
        required: true
    })
    kind: string;

    @Prop({
        type: Types.String,
        required: true
    })
    id: string;

    @Prop({
        type: Types.String,
        required: true
    })
    name: string;

    @Prop({
        type: Types.String,
        required: true
    })
    mimeType: string;
}

const FilesSchemaClass = SchemaFactory.createForClass(Files);

FilesSchemaClass.plugin(mongoosePaginate);

export const FilesSchema = FilesSchemaClass;
