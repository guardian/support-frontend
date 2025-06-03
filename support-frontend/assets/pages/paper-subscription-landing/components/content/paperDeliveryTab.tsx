// ----- Imports ----- //
import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';
import { PaperCarouselTab } from './paperTabCarousel';
import { PaperTabHero } from './paperTabHero';
import { PaperTabTsAndCs } from './paperTabTsAndCs';

const flexContainerOverride = css`
	align-items: flex-start;
	justify-content: space-between;

	${from.tablet} {
		flex-direction: column;
	}
`;

export function PaperDeliveryTab(): JSX.Element {
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<PaperTabHero></PaperTabHero>
			<PaperCarouselTab></PaperCarouselTab>
			<PaperTabTsAndCs></PaperTabTsAndCs>
		</FlexContainer>
	);
}
