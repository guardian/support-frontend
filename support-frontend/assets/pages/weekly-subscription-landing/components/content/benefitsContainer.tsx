import { css } from '@emotion/react';
import { from, neutral, space, until } from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import FlexContainer from 'components/containers/flexContainer';
import GridImage from 'components/gridImage/gridImage';

type BenefitsSection = {
	id: string;
	content: ReactNode;
};
type PropTypes = {
	sections: BenefitsSection[];
};
const benefits = css`
	justify-content: space-between;
	align-items: flex-start;
	border-top: 1px solid ${neutral[86]};
	border-bottom: 1px solid ${neutral[86]};
	${from.tablet} {
		border: 1px solid ${neutral[86]};
	}
`;
const benefitsBlocks = css`
	display: flex;
	flex-direction: column;
	${from.tablet} {
		min-width: 50%;
	}
`;
const benefitsBlock = css`
	padding: ${space[3]}px;
	${until.tablet} {
		&:not(:first-of-type) {
			border-top: 1px solid ${neutral[86]};
		}
	}
`;
const imageContainer = css`
	align-self: flex-end;
	flex-shrink: 0;
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	width: 100%;

	${from.tablet} {
		width: 40%;
	}

	& img {
		max-width: 100%;
	}
`;

function BenefitsContainer({ sections }: PropTypes): JSX.Element {
	return (
		<FlexContainer cssOverrides={benefits}>
			<div css={benefitsBlocks}>
				{sections.map((benefitsSection) => (
					<section id={benefitsSection.id} css={benefitsBlock}>
						{benefitsSection.content}
					</section>
				))}
			</div>
			<div css={imageContainer}>
				<GridImage
					gridId="weeklyCampaignBenefitsImg"
					srcSizes={[1000, 500, 140]}
					sizes="(max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            500px"
					imgType="png"
					altText="Spread pages of the Guardian Weekly magazine"
				/>
			</div>
		</FlexContainer>
	);
}

export default BenefitsContainer;
