// ----- Imports ----- //
import type { ReactElement } from 'react';
import SvgCheckmark from 'components/svgs/checkmark';
import SvgChevron from 'components/svgs/chevron';
import SvgGlobe from 'components/svgs/globe';
import SvgGuardianLogo from 'components/svgs/guardianLogo';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import type {
	CountryGroup,
	CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
// ----- Types ----- //
type PropTypes = {
	selectedCountryGroup: CountryGroup | null | undefined;
};

// ----- Render ----- //
const renderCountryGroup = (selectedCountryGroup: CountryGroup) =>
	function (countryGroup: CountryGroup) {
		return (
			<li className="countryGroups__item">
				<a
					href={`/${countryGroup.supportInternationalisationId}/contribute${window.location.search}`}
				>
					{countryGroup.name} ({currencies[countryGroup.currency].extendedGlyph}
					)
					{countryGroup === selectedCountryGroup ? (
						<span className="icon">
							<SvgCheckmark />
						</span>
					) : null}
				</a>
			</li>
		);
	};

function RoundelHeader(props: PropTypes): ReactElement {
	return (
		<header role="banner" className="gu-content__header">
			<a className="glogo" href="https://www.theguardian.com">
				<SvgGuardianLogo />
				<h2 className="glogo-alt-text">Return to the Guardian</h2>
			</a>
			{props.selectedCountryGroup ? (
				<details className="countryGroups">
					<summary
						aria-label={`Selected country: ${
							props.selectedCountryGroup.name
						} (${currencies[props.selectedCountryGroup.currency].glyph})`}
					>
						{/* Safari doesn't respect styles applied to <summary> so we need this wrapper div */}
						<div className="countryGroups__summary-wrapper">
							<SvgGlobe />
							<span className="countryGroups__label">
								{props.selectedCountryGroup.name} (
								{currencies[props.selectedCountryGroup.currency].extendedGlyph})
							</span>
							<span className="icon icon--arrows">
								<SvgChevron />
							</span>
						</div>
					</summary>
					<ul className="countryGroups__list">
						{(Object.keys(countryGroups) as CountryGroupId[])
							.map((countryGroup) => countryGroups[countryGroup])
							.map(renderCountryGroup(props.selectedCountryGroup))}
					</ul>
				</details>
			) : null}
		</header>
	);
}

RoundelHeader.defaultProps = {
	selectedCountryGroup: null,
};
export { RoundelHeader };
