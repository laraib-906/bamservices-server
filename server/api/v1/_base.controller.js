export class BaseController {
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
	response(res, data, statusCode, message) {

		let responseObject = {};
		responseObject.data = data || '';
		responseObject.message = message || '';
		return res.status(statusCode).json(responseObject);
	}
}
