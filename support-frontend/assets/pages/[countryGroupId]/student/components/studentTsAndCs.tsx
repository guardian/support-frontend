import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { Container } from 'components/layout/container';
import { privacyLink } from 'helpers/legal';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { container } from './studentTsAndCsStyles';

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
};

export function StudentTsAndCs({ geoId }: { geoId: GeoId }): JSX.Element {
	const { countryGroupId } = getGeoIdConfig(geoId);
	return (
		<Container sideBorders cssOverrides={container}>
			{studentTsAndCs[countryGroupId]}
		</Container>
	);
}
