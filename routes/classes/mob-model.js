/** @format */

const db = require('../database/dbConfig.js');


module.exports = {
	add,
	find,
	findBy,
	findById,
	remove,
	update,
	rewardsByCampaign,
	updatesByCampaign,
	RandUByCampaign,
};

function find() {
	return db('campaign');
}

function findBy(filter) {
	return db('campaign').where(filter).orderBy('id');
}

async function add(campaign) {
	try {
		const [id] = await db('campaign').insert(campaign, 'id');

		return findById(id);
	} catch (error) {
		throw error;
	}
}

function findById(id) {
	return db('campaign').where({ id }).first();
}

function remove(id) {
	return db('campaign').where('id', id).del();
}

function update(changes, id) {
    return db("campaign")
    .where({id})
    .update(changes)
    .then(count => {
        return findById(id);
    })
    }

function rewardsByCampaign(id) {
	return db('campaign as c')
		.where('c.id', id)
		.join('rewards as r', 'r.campaign_id', 'c.id')
		.select('r.name', 'r.description');
}
function updatesByCampaign(id) {
	return db('campaign as c')
		.where('c.id', id)
		.join('updates as u', 'u.campaign_id', 'c.id')
		.select('u.name', 'u.description');
}
function RandUByCampaign(id) {
	return db('campaign as c')
		.where('c.id', id)
		.join(
			'updates as u',
			'rewards as r',
			'r.campaign_id',
			'u.campaign_id',
			'c.id'
		)
		.select('r.name', 'r.description', 'u.name', 'u.description');
}

