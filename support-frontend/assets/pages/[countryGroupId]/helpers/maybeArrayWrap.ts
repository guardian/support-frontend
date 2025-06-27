export const maybeArrayWrap = <T>(value: T | undefined): T[] | undefined => {
	if (value === undefined) {
		return undefined;
	}

	return [value];
};
