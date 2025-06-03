import { css } from '@emotion/react';
import { until } from '@guardian/source/foundations';
import FlexContainer from 'components/containers/flexContainer';

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
	topParagraph: string;
	bottomParagraph: string;
};

export function PaperTabHero({
	topParagraph,
	bottomParagraph,
}: PaperTabHeroProps): JSX.Element {
	return (
		<FlexContainer cssOverrides={flexContainerOverride}>
			PaperTabHero
			<div>
				<div>
					<p>{topParagraph}</p>
					<p>{bottomParagraph}</p>
					<p>drop down</p>
				</div>
				<div>image</div>
			</div>
		</FlexContainer>
	);
}
