// ----- Imports ----- //
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { focusHalo } from '@guardian/src-foundations/accessibility';
import { InlineError } from '@guardian/src-user-feedback';
import React from 'react';
import { connect } from 'react-redux';
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
import type { State } from '../contributionsLandingReducer';
import '../contributionsLandingReducer';
// ----- Types ----- //
type PropTypes = {
	countryGroupId: CountryGroupId;
	selectedState: StateProvince | null;
	onChange: ((arg0: Event) => void) | false;
	isValid: boolean;
	formHasBeenSubmitted: boolean;
	contributionType: string;
};

const mapStateToProps = (state: State) => ({
	countryGroupId: state.common.internationalisation.countryGroupId,
	contributionType: state.page.form.contributionType,
});

// ----- Render ----- //
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

const renderState =
	(selectedState: StateProvince | null) =>
	(state: { abbreviation: string; name: string }) =>
		(
			<option
				value={state.abbreviation}
				selected={selectedState === state.abbreviation}
			>
				&nbsp;&nbsp;{state.name}
			</option>
		);

const renderStatesField = (
	states: Record<string, string>,
	selectedState: StateProvince | null,
	onChange: ((arg0: Event) => void) | false,
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
				onChange={onChange}
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

function ContributionState(props: PropTypes) {
	const showError = !props.isValid && props.formHasBeenSubmitted;

	if (props.contributionType !== 'ONE_OFF') {
		switch (props.countryGroupId) {
			case UnitedStates:
				return renderStatesField(
					usStates,
					props.selectedState,
					props.onChange,
					showError,
					'State',
				);

			case Canada:
				return renderStatesField(
					caStates,
					props.selectedState,
					props.onChange,
					showError,
					'Province',
				);

			case AUDCountries: {
				// Don't show states if the user is GEO-IP'd to one of the non AU countries that use AUD.
				if (window.guardian && window.guardian.geoip) {
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
					props.selectedState,
					props.onChange,
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

ContributionState.defaultProps = {
	onChange: false,
};
export default connect(mapStateToProps)(ContributionState);
