// ----- Imports ----- //
import type { Node } from 'react';
import React from 'react';
import { connect } from 'react-redux';
import ProgressMessage from 'components/progressMessage/progressMessage';
import ReturnSection from 'components/subscriptionCheckouts/thankYou/returnSection';
import type {
	Action,
	RedemptionPageState,
	Stage,
} from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import type { User } from 'helpers/user/user';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Participations } from 'helpers/abTests/abtest';
import { createSubscription } from 'pages/subscriptions-redemption/api';
import type { Option } from 'helpers/types/option';
import type { Csrf } from 'helpers/csrf/csrfReducer';
import type { ReaderType } from 'helpers/productPrice/readerType';
// ----- Types ----- //
type PropTypes = {
	stage: Stage;
	checkoutForm: Node;
	thankYouContentPending: Node;
	thankYouContent: Node;
	userCode: string;
	readerType: Option<ReaderType>;
	user: User;
	currencyId: IsoCurrency;
	countryId: IsoCountry;
	participations: Participations;
	csrf: Option<Csrf>;
	createSub: (arg0: PropTypes) => void;
};

// ----- State/Props Maps ----- //
function mapStateToProps(state: RedemptionPageState) {
	return {
		stage: state.page.stage,
		userCode: state.page.userCode,
		readerType: state.page.readerType,
		user: state.page.user,
		currencyId: state.common.internationalisation.currencyId,
		countryId: state.common.internationalisation.countryId,
		participations: state.common.abParticipations,
		csrf: state.page.csrf,
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	const createSub = (props: PropTypes) =>
		createSubscription(
			props.userCode,
			props.readerType,
			props.user,
			props.currencyId,
			props.countryId,
			props.participations,
			props.csrf || {
				token: '',
			},
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
