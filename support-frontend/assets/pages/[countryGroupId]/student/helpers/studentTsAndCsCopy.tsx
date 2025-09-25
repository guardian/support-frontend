import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { privacyLink } from 'helpers/legal';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';

const studentTsAndCs: Partial<Record<CountryGroupId, JSX.Element>> = {
	AUDCountries: (
		<div>
			Access to the All-access digital subscription offered under this agreement
			is strictly limited to currently enrolled students of the University of
			Technology Sydney (UTS). Redemption of the offer is conditional upon
			registration using a valid and active UTS email address. Your email
			address may be subjected to an internal verification process to confirm
			your eligibility as a UTS student – you may refer to the Guardian’s{` `}
			<a href={privacyLink} target="_blank" rel="noopener noreferrer">
				privacy policy
			</a>{' '}
			which explains how personal information is handled by the Guardian. The
			Guardian reserves the right to cancel, suspend, or revoke any subscription
			claimed through this offer if it is reasonably suspected or determined
			that the subscriber does not meet the eligibility criteria.
		</div>
	),
	UnitedStates: (
		<>
			Access to this offer is strictly limited to verified full time students
			16+ in the USA. You must have a Student Beans account to access this
			offer. Subscription is for 1 year and does not auto renew.
		</>
	),
	GBPCountries: (
		<>
			Access to this offer is strictly limited to verified full time students
			16+ in the UK. You must have a Student Beans account to access this offer.
			Subscription is for 1 year and does not auto renew.
		</>
	),
	Canada: (
		<>
			Access to this offer is strictly limited to verified full time students
			16+ in Canada. You must have a Student Beans account to access this offer.
			Subscription is for 1 year and does not auto renew.
		</>
	),
};

export function getStudentTsAndCs(geoId: GeoId): JSX.Element | undefined {
	const { countryGroupId } = getGeoIdConfig(geoId);
	return studentTsAndCs[countryGroupId];
}
