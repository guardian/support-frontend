export const isEmpty: (arg0?: string | null) => boolean = (input) =>
	typeof input === 'undefined' || input == null || input.trim().length === 0;

export const isValidZipCode = (zipCode: string): boolean =>
	/^\d{5}(-\d{4})?$/.test(zipCode);

export const notLongerThan = (
	value: string | null,
	maxLength: number,
): boolean => {
	if (!value) {
		return true;
	}
	return value.length < maxLength;
};

// regex from: https://gist.github.com/simonwhitaker/5748487?permalink_comment_id=4648104#gistcomment-4648104
// based on UK Gov logic: https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/488478/Bulk_Data_Transfer_-_additional_validation_valid_from_12_November_2015.pdf
export function isValidPostcode(postcode: string): boolean {
	const postcodeRegex =
		/^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) {0,1}[0-9][A-Za-z]{2})$/g;
	return postcodeRegex.test(postcode);
}
