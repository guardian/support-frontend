import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { productCatalogDescription } from 'helpers/productCatalog';
import type { GuardianLightCardsProps } from 'pages/[countryGroupId]/components/guardianLightCards';
import { GuardianLightCards } from 'pages/[countryGroupId]/components/guardianLightCards';
import { withCenterAlignment } from '../../.storybook/decorators/withCenterAlignment';
import { withSourceReset } from '../../.storybook/decorators/withSourceReset';

export default {
	title: 'LandingPage/GuardianLight Cards',
	component: GuardianLightCards,
	argTypes: {},
	decorators: [withCenterAlignment, withSourceReset],
};

function Template(args: GuardianLightCardsProps) {
	const innerContentContainer = css`
		max-width: 940px;
		margin: 0 auto;
		text-align: center;
		background-color: ${palette.brand[400]};
		padding: ${space[3]}px;
	`;
	return (
		<div css={innerContentContainer}>
			<GuardianLightCards {...args} />
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
			productDescription: productCatalogDescription.GuardianLight,
			ctaCopy: 'Get Guardian Light for XX/month',
		},
		{
			cardPosition: 2,
			link: `https://www.theguardian.com/uk/contribute`,
			productDescription: {
				...productCatalogDescription.GuardianLight,
				label: 'Read with personalised advertising',
				benefits: [
					{
						copy: `Click ‘Go Back to Accept all’ if you do not want to purchase a Guardian Light subscription`,
					},
				],
			},
			ctaCopy: 'Go back to "accept all"',
		},
	],
};
