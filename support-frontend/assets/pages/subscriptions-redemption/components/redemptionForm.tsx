import { css } from '@emotion/react';
import { from, headline, line, space } from '@guardian/source-foundations';
import {
	Button,
	SvgArrowRightStraight,
	TextInput,
} from '@guardian/source-react-components';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import CheckoutLayout, {
	Content,
} from 'components/subscriptionCheckouts/layout';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { ErrorSummary } from 'components/subscriptionCheckouts/submitFormErrorSummary';
import {
	setConfirmEmail,
	setEmail,
	setFirstName,
	setLastName,
	setTelephone,
} from 'helpers/redux/checkout/personalDetails/actions';
import { getUserTypeFromIdentity } from 'helpers/redux/checkout/personalDetails/thunks';
import type {
	RedemptionDispatch,
	RedemptionPageState,
} from 'helpers/redux/redemptionsStore';
import { signOut } from 'helpers/user/user';
import {
	submitCode,
	validateUserCode,
} from 'pages/subscriptions-redemption/api';
import ProductSummary from 'pages/subscriptions-redemption/components/productSummary/productSummary';

function mapStateToProps(state: RedemptionPageState) {
	return {
		stage: state.page.checkout.stage,
		user: state.page.user,
		userCode: state.page.userCode,
		readerType: state.page.readerType,
		csrf: state.page.checkoutForm.csrf,
		error: state.page.error,
		firstName: state.page.checkoutForm.personalDetails.firstName,
		lastName: state.page.checkoutForm.personalDetails.lastName,
		email: state.page.checkoutForm.personalDetails.email,
		confirmEmail: state.page.checkoutForm.personalDetails.confirmEmail,
		telephone: state.page.checkoutForm.personalDetails.telephone,
		isSignedIn: state.page.checkoutForm.personalDetails.isSignedIn,
		formErrors: state.page.checkout.errors,
		currencyId: state.common.internationalisation.currencyId,
		countryId: state.common.internationalisation.countryId,
		participations: state.common.abParticipations,
	};
}

function mapDispatchToProps() {
	return {
		setUserCode: (userCode: string) => (dispatch: RedemptionDispatch) =>
			validateUserCode(userCode, dispatch),
		submitForm:
			() =>
			(dispatch: RedemptionDispatch, getState: () => RedemptionPageState) =>
				submitCode(dispatch, getState()),
		setFirstName,
		setLastName,
		setEmail,
		setTelephone,
		setConfirmEmail,
		fetchAndStoreUserType: getUserTypeFromIdentity,
		signOut,
	};
}

const connector = connect(mapStateToProps, mapDispatchToProps());

type PropTypes = ConnectedProps<typeof connector>;

const redemptionForm = css`
	padding: ${space[2]}px;
`;

const instructionsDivCss = css`
	margin-top: -10px;
	padding: ${space[2]}px;
	${from.tablet} {
		min-height: 475px;
	}
	hr {
		border: 0;
		border-top: solid 1px ${line.primary};
	}
`;

const hrCss = css`
	margin-bottom: 16px;
`;
const headingCss = css`
	${headline.xsmall()};
	font-weight: bold;
	margin-bottom: 16px;
`;

function RedemptionForm(props: PropTypes) {
	const validationText = props.error ? null : 'This code is valid';

	return (
		<div>
			<Content>
				<CheckoutLayout wrapPosition="bottom" aside={<ProductSummary />}>
					<Form
						onSubmit={(ev) => {
							ev.preventDefault();
							props.submitForm();
						}}
					>
						<div css={redemptionForm}>
							<h1 css={headingCss}>
								Enjoy your Digital Subscription from the Guardian
							</h1>
							<FormSection>
								<TextInput
									autoComplete="off"
									value={props.userCode ?? ''}
									onChange={(e) => props.setUserCode(e.target.value)}
									error={props.error ?? ''}
									success={validationText ?? ''}
									label="Insert code"
								/>
							</FormSection>
							<FormSection title="Your details">
								<PersonalDetails
									firstName={props.firstName}
									setFirstName={props.setFirstName}
									lastName={props.lastName}
									setLastName={props.setLastName}
									email={props.email}
									setEmail={props.setEmail}
									confirmEmail={props.confirmEmail}
									setConfirmEmail={props.setConfirmEmail}
									isSignedIn={props.isSignedIn}
									fetchAndStoreUserType={props.fetchAndStoreUserType}
									telephone={props.telephone}
									setTelephone={props.setTelephone}
									formErrors={props.formErrors}
									signOut={props.signOut}
								/>
								{props.formErrors.length > 0 && (
									<ErrorSummary errors={props.formErrors} />
								)}
							</FormSection>
						</div>
						<div css={instructionsDivCss}>
							<hr css={hrCss} />
							<Button
								type="submit"
								iconSide="right"
								icon={<SvgArrowRightStraight />}
							>
								Activate
							</Button>
						</div>
					</Form>
				</CheckoutLayout>
			</Content>
		</div>
	);
} // ----- Exports ----- //

export default connector(RedemptionForm);
