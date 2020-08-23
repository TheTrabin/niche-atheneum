/** @format */

const router = require('express').Router();

const Campaign = require('./campaign-model.js');
const { validateCampaign } = require('../middleware/middleware');
const restricted = require('../auth/restricted-middleware.js');
const Prod = require('../prediction/prediction-model');

router.get('/', (req, res) => {
	Campaign.find()
		.then((campaign) => {
			res.status(200).json(campaign);
		})
		.catch((err) => {
			res.status(500).json({
				message: "Can't locate the Campaign. Here's why: ",
				err,
			});
		});
});

router.get('/:id', restricted, (req, res) => {
	const { id } = req.params;
	Campaign.findById(id)
		.then((camp) => {
			if (camp) {
				req.camp = camp;
				res.status(200).json(req.camp);
			} else {
				res.status(404).json({
					message:
						'The ID of this Campaign is non-existant. Please check it and try again.',
				});
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				message: "Something went wrong with the request. Here's some Info: ",
				error,
			});
		});
});

router.post('/', restricted, validateCampaign, (req, res, next) => {
	const CampInfo = req.body;
	Campaign.add(CampInfo)
		.then((camp) => {
            res.status(201).json(camp);
        })
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: 'There was an error while saving the campaign to the database: ',
				err,
			});
		});
});

router.delete('/:id', (req, res) => {
	const { id } = req.params;

	Campaign.remove(id)
		.then((deleted) => {
			if (deleted) {
				res.json({ removed: deleted });
			} else {
				res
					.status(404)
					.json({ message: 'Could not find campaign with given id' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Failed to delete campaign' });
		});
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const changes = req.body;

	Campaign.findById(id)
		.then((camp) => {
			if (camp) {
				Campaign.update(changes, id).then((updatedCampaign) => {
					res.json(updatedCampaign);
				});
			} else {
				res
					.status(404)
					.json({ message: 'Could not find Campaign with given id' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Failed to update Campaign' });
		});
});

router.get('/:id/rewards', restricted, (req, res, next) => {
	const { id } = req.params;

	Campaign.rewardsByCampaign(id)
		.then((rewards) => {
			if (rewards.length) {
				res.json(rewards);
			} else {
				res
					.status(404)
					.json({ message: 'could not find rewards for campaign' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Failed to get rewards', err });
		});
});

router.get('/:id/updates', restricted, validateId, (req, res, next) => {
	const { id } = req.params;

	Campaign.updatesByCampaign(id)
		.then((upd) => {
			if (upd.length) {
				res.json(upd);
			} else {
				res
					.status(404)
					.json({ message: 'could not find updates for campaign' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Failed to get updates', err });
		});
});

router.get('/:id/rewardupdate', restricted, validateId, (req, res, next) => {
	const { id } = req.params;

	Campaign.RandUByCampaign(id)
		.then((ru) => {
			if (ru.length) {
				res.json(ru);
			} else {
				res.status(404).json({ message: 'No Rewards nor Updates found.' });
			}
		})
		.catch((err) => {
			res.status(500).json({
				message: 'failed to get infomation. You sure this exists? ',
				err,
			});
		});
});

function validateId() {
	return (req, res, next) => {
		if (req.params.id) {
			Campaign.get(req.params.id)
				.then((camp) => {
					if (camp) {
						req.camp = camp;
						next();
					} else {
						res.status(400).json({
							message: "Whoops! Can't find that Project. Try again.",
						});
					}
				})
				.catch((err) => {
					res.status(500).json({
						message: "Huh. Nothing's Happening. Check this out: ",
						err,
					});
				});
		} else {
			res.status(400).json({
				errorMessage: 'This is a little Embarrasing. Maybe try again?',
			});
		}
	};
}
module.exports = router;
