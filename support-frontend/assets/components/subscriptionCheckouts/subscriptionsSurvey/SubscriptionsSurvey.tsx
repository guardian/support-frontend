// ----- Imports ----- //
import AnchorButton from 'components/button/anchorButton';
import Content from 'components/content/content';
import Text from 'components/text/text';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import './subscriptionsSurvey.scss';

type PropTypes = {
	product: SubscriptionProduct;
};

const surveyLinks: Partial<Record<SubscriptionProduct, string>> = {
	GuardianWeekly:
		'https://guardiannewsandmedia.formstack.com/forms/guardian_weekly_2022',
};

export function SubscriptionsSurvey({
	product,
}: PropTypes): JSX.Element | null {
	const surveyLink = surveyLinks[product];
	const title = 'Tell us about your subscription';
	const message =
		'Please take this short survey to tell us why you purchased your subscription';

	return surveyLink ? (
		<Content>
			<section className="component-subscriptions-survey">
				<Text title={title}>{message}</Text>
				<AnchorButton
					href={surveyLink}
					appearance="secondary"
					aria-label="Link to subscription survey"
				>
					Share your thoughts
				</AnchorButton>
			</section>
		</Content>
	) : null;
}
