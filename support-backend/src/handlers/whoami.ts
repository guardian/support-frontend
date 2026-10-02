// SPIKE - do not merge.
import type { RequestHandler } from 'express';

export const whoamiHandler: RequestHandler = (req, res) => {
	res.json(req.oktaUser ?? { signedIn: false });
};
