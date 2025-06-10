import { css } from '@emotion/react';
import { until } from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';

const flexContainerOverride = css`
	align-items: flex-start;
	justify-content: space-between;
	img {
		${until.leftCol} {
			display: none;
		}
	}
`;

type PaperTabHeroProps = {
	tab: PaperFulfilmentOptions;
};
export function PaperTabHero({ tab }: PaperTabHeroProps): JSX.Element {
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<div>
				<p>PaperTabHero-{tab}</p>
				<p>text block2</p>
				<p>drop down</p>
			</div>
			<div>image</div>
		</FlexContainer>
	);
}
