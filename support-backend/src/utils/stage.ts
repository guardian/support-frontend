export type Stage = 'CODE' | 'PROD';

export const stageFromEnvironment = (): Stage => {
	const stage = process.env.STAGE;
	if (stage === undefined) {
		throw new Error('STAGE is not defined as an environment variable');
	}
	return stage as Stage;
};

export const isTest = (): boolean => !!process.env.JEST_WORKER_ID;
