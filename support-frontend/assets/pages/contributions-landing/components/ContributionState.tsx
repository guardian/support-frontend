// ----- Imports ----- //
import { css } from '@emotion/react';
import { focusHalo, space } from '@guardian/source-foundations';
import { InlineError } from '@guardian/source-react-components';
import DownChevronDs from 'components/svgs/downChevronDs';
import type { StateProvince } from 'helpers/internationalisation/country';
import {
	auStates,
	caStates,
	usStates,
} from 'helpers/internationalisation/country';
import type {
	CountryGroup,
	CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	Canada,
	countryGroups,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';

// ----- Types ----- //

interface ContributionStateProps {
	selectedState: StateProvince | null;
	onChange: (state: string) => void;
	isValid: boolean;
	formHasBeenSubmitted: boolean;
	contributionType: string;
	countryGroupId: CountryGroupId;
}

const selectCss = css`
	appearance: none !important;
	background: transparent;
	transition: box-shadow 0.2s ease-in-out;
	font-size: 17px;
	width: 100%;
	height: 48px;
	border: 2px solid #999;
	z-index: 1;
	margin: 0;
	padding: 0;
	outline: 0;
	box-sizing: border-box;

	&:active {
		border: 2px solid #007abc;
	}

	&:focus {
		${focusHalo};
	}
`;

const errorBorderCss = css`
	border: 4px solid #c70000;
	height: 52px;
	width: calc(100% + 3px);
`;

const chevronCss = css`
	float: right;
	z-index: 0;
	position: absolute;
	top: 12px;
	right: 16px;
	pointer-events: none;
`;

const chevronErrorCss = css`
	path {
		fill: #c70000;
	}
`;

const renderState = (selectedState: StateProvince | null) =>
	function (state: { abbreviation: string; name: string }) {
		return (
			<option
				value={state.abbreviation}
				selected={selectedState === state.abbreviation}
			>
				&nbsp;&nbsp;{state.name}
			</option>
		);
	};

const renderStatesField = (
	states: Record<string, string>,
	selectedState: StateProvince | null,
	onChange: (state: string) => void,
	showError: boolean,
	label: string,
) => (
	<div
		css={css`
			margin-top: 12px;
			margin-bottom: 4px;
			position: relative;
		`}
	>
		<label
			htmlFor="contributionState"
			css={css`
				font-family: $gu-text-sans-web;
				font-weight: 700;
				line-height: 1.5;
				font-size: 17px;
			`}
		>
			{label}
		</label>
		<div
			css={css`
				font-size: 15px;
				color: #767676;
				margin-bottom: ${space[1]}px;
			`}
		>
			Select your {label.toLowerCase()}
		</div>
		{showError ? (
			<InlineError
				cssOverrides={css`
					margin-bottom: 4px;
				`}
			>
				Please select your {label.toLowerCase()}
			</InlineError>
		) : null}
		<div
			css={css`
				position: relative;
			`}
		>
			<select
				css={showError ? [selectCss, errorBorderCss] : selectCss}
				id="contributionState"
				onChange={(e) => onChange(e.target.value)}
				required
			>
				<option value="">&nbsp;</option>
				{Object.keys(states)
					.map((key) => ({
						abbreviation: key,
						name: states[key],
					}))
					.map(renderState(selectedState))}
			</select>
			<div css={showError ? [chevronErrorCss, chevronCss] : chevronCss}>
				<DownChevronDs />
			</div>
		</div>
	</div>
);

function ContributionState({
	selectedState,
	onChange,
	isValid,
	formHasBeenSubmitted,
	contributionType,
	countryGroupId,
}: ContributionStateProps): JSX.Element | null {
	const showError = !isValid && formHasBeenSubmitted;

	if (contributionType !== 'ONE_OFF') {
		switch (countryGroupId) {
			case UnitedStates:
				return renderStatesField(
					usStates,
					selectedState,
					onChange,
					showError,
					'State',
				);

			case Canada:
				return renderStatesField(
					caStates,
					selectedState,
					onChange,
					showError,
					'Province',
				);

			case AUDCountries: {
				// Don't show states if the user is GEO-IP'd to one of the non AU countries that use AUD.
				if (window.guardian.geoip) {
					const AUDCountryGroup: CountryGroup = countryGroups[AUDCountries];
					const AUDCountriesWithNoStates = AUDCountryGroup.countries.filter(
						(c) => c !== 'AU',
					);

					if (
						AUDCountriesWithNoStates.includes(window.guardian.geoip.countryCode)
					) {
						return null;
					}
				}

				return renderStatesField(
					auStates,
					selectedState,
					onChange,
					showError,
					'State / Territory',
				);
			}

			default:
				return null;
		}
	}

	return null;
}

export default ContributionState;
