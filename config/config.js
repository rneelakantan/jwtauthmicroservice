module.exports = function(env) {
	if (env === 'development') {
		return require('./development.json');
	};
};