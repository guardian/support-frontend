import { logException } from './logger';

export const catchPromiseHandler =
	(message: string) =>
	(err: unknown): void => {
		if (err instanceof Error) {
			logException(`${message} - message: ${err.message}`);
		} else {
			logException(`${message}`);
		}
	};
