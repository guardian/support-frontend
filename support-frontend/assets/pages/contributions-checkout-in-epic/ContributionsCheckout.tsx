import { css } from '@emotion/react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type {
	ContributionAmounts,
	ContributionType,
} from 'helpers/contributions';
import { getAmount } from 'helpers/contributions';
import { useOnHeightChangeEffect } from 'helpers/customHooks/useOnHeightChangeEffect';
import {
	setOtherAmount,
	setProductType,
	setSelectedAmount,
} from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { updatePaymentMethod } from 'pages/contributions-landing/contributionsLandingActions';
import type { State } from 'pages/contributions-landing/contributionsLandingReducer';
import { ContributionsCheckoutForm } from './ContributionsCheckoutForm';
import { ContributionsCheckoutSubmitting } from './ContributionsCheckoutSubmitting';
import { ContributionsCheckoutThankYou } from './ContributionsCheckoutThankYou';
import { useSecondaryCta } from './useSecondaryCta';

// ---- Component ---- //

type Status = 'INPUT' | 'SUBMITTING' | 'SUCCESS';

const getStatus = (state: State): Status => {
	if (state.page.form.paymentComplete) {
		return 'SUCCESS';
	} else if (state.page.form.isWaiting) {
		return 'SUBMITTING';
	}
	return 'INPUT';
};

const getAmounts = (state: State): ContributionAmounts => {
	const amounts = state.common.amounts;

	return {
		ONE_OFF: {
			...amounts.ONE_OFF,
			amounts: amounts.ONE_OFF.amounts.slice(0, 2),
		},
		MONTHLY: {
			...amounts.MONTHLY,
			amounts: amounts.MONTHLY.amounts.slice(0, 2),
		},
		ANNUAL: {
			...amounts.ANNUAL,
			amounts: amounts.ANNUAL.amounts.slice(0, 2),
		},
	};
};

const mapStateToProps = (state: State) => ({
	status: getStatus(state),
	country: state.common.internationalisation.countryId,
	countryGroupId: state.common.internationalisation.countryGroupId,
	currency: state.common.internationalisation.currencyId,
	contributionType: getContributionType(state),
	amounts: getAmounts(state),
	selectedAmounts: state.page.checkoutForm.product.selectedAmounts,
	otherAmounts: state.page.checkoutForm.product.otherAmounts,
	isTestUser: state.page.user.isTestUser ?? false,
});

const mapDispatchToProps = {
	setProductType,
	updatePaymentMethod,
	setSelectedAmount,
	setOtherAmount,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ContributionsCheckoutProps = ConnectedProps<typeof connector>;

function ContributionsCheckout({
	status,
	country,
	countryGroupId,
	currency,
	contributionType,
	amounts,
	setProductType,
	updatePaymentMethod,
	selectedAmounts,
	otherAmounts,
	setSelectedAmount,
	setOtherAmount,
	isTestUser,
}: ContributionsCheckoutProps): JSX.Element {
	const observe = useOnHeightChangeEffect((height) => {
		window.parent.postMessage({ type: 'IFRAME_HEIGHT', height }, '*');
	});

	const secondaryCta = useSecondaryCta();

	function setSelectedContributionType(contributionType: ContributionType) {
		setProductType(contributionType);
		updatePaymentMethod('None');
	}

	return (
		<div ref={observe} css={styles.container}>
			{status === 'INPUT' && (
				<ContributionsCheckoutForm
					country={country}
					countryGroupId={countryGroupId}
					currency={currency}
					contributionType={contributionType}
					amounts={amounts}
					selectedAmounts={selectedAmounts}
					otherAmounts={otherAmounts}
					setSelectedContributionType={setSelectedContributionType}
					setSelectedAmount={(amount) =>
						setSelectedAmount({ amount: amount.toString(), contributionType })
					}
					setOtherAmount={(amount) =>
						setOtherAmount({ amount, contributionType })
					}
					secondaryCta={secondaryCta}
					isTestUser={isTestUser}
				/>
			)}

			{status === 'SUBMITTING' && <ContributionsCheckoutSubmitting />}

			{status === 'SUCCESS' && (
				<ContributionsCheckoutThankYou
					currency={currency}
					contributionType={contributionType}
					amount={getAmount(selectedAmounts, otherAmounts, contributionType)}
				/>
			)}
		</div>
	);
}

// ---- Styles ---- //

export const styles = {
	container: css`
		box-sizing: border-box;
		width: 100%;
		padding: 5px;
	`,
};

export default connector(ContributionsCheckout);
