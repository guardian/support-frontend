import SvgSquaresHeroDesktop from 'components/svgs/squaresHeroDesktop';
import SvgSquaresHeroMobile from 'components/svgs/squaresHeroMobile';
import SvgSquaresHeroTablet from 'components/svgs/squaresHeroTablet';
import 'components/heading/heading';
import HighlightText from 'pages/supporter-plus-thank-you/components/thankYouHeader/HighlightText';

function SquaresIntroduction({
	headings,
	errorCode,
}: {
	headings: string[];
	errorCode?: string;
}) {
	return (
		<section className="component-squares-introduction">
			<SvgSquaresHeroDesktop />
			<SvgSquaresHeroTablet />
			<SvgSquaresHeroMobile />
			<div className="component-squares-introduction__content">
				<h1 className="component-squares-introduction__heading">
					{errorCode && <HighlightText>{`Error ${errorCode}`}</HighlightText>}
					{headings.map((heading) => (
						<span className="component-squares-introduction__heading-line">
							{heading}
						</span>
					))}
				</h1>
			</div>
		</section>
	);
}

export default SquaresIntroduction;
