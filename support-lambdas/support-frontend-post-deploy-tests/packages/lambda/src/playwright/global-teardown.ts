import { bsLocal } from './browserstack.config';

export const globalTeardown = () => {
	if (bsLocal.isRunning()) {
		bsLocal.stop(() => {
			console.log('Stopped BrowserStackLocal');
		});
	}
};
