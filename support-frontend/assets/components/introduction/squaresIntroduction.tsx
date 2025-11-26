// ----- Imports ----- //
import type { HeadingSize } from 'components/heading/heading';
import SvgSquaresHeroDesktop from 'components/svgs/squaresHeroDesktop';
import SvgSquaresHeroMobile from 'components/svgs/squaresHeroMobile';
import SvgSquaresHeroTablet from 'components/svgs/squaresHeroTablet';
import 'components/heading/heading';
import HighlightText from 'pages/supporter-plus-thank-you/components/thankYouHeader/HighlightText';

// ----- Types ----- //
type PropTypes = {
	headings: string[];
	highlightsHeadingSize: HeadingSize;
	errorCode?: string;
};

// ----- Component ----- //
function SquaresIntroduction(props: PropTypes) {
	return (
		<section className="component-squares-introduction">
			<SvgSquaresHeroDesktop />
			<SvgSquaresHeroTablet />
			<SvgSquaresHeroMobile />
			<div className="component-squares-introduction__content">
				<h1 className="component-squares-introduction__heading">
					{props.errorCode && (
						<HighlightText>{`Error ${props.errorCode}`}</HighlightText>
					)}
					{props.headings.map((heading) => (
						<span className="component-squares-introduction__heading-line">
							{heading}
						</span>
					))}
				</h1>
			</div>
		</section>
	);
}

// ----- Default Props ----- //
SquaresIntroduction.defaultProps = {
	highlights: null,
	highlightsHeadingSize: 2,
}; // ----- Exports ----- //

export default SquaresIntroduction;
