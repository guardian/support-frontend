import { Link } from '@guardian/source-react-components';
import { getUserCanTakeOutContribution } from 'helpers/redux/selectors/formValidation/personalDetailsValidation';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { NonValidationFailureMessage } from './nonValidationFailureMessage';

const manageUrl =
	'https://manage.theguardian.com/contributions?INTCMP=existing-contributor-from-support';

export function ExistingRecurringContributorMessage(): JSX.Element | null {
	const isAlreadyARecurringContributor = !useContributionsSelector(
		getUserCanTakeOutContribution,
	);

	function onClick() {
		trackComponentClick('send-to-mma-already-contributor');
	}

	if (isAlreadyARecurringContributor) {
		return (
			<NonValidationFailureMessage message="We've checked, and you are already a recurring contributor">
				<p>
					Thank you so much for your ongoing support. If you'd like to give
					more, either select a single contribution or increase the amount of
					your existing contribution by going to your{' '}
					<Link priority="secondary" href={manageUrl} onClick={onClick}>
						account settings.
					</Link>
				</p>
			</NonValidationFailureMessage>
		);
	}

	return null;
}
