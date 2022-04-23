import { Schema, model } from 'mongoose';
import { IFilesModel, IFiles } from '../../types/files';
import paginate from "mongoose-paginate-v2";

export const FilesName = 'Files';
const { Types } = Schema;

const FilesSchema = new Schema<IFilesModel<IFiles>>({
  fileId: {
    type: Types.String,
    required: true
  },
  metaDataId: {
    type: Types.String,
    required: true
  },
  name: {
    type: Types.String,
    required: true
  },
  filename: {
    type: Types.String,
    required: true
  },
  bucket: {
    type: Types.String,
    required: true
  },
  timeCreated: {
    type: Types.String,
    required: true,
    default: Date.now()
  },
  downloadLink: {
    type: Types.String,
    required: true
  }
});

FilesSchema.plugin(paginate);

export const Files = model<IFiles>(FilesName, FilesSchema) as IFilesModel<IFiles>;