import { Router } from 'express';

export const apiRouter = Router();

interface Address {
	lineOne?: string;
	lineTwo?: string;
	city?: string;
	state?: string;
	postCode?: string;
	country?: string;
}

apiRouter.get('/postcode-lookup/:postcode', (req, res) => {
	const postcode = decodeURIComponent(req.params.postcode);
	if (postcode.length > 10) {
		res.status(400).send();
		return;
	}
	const addresses: Address[] = [];
	res.json(addresses);
});
