import type { RequestHandler } from 'express';

export const buildDeliveryAgentsHandler =
	(): RequestHandler<{ postcode: string }> => (req, res) => {
		const postcode = decodeURIComponent(req.params.postcode);
		console.log(`Delivery agents handler called with ${postcode}`);
		if (postcode.length > 10) {
			res.status(400).send();
			return;
		}
		try {
			res.json({ type: 'NotCovered' });
		} catch (error) {
			console.error(error);
			res.status(500).send();
		}
	};
