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
		.map(({ name, value }: { name: string; value: string }) => {
			if (
				(name === 'utm_source' && value === 'EMAIL') ||
				(name === 'utm_medium' && value === 'email_editorial') ||
				(name === 'utm_medium' && value === 'email_marketing')
			) {
				return true;
			}

			return false;
		})
		.some(Boolean);

	return { isMarketingEmailSession };
};

export default useEmailMarketingSession;
