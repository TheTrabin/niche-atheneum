/** @format */

function makeCheckRoleMiddleware(role) {
	return function (req, res, next) {
		if (req.decodedJwt.role && req.decodedJwt.role === role) {
			next();
		} else {
			res.status(403).json({ you: 'are the wrong role' });
		}
	};
}

module.exports = makeCheckRoleMiddleware;
