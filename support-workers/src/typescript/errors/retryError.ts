export enum RetryErrorType {
	RetryNone = 'RetryNone',
	RetryLimited = 'RetryLimited',
	RetryUnlimited = 'RetryUnlimited',
}

export class RetryError extends Error {
	constructor(errorType: string, message: string) {
		super(message);
		this.name = errorType; // This is what the step function retry policy uses
	}
}

export const retryNone = (message: string) =>
	new RetryError(RetryErrorType.RetryNone, message);
export const retryLimited = (message: string) =>
	new RetryError(RetryErrorType.RetryLimited, message);
export const retryUnlimited = (message: string) =>
	new RetryError(RetryErrorType.RetryUnlimited, message);
