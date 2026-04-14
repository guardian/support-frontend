import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import HeroContent from 'components/hero/HeroContent';

export default {
	title: 'LandingPage/HeroContent',
	component: HeroContent,
};

function Template() {
	const innerContentContainer = css`
		margin: 0 auto;
		background-color: ${palette.neutral[93]};
		padding: ${space[6]}px;
	`;

	return (
		<div css={innerContentContainer}>
			<HeroContent
				title={<span>Save with a Guardian print subscription</span>}
				description={
					<span>
						From political insight to the perfect pasta, there’s something for
						everyone with a Guardian print subscription.
					</span>
				}
				ctaText="See pricing options"
				ctaLink="#HomeDelivery"
				onClick={() => {}}
			/>
		</div>
	);
}

export const Default = Template.bind({});
