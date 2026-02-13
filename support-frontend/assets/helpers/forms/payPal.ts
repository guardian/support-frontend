export const getPaypalClientId = (isTestUser: boolean): string => {
	const clientIdMap = window.guardian.payPalClientId;
	return isTestUser ? clientIdMap.test : clientIdMap.default;
};
