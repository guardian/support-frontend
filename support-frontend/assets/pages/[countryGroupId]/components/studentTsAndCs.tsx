import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { privacyLink } from 'helpers/legal';

const studentTsAndCs: Partial<Record<CountryGroupId, JSX.Element>> = {
	AUDCountries: (
		<div>
			Access to the All-access digital subscription offered under this agreement
			is strictly limited to currently enrolled students of the University of
			Technology Sydney (UTS). Redemption of the offer is conditional upon
			registration using a valid and active UTS email address. Your email
			address may be subjected to an internal verification process to confirm
			your eligibility as a UTS student – you may refer to the Guardian’s
			<a href={privacyLink}>Privacy Policy</a> which explains how personal
			information is handled by the Guardian. The Guardian reserves the right to
			cancel, suspend, or revoke any subscription claimed through this offer if
			it is reasonably suspected or determined that the subscriber does not meet
			the eligibility criteria.
		</div>
	),
};
interface StudentTsAndCsProps {
	countryGroupId: CountryGroupId;
}
export function StudentTsAndCs({
	countryGroupId,
}: StudentTsAndCsProps): JSX.Element {
	return <div>{studentTsAndCs[countryGroupId]}</div>;
}
