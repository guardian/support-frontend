// ----- Imports ----- //
import type { ReactNode } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import ProgressMessage from 'components/progressMessage/progressMessage';
import ReturnSection from 'components/subscriptionCheckouts/thankYou/returnSection';
import type { Participations } from 'helpers/abTests/abtest';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { ReaderType } from 'helpers/productPrice/readerType';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';
import { createSubscription } from 'pages/subscriptions-redemption/api';
import type {
	Action,
	RedemptionPageState,
	Stage,
} from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';

// ----- Types ----- //
type PropTypes = {
	stage: Stage;
	checkoutForm: ReactNode;
	thankYouContentPending: ReactNode;
	thankYouContent: ReactNode;
	userCode: Option<string>;
	readerType: Option<ReaderType>;
	firstName: string;
	lastName: string;
	email: string;
	telephone: string;
	currencyId: IsoCurrency;
	countryId: IsoCountry;
	participations: Participations;
	csrf: Csrf;
	createSub: (arg0: PropTypes) => void;
};

// ----- State/Props Maps ----- //
function mapStateToProps(state: RedemptionPageState) {
	return {
		stage: state.page.checkout.stage,
		userCode: state.page.userCode,
		readerType: state.page.readerType,
		user: state.page.user,
		currencyId: state.common.internationalisation.currencyId,
		countryId: state.common.internationalisation.countryId,
		participations: state.common.abParticipations,
		csrf: state.page.csrf,
		firstName: state.page.checkout.firstName,
		lastName: state.page.checkout.lastName,
		email: state.page.checkout.email,
		telephone: state.page.checkout.telephone,
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	const createSub = (props: PropTypes) =>
		createSubscription(
			props.userCode ?? '',
			props.readerType,
			props.firstName,
			props.lastName,
			props.email,
			props.telephone,
			props.currencyId,
			props.countryId,
			props.participations,
			props.csrf,
			dispatch,
		);

	return {
		createSub,
	};
}

// ----- Component ----- //
function CheckoutStage(props: PropTypes) {
	switch (props.stage) {
		case 'thankyou':
			return (
				<div>
					{props.thankYouContent}
					<ReturnSection subscriptionProduct={DigitalPack} />
				</div>
			);

		case 'thankyou-pending':
			return (
				<div>
					{props.thankYouContentPending}
					<ReturnSection subscriptionProduct={DigitalPack} />
				</div>
			);

		case 'processing':
			props.createSub(props);
			return (
				<div className="checkout-content">
					{props.checkoutForm}
					<ProgressMessage
						message={['Processing transaction', 'Please wait']}
					/>
				</div>
			);

		default:
			return <div className="checkout-content">{props.checkoutForm}</div>;
	}
} // ----- Export ----- //

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutStage);
