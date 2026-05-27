import { getSession } from 'helpers/storage/storage';
import type {
	AcquisitionQueryParameters,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';

const useEmailMarketingSession = (): { isMarketingEmailSession: boolean } => {
	const acquisitionData = getSession('acquisitionData');
	let queryParams: AcquisitionQueryParameters = [];
	if (acquisitionData) {
		try {
			const parsedAcquisitionData = JSON.parse(
				acquisitionData,
			) as ReferrerAcquisitionData;
			if (parsedAcquisitionData.queryParameters) {
				queryParams = parsedAcquisitionData.queryParameters;
			}
		} catch (error) {
			console.error(
				`Failed to parse acquisitionData from session storage`,
				error,
			);
		}
	}

	const isMarketingEmailSession = queryParams
		.map((param: { name: string; value: string }) => {
			if (param.name === 'utm_source' && param.value === 'EMAIL') {
				return true;
			}
			if (param.name === 'utm_medium' && param.value === 'email_editorial') {
				return true;
			}
			if (param.name === 'utm_medium' && param.value === 'email_marketing') {
				return true;
			}
			return false;
		})
		.some((isEmailUtm: boolean) => isEmailUtm);

	return { isMarketingEmailSession };
};

export default useEmailMarketingSession;
