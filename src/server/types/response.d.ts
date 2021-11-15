export interface IResponseObject {
	data?: object;
	message?: string
}


export type IMongooseDeleteObject = {
    ok?: number;
    n?: number;
} & {
    deletedCount?: number;
}