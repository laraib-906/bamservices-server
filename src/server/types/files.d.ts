
import { Document, PaginateModel } from "mongoose";
export type IFileMimetype = 'application/pdf' | 'application/docs'

export interface IFiles extends Document {
    kind: string;
    id: string;
    name: string;
    mimeType: string;
}

export interface IFilesModel<T extends Document> extends PaginateModel<T> { }
