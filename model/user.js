/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  username: String,
  provider: String,
  hashed_password: String,
  apikey: String,
  salt: String,
  last_login: Date,
  password_reset_token: {type: String, default: null},
  change_username_token: {type: String, default: null},
  created_at: {type: Date, default: new Date()},
  updated_at: Date
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
      return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
      if (!password) return '';
      try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      } catch (err) {
        console.log("Error in encrypt password - ", err.stack);
        return '';
      }
  }
};

UserSchema.statics.load = function(username) {
	return mongoose.model('User').findOne({username: username})
		.exec();
}

UserSchema.statics.create = function(obj, password, next) {
  try {
    let userName = obj.username;
    let apikey = obj.apikey;
    var user_hash = {username: userName,
                                 email: userName,
                                 name: obj.name,
                                 phone: obj.phone,
                                 created_at: new Date(),
                                 updated_at: new Date(),
                     };
    mongoose.model('User').findOneAndUpdate({username: userName},
            user_hash,
            {upsert: true, new: true}).exec(function (err, user) {
			if (err) { return next(err); }
			if (password) user.password = password;
			user.save(function(err, updatedUser) {
				if (err) {
				console.log("Error in creating new user account ", user, err.stack);
				return next(err);
				}
				return next(null,updatedUser);
			});
	});

  } catch (e) {
    console.log("Error in UserSchema.static.create: ", e.stack);
    return next(e, null);
  };
};
mongoose.model('User', UserSchema);