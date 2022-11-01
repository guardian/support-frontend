export type ErrorCollection = Partial<Record<string, string[]>>;

export function errorCollectionHasErrors(
	errorCollection: ErrorCollection,
): boolean {
	return Object.values(errorCollection).some((errorList) => errorList?.length);
}
