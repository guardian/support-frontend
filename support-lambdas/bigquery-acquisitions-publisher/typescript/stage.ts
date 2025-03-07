const Code = 'CODE';
const Prod = 'PROD';
export type Stage = typeof Code | typeof Prod;

export const getStage = (): Stage => {
	if (process.env.STAGE !== Code && process.env.STAGE !== Prod) {
		throw new Error(`Invalid stage: ${process.env.STAGE}`);
	}

	return process.env.STAGE as Stage;
};
