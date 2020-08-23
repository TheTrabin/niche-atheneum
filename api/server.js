/** @format */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const restricted = require("../routes/auth/restricted-middleware.js");
const checkRole = require('../routes/auth/check-role-middleware.js');

//authorization + Userbase
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router');

//routes
//monsters
const mobRouter = require('../routes/mobs/mob-router.js');

//items
// const itemsRouter = require('../routes/items/items-router');
// const armorRouter = require('../routes/items/armor/armor-router');
// const weaponsRouter = require('../routes/items/weapons/weapons-router')
// const shieldsRouter = require('../routes/items/shields/shields-router')
// const relicsRouter = require('../routes/items/relics/relics-router')

//core information
// const elementsRouter = require('../routes/elements/elements-router')
// const classesRouter = require('../routes/classes/classes-router')
// const loreRouter = require('../routes/lore/lore-router')
// const questRouter = require('../routes/quests/quest-router')
// const campaignRouter = require('../routes/campaigns/campaign-router')

//server instance
const server = express();
//protection
server.use(helmet());
server.use(cors());

server.use(express.json());

//user authentication route
server.use('/api/auth', authRouter);

//admin only route to handle userlist and user changes
server.use('/api/users', restricted, checkRole(1), usersRouter);

//monster route
server.use('/api/mob', mobRouter);

//items routes
// server.use('/api/items', restricted, itemsRouter);
// server.use('/api/items/armor', restricted, armorRouter);
// server.use('/api/items/weapons', restricted, weaponsRouter);
// server.use('/api/items/shields', restricted, shieldsRouter);
// server.use('/api/items/relics', restricted, relicsRouter);

//core information routes
// server.use('/api/elements', restricted, elementsRouter);
// server.use('/api/classes', restricted, classesRouter);
// server.use('/api/lore', restricted, loreRouter);
// server.use('/api/quests', restricted, questRouter);
// server.use('/api/campaigns', restricted, campaignRouter);

server.get('/', (req, res) => {
	const messageOfTheDay = process.env.MOTD || 'Hello World';
	res.send(
		`<h2>Hi There! Let's get into some Campaigning! ${messageOfTheDay}</h2>`
	);
	res.status(200).json({ api: 'up', MOTD: messageOfTheDay });
});

module.exports = server;
