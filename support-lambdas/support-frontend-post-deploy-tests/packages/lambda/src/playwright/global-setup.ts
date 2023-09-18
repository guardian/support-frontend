import { BS_LOCAL_ARGS, bsLocal } from './browserstack.config';

const redColour = '\x1b[31m';
const whiteColour = '\x1b[0m';

export const globalSetup = () => {
	console.log('Starting BrowserStackLocal ...');
	// Starts the Local instance with the required arguments
	bsLocal.start(BS_LOCAL_ARGS, (err) => {
		if (err) {
			console.error(
				`${redColour}Error starting BrowserStackLocal${whiteColour}`,
			);
		} else {
			console.log('BrowserStackLocal Started');
		}
	});
};
