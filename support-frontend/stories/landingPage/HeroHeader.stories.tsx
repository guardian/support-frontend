import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import GridImage from 'components/gridImage/gridImage';
import HeroHeader from 'components/hero/HeroHeader';

export default {
	title: 'LandingPage/HeroHeader',
	component: HeroHeader,
};

function Template() {
	const innerContentContainer = css`
		margin: 0 auto;
		background-color: ${palette.neutral[93]};
		padding: ${space[6]}px;
	`;

	return (
		<div css={innerContentContainer}>
			<HeroHeader
				heroImage={
					<GridImage
						gridId="weeklyCampaignHeroImg"
						srcSizes={[500, 140]}
						sizes="(max-width: 740px) 100%, 500px"
						imgType="png"
						altText="A collection of Guardian Weekly magazines"
					/>
				}
				roundel="Includes unlimited digital access"
				title={<span>Save with a Guardian print subscription</span>}
				description={
					<span>
						From political insight to the perfect pasta, there’s something for
						everyone with a Guardian print subscription.
					</span>
				}
				ctaText="See pricing options"
				onClick={() => {}}
			/>
		</div>
	);
}

export const Default = Template.bind({});
