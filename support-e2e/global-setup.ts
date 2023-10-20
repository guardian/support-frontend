import { promisify } from 'util';
import { BS_LOCAL_ARGS, bsLocal } from './browserstack.config';

const sleep = promisify(setTimeout);
const redColour = '\x1b[31m';
const whiteColour = '\x1b[0m';
module.exports = async () => {
	console.log('Starting BrowserStackLocal ...');
	// Starts the Local instance with the required arguments
  let shortCircuitCount = 0;
	let localResponseReceived = false;
	bsLocal.start(BS_LOCAL_ARGS, (err) => {
		if (err) {
			console.error(
				`${redColour}Error starting BrowserStackLocal${whiteColour}`,
			);
		} else {
			console.log('BrowserStackLocal Started');
		}
		localResponseReceived = true;
	});
	while (!localResponseReceived) {
    shortCircuitCount ++;
    if (shortCircuitCount < 10) {
      await sleep(1000);
    } else {
      console.error('Tried 10 times to start BrowserStackLocal and failed');
      break;
    }
	}
};
