/** @format */

const router = require('express').Router();

const Users = require('./users-model.js');
const restricted = require('../auth/restricted-middleware.js');
const checkRole = require('../auth/check-role-middleware.js');

router.get('/', restricted, checkRole(1), (req, res) => {
	Users.find()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => res.send(err));
});

router.get('/:id', restricted, checkRole(1), (req, res) => {
	const { id } = req.params;
	Users.find(id)
		.then((user) => {
			if (user) {
				req.user = user;
				res.status(200).json(req.user);
			} else {
				res.status(400).json({
					message: "The ID of this User doesn't exist. Please check again.",
				});
			}
		})
		.catch((err) =>
			res.status(500).json({
				message: 'Something went wrong with the request.',
				err,
			})
		);
});

module.exports = router;
