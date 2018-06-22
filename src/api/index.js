import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.post('/libraryBot', (req, res) => {
		// return res.json({req.body});
		switch(req.body.queryResult.action){
			case 'searchBookTitle':
				console.log("Searching book!");
				break;

		}
	});

	return api;
}
