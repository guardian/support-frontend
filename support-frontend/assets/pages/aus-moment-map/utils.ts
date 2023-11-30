const campaignCode = 'AUSELECTION2022';
export const contributeUrl = (componentId: string): string =>
	`https://support.theguardian.com/au/contribute?acquisitionData=%7B%22source%22%3A%22GUARDIAN_WEB%22%2C%22componentType%22%3A%22ACQUISITIONS_OTHER%22%2C%22componentId%22%3A%22${componentId}%22%2C%22campaignCode%22%3A%22${componentId}%22%7D&INTCMP=${campaignCode}`;
