import { storage } from '@guardian/libs';
import type {
	AcquisitionQueryParameters,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';

const useEmailMarketingSession = (): { isMarketingEmailSession: boolean } => {
	const acquisitionData = storage.session.get(
		'acquisitionData',
	) as ReferrerAcquisitionData | null;
	let queryParams: AcquisitionQueryParameters = [];

	if (acquisitionData) {
		try {
			if (acquisitionData.queryParameters) {
				queryParams = acquisitionData.queryParameters;
			}
		} catch (error) {
			console.error(
				`Failed to parse acquisitionData from session storage`,
				error,
			);
		}
	}

	const isMarketingEmailSession = queryParams.some(
		({ name, value }) =>
			(name === 'utm_source' && value === 'EMAIL') ||
			(name === 'utm_medium' && value === 'email_editorial') ||
			(name === 'utm_medium' && value === 'email_marketing'),
	);

	return { isMarketingEmailSession };
};

export default useEmailMarketingSession;
