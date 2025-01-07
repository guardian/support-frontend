import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { productCatalogGuardianAdLite } from 'helpers/productCatalog';
import type { GuardianAdLiteCardsProps } from 'pages/[countryGroupId]/guardianAdLiteLanding/components/guardianAdLiteCards';
import { GuardianAdLiteCards } from 'pages/[countryGroupId]/guardianAdLiteLanding/components/guardianAdLiteCards';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'LandingPage/GuardianAdLite Cards',
	component: GuardianAdLiteCards,
	argTypes: {},
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: GuardianAdLiteCardsProps) {
	const innerContentContainer = css`
		max-width: 940px;
		margin: 0 auto;
		text-align: center;
		background-color: ${palette.brand[400]};
		padding: ${space[3]}px;
	`;
	return (
		<div css={innerContentContainer}>
			<GuardianAdLiteCards {...args} />
		</div>
	);
}

Template.args = {} as Record<string, unknown>;
export const Default = Template.bind({});
Default.args = {
	cardsContent: [
		{
			cardPosition: 1,
			link: 'https://support.theguardian.com/uk/checkout?product=GuardianLight&ratePlan=Monthly',
			productDescription: productCatalogGuardianAdLite().GuardianAdLite,
			ctaCopy: 'Get Guardian Ad-Lite for XX/month',
		},
		{
			cardPosition: 2,
			link: `https://www.theguardian.com/uk/contribute`,
			productDescription: productCatalogGuardianAdLite().GuardianAdLiteGoBack,
			ctaCopy: `Go back to 'Accept all'`,
		},
	],
};
