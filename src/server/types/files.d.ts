
export type IFileMimetype = 'application/pdf' | 'application/docs'

export interface IFiles {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: IFileMimetype;
    destination: string;
    filename: string;
    path: string;
    size: number;
}