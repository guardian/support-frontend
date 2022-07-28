// ----- Imports ----- //
import { css } from '@emotion/react';
import { ChoiceCard, ChoiceCardGroup } from '@guardian/source-react-components';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type {
	ContributionType,
	ContributionTypeSetting,
} from 'helpers/contributions';
import 'helpers/contributions';
import {
	getPaymentMethodToSelect,
	toHumanReadableContributionType,
} from 'helpers/forms/checkouts';
import type { Switches } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import {
	setCurrencyId,
	setUseLocalAmounts,
} from 'helpers/redux/commonState/actions';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import type { State } from '../contributionsLandingReducer';

const groupStyles = css`
	> div {
		display: flex;

		/* This is to position the group under the country drop down */
		position: relative;
		z-index: 0;

		label {
			margin: 0 8px 0 0;
		}

		label:last-of-type {
			margin: 0;
		}
	}
`;

const mapStateToProps = (state: State) => ({
	countryGroupId: state.common.internationalisation.countryGroupId,
	contributionType: state.page.checkoutForm.product.productType,
	countryId: state.common.internationalisation.countryId,
	switches: state.common.settings.switches,
	contributionTypes: state.common.settings.contributionTypes,
	useLocalCurrency: state.common.internationalisation.useLocalCurrency,
});

const mapDispatchToProps = {
	setProductType,
	setCurrencyId,
	setUseLocalAmounts,
	setPaymentMethod,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropTypes = ConnectedProps<typeof connector>;

// ----- Render ----- //
function ContributionTypeTabs(props: PropTypes) {
	const contributionTypes = props.contributionTypes[props.countryGroupId];

	function onSelectContributionType(
		contributionType: ContributionType,
		switches: Switches,
		countryId: IsoCountry,
		countryGroupId: CountryGroupId,
		useLocalCurrency: boolean,
	) {
		const paymentMethodToSelect = getPaymentMethodToSelect(
			contributionType,
			switches,
			countryId,
			countryGroupId,
		);
		trackComponentClick(
			`npf-contribution-type-toggle-${countryGroupId}-${contributionType}`,
		);

		props.setProductType(contributionType);
		props.setPaymentMethod(paymentMethodToSelect);

		if (contributionType !== 'ONE_OFF') {
			props.setCurrencyId(false);
			props.setUseLocalAmounts(false);
		} else {
			props.setCurrencyId(useLocalCurrency);
			props.setUseLocalAmounts(useLocalCurrency);
		}
	}

	const renderChoiceCards = () => (
		<ChoiceCardGroup name="contributionTypes" cssOverrides={groupStyles}>
			{contributionTypes.map(
				(contributionTypeSetting: ContributionTypeSetting) => {
					const { contributionType } = contributionTypeSetting;
					return (
						<ChoiceCard
							id={`contributionType-${contributionType}`}
							value={contributionType}
							label={toHumanReadableContributionType(contributionType)}
							onChange={() =>
								onSelectContributionType(
									contributionType,
									props.switches,
									props.countryId,
									props.countryGroupId,
									props.useLocalCurrency,
								)
							}
							checked={props.contributionType === contributionType}
						/>
					);
				},
			)}
		</ChoiceCardGroup>
	);

	if (
		contributionTypes.length === 1 &&
		contributionTypes[0].contributionType === 'ONE_OFF'
	) {
		return null;
	}

	return (
		<fieldset
			className={classNameWithModifiers('form__radio-group', [
				'tabs',
				'contribution-type',
			])}
		>
			<legend
				className={classNameWithModifiers('form__legend', ['radio-group'])}
			>
				How often would you like to contribute?
			</legend>
			{renderChoiceCards()}
		</fieldset>
	);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ContributionTypeTabs);
