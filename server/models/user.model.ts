import { Schema, model } from "mongoose";
import { IUser, IUserModel } from '../../types/user';
import crypto from 'crypto';

export const UserModelName = 'User';
const authTypes = ['github', 'twitter', 'facebook', 'google'];

const { Types } = Schema;

const UserSchema = new Schema<IUserModel<IUser>>({
	firstName: { type: Types.String },
	lastName: { type: Types.String },
	email: {
		type: Types.String,
		unique: true,
		lowercase: true,
		required() {
			if (authTypes.indexOf(this.provider) === -1) {
				return true;
			} else {
				return false;
			}
		}
	},
	password: {
		type: String,
		required() {
			if (authTypes.indexOf(this.provider) === -1) {
				return true;
			} else {
				return false;
			}
		}
	},
	images: {
		key: {
			type: Types.String
		},
		url: {
			type: Types.String
		}
	},
	company: { type: Types.String, requied: true },
	suite: { type: Types.String, requied: true },
	provider: String,
	salt: String,
	role: String,
	phone: { type: Types.String },
	address: { type: Types.String, requied: true },
	city: { type: Types.String, requied: true },
	country: { type: Types.String, requied: true },
	postalCode: { type: Types.String, requied: true },
	profilePicture: { type: Types.String },
	resetPasswordToken: String,
	facebook: {},
	twitter: {},
	google: {},
	github: {},
	date: {
		type: Types.Date,
		default: Date.now()
	}
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
	.virtual('profile')
	.get(function () {
		return {
			name: this.name
		};
	});

// Non-sensitive info we'll be putting in the token
UserSchema
	.virtual('token')
	.get(function () {
		return {
			_id: this._id
		};
	});

/**
 * Validations
 */

// Validate empty email
UserSchema
	.path('email')
	.validate(function (email) {
		return email.length;
	}, 'Email cannot be blank');

// Validate empty password
UserSchema
	.path('password')
	.validate(function (password) {
		return password.length;
	}, 'Password cannot be blank');

// Validate email is not taken
UserSchema
	.path('email')
	.validate(function (value) {
		return this.constructor.findOne({ email: value }).exec()
			.then(user => {
				if (user) {
					if (this.id === user.id) {
						return true;
					}
					return false;
				}
				return true;
			})
			.catch(err => {
				throw err;
			});
	}, 'The specified email address is already in use.');

var validatePresenceOf = function (value) {
	return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
	.pre<IUser>('save', function (next) {
		const _this: any = this;
		// Handle new/update passwords
		if (!this.isModified('password')) {
			return next();
		}

		if (!validatePresenceOf(_this.password)) {
			return next();
		}

		// Make salt with a callback
		_this.makeSalt((saltErr, salt) => {
			if (saltErr) {
				return next(saltErr);
			}
			_this.salt = salt;
			_this.encryptPassword(_this.password, (encryptErr, hashedPassword) => {
				if (encryptErr) {
					return next(encryptErr);
				}
				_this.password = hashedPassword;
				return next();
			});
		});
	});

/**
 * Methods
 */
UserSchema.methods = {
	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} password
	 * @param {Function} callback
	 * @return {Boolean}
	 * @api public
	 */
	authenticate(password, callback) {
		const _this: any = this;
		if (!callback) {
			return _this.password === _this.encryptPassword(password);
		}

		_this.encryptPassword(password, (err, pwdGen) => {
			if (err) {
				return callback(err);
			}

			if (_this.password === pwdGen) {
				return callback(null, true);
			} else {
				return callback(null, false);
			}
		});
	},

	/**
	 * Make salt
	 *
	 * @param {Number} [byteSize] - Optional salt byte size, default to 16
	 * @param {Function} callback
	 * @return {String}
	 * @api public
	 */
	makeSalt(...args) {
		var defaultByteSize = 16;
		let byteSize;
		let callback;

		if (typeof args[0] === 'function') {
			callback = args[0];
			byteSize = defaultByteSize;
		} else if (typeof args[1] === 'function') {
			callback = args[1];
		} else {
			throw new Error('Missing Callback');
		}

		if (!byteSize) {
			byteSize = defaultByteSize;
		}

		return crypto.randomBytes(byteSize, (err, salt) => {
			if (err) {
				return callback(err);
			} else {
				return callback(null, salt.toString('base64'));
			}
		});
	},

	/**
	 * Encrypt password
	 *
	 * @param {String} password
	 * @param {Function} callback
	 * @return {String}
	 * @api public
	 */
	encryptPassword(password, callback) {
		const _this: any = this;
		if (!password || !_this.salt) {
			if (!callback) {
				return null;
			} else {
				return callback('Missing password or salt');
			}
		}

		var defaultIterations = 10000;
		var defaultKeyLength = 64;
		var salt = Buffer.from(_this.salt, 'base64');

		if (!callback) {
			return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha256')
				.toString('base64');
		}

		return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha256', (err, key) => {
			if (err) {
				return callback(err);
			} else {
				return callback(null, key.toString('base64'));
			}
		});
	}
};


export const User = model<IUser>(UserModelName, UserSchema) as IUserModel<IUser>;
