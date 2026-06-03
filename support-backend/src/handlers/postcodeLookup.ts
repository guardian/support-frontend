import type { RequestHandler } from 'express';
import type { IdealPostcodeService } from '../services/idealPostcodeService';

export const buildPostcodeLookupHandler =
	(
		idealPostcodeService: IdealPostcodeService,
	): RequestHandler<{ postcode: string }> =>
	async (req, res) => {
		const postcode = decodeURIComponent(req.params.postcode);

		console.log(`Postcode lookup handler called with ${postcode}`);

		if (postcode.length > 10) {
			res.status(400).send();
			return;
		}

		try {
			const addresses = await idealPostcodeService.find(postcode);
			res.json(addresses);
		} catch (error) {
			console.error(error);
			res.status(500).send();
		}
	};
