import { Container } from '@guardian/source/react-components';
import SvgSquaresHeroDesktop from 'components/svgs/squaresHeroDesktop';
import SvgSquaresHeroMobile from 'components/svgs/squaresHeroMobile';
import SvgSquaresHeroTablet from 'components/svgs/squaresHeroTablet';
import HighlightText from 'pages/supporter-plus-thank-you/components/thankYouHeader/HighlightText';
import {
	contentStyles,
	headingLineStyles,
	headingStyles,
	sectionStyles,
} from './squaresIntroductionStyles';

function SquaresIntroduction({
	headings,
	errorCode,
}: {
	headings: string[];
	errorCode?: string;
}) {
	return (
		<section css={sectionStyles}>
			<SvgSquaresHeroDesktop />
			<SvgSquaresHeroTablet />
			<SvgSquaresHeroMobile />
			<Container cssOverrides={contentStyles}>
				<h1 css={headingStyles}>
					{errorCode && <HighlightText>{`Error ${errorCode}`}</HighlightText>}
					{headings.map((heading) => (
						<span css={headingLineStyles} key={heading}>
							{heading}
						</span>
					))}
				</h1>
			</Container>
		</section>
	);
}

export default SquaresIntroduction;
