import type {
	CountryGroupId,
	SupportRegionId,
} from '@modules/internationalisation/countryGroup';
import type { Institution } from 'helpers/globalsAndSwitches/studentLandingPageSettings';
import { privacyLink } from 'helpers/legal';
import { getProductLabel } from 'helpers/productCatalog';
import { getSupportRegionIdConfig } from '../../../supportRegionConfig';

const studentTsAndCs: Partial<Record<CountryGroupId, JSX.Element>> = {
	AUDCountries: (
		<div>
			Access to the {getProductLabel('SupporterPlus')} subscription offered
			under this agreement is strictly limited to currently enrolled students of
			the University of Technology Sydney (UTS). Redemption of the offer is
			conditional upon registration using a valid and active UTS email address.
			Your email address may be subjected to an internal verification process to
			confirm your eligibility as a UTS student – you may refer to the
			Guardian’s{` `}
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
			18+ in the USA. You must have a Student Beans account to access this
			offer. Subscription is for 1 year and does not auto renew.
		</>
	),
	GBPCountries: (
		<>
			Access to this offer is strictly limited to verified full time students
			18+ in the UK. You must have a Student Beans account to access this offer.
			Subscription is for 1 year and does not auto renew.
		</>
	),
	Canada: (
		<>
			Access to this offer is strictly limited to verified full time students
			18+ in Canada. You must have a Student Beans account to access this offer.
			Subscription is for 1 year and does not auto renew.
		</>
	),
};

const tooledInstitutionStudentTsAndCs = (
	institution: Institution,
): JSX.Element => {
	return (
		<div>
			Access to the {getProductLabel('SupporterPlus')} subscription offered
			under this agreement is strictly limited to currently enrolled students of
			the {institution.name} ({institution.acronym}). Redemption of the offer is
			conditional upon registration using a valid and active{' '}
			{institution.acronym} email address. Your email address may be subjected
			to an internal verification process to confirm your eligibility as a{' '}
			{institution.acronym} student – you may refer to the Guardian’s{` `}
			<a href={privacyLink} target="_blank" rel="noopener noreferrer">
				privacy policy
			</a>{' '}
			which explains how personal information is handled by the Guardian. The
			Guardian reserves the right to cancel, suspend, or revoke any subscription
			claimed through this offer if it is reasonably suspected or determined
			that the subscriber does not meet the eligibility criteria.
		</div>
	);
};

export function getStudentTsAndCs(
	supportRegionId: SupportRegionId,
	institution?: Institution,
): JSX.Element | undefined {
	const { countryGroupId } = getSupportRegionIdConfig(supportRegionId);
	if (institution) {
		return tooledInstitutionStudentTsAndCs(institution);
	}
	return studentTsAndCs[countryGroupId];
}
