// ----- Imports ----- //
import type { ContributionType } from 'helpers/contributions';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
// ---- Types ----- //
type PropTypes = {
	contributionType: ContributionType;
	isRecurringContributor: boolean;
	checkoutFormHasBeenSubmitted: boolean;
};
// ----- Component ----- //
export function ExistingRecurringContributorErrorMessage(props: PropTypes) {
	const manageUrl =
		'https://manage.theguardian.com/contributions?INTCMP=existing-contributor-from-support';

	const onClick = (event) => {
		event.preventDefault();
		trackComponentClick('send-to-mma-already-contributor');
		window.location.assign(manageUrl);
	};

	if (
		props.contributionType === 'ONE_OFF' ||
		!props.isRecurringContributor ||
		!props.checkoutFormHasBeenSubmitted
	) {
		return null;
	}

	return (
		<a
			className={classNameWithModifiers('form__error', [
				'existing-contributor',
			])}
			href={manageUrl}
			onClick={onClick}
		>
			We’ve checked, and you are already a recurring contributor. Thank you so
			much for your ongoing support. If you’d like to give more, either select a
			single contribution or increase the amount of your existing contribution
			by going to your <span className="underline">account settings.</span>
		</a>
	);
}
