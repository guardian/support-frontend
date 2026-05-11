import { Router } from 'express';
import { postcodeLookupHandler } from '../handlers/postcodeLookup';

export const apiRouter = Router();

apiRouter.get('/postcode-lookup/:postcode', postcodeLookupHandler);
