export const asRetryError = (error: unknown) => {
	if (error instanceof Error) {
		return mapToRetryError(error);
	}
	return new Error(`Unknown error type: ${JSON.stringify(error)}`);
};

const mapToRetryError = (error: Error) => {
	return error;
};
