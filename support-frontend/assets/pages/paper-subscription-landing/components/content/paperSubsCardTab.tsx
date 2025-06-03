// ----- Imports ----- //
import { css } from '@emotion/react';
import { from, neutral } from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';
import { PaperCarouselTab } from './paperTabCarousel';
import { PaperTabHero } from './paperTabHero';
import { PaperTabTsAndCs } from './paperTabTsAndCs';

const flexContainerOverride = css`
	align-items: flex-start;
	justify-content: space-between;
	background-color: ${neutral['97']};

	${from.tablet} {
		flex-direction: column;
	}
`;

export function PaperSubsCardTab(): JSX.Element {
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			<PaperTabHero />
			<PaperCarouselTab />
			<PaperTabTsAndCs />
		</FlexContainer>
	);
}
