import { Response } from "express";
import { IResponseObject } from '../../../types/response';
export abstract class BaseController {
	/**
	 * This is the implementation that we will leave to the
	 * subclasses to figure out.
	 */

	/**
	 * Response creator
	 * @param  {Response} res
	 * @param  {any} data
	 * @param  {number} statusCode
	 * @param  {string} message
	 */
	public response(res: Response, data: any, statusCode: number, message: string) {

		let responseObject: IResponseObject = {};
		responseObject.data = data || '';
		responseObject.message = message || '';
		return res.status(statusCode).json(responseObject);
	}
}
