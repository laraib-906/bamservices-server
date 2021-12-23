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
    fileId: string;

    @Prop({
        type: Types.String,
        required: true
    })
    metaDataId: string;

    @Prop({
        type: Types.String,
        required: true
    })
    name: string;

    @Prop({
        type: Types.String,
        required: true
    })
    filename: string;

    @Prop({
        type: Types.String,
        required: true
    })
    bucket: string;


    @Prop({
        type: Types.String,
        required: true
    })
    timeCreated: string;


    @Prop({
        type: Types.String,
        required: true
    })
    downloadLink: string;
}

const FilesSchemaClass = SchemaFactory.createForClass(Files);

FilesSchemaClass.plugin(mongoosePaginate);

export const FilesSchema = FilesSchemaClass;
