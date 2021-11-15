import { css } from '@emotion/core';
import { Button } from '@guardian/src-button';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { line } from '@guardian/src-foundations/palette';
import { headline } from '@guardian/src-foundations/typography/obj';
import { SvgArrowRightStraight } from '@guardian/src-icons';
import { TextInput } from '@guardian/src-text-input';
import React from 'react';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import Form, { FormSection } from 'components/checkoutForm/checkoutForm';
import CheckoutLayout, {
	Content,
} from 'components/subscriptionCheckouts/layout';
import PersonalDetails from 'components/subscriptionCheckouts/personalDetails';
import { fetchAndStoreUserType } from 'helpers/subscriptionsForms/guestCheckout';
import { signOut } from 'helpers/user/user';
import {
	submitCode,
	validateUserCode,
} from 'pages/subscriptions-redemption/api';
import ProductSummary from 'pages/subscriptions-redemption/components/productSummary/productSummary';
import type {
	Action,
	RedemptionPageState,
} from 'pages/subscriptions-redemption/subscriptionsRedemptionReducer';

function mapStateToProps(state: RedemptionPageState) {
	return {
		stage: state.page.checkout.stage,
		user: state.page.user,
		userCode: state.page.userCode,
		readerType: state.page.readerType,
		csrf: state.page.csrf,
		error: state.page.error,
		firstName: state.page.checkout.firstName,
		lastName: state.page.checkout.lastName,
		email: state.page.checkout.email,
		confirmEmail: state.page.checkout.confirmEmail,
		telephone: state.page.checkout.telephone,
		formErrors: state.page.checkout.errors,
		currencyId: state.common.internationalisation.currencyId,
		countryId: state.common.internationalisation.countryId,
		participations: state.common.abParticipations,
	};
}

function mapDispatchToProps() {
	return {
		setUserCode: (userCode: string) => (dispatch: Dispatch<Action>) =>
			validateUserCode(userCode, dispatch),
		submitForm:
			() => (dispatch: Dispatch<Action>, getState: () => RedemptionPageState) =>
				submitCode(dispatch, getState()),
		setFirstName: (firstName: string) => (dispatch: Dispatch<Action>) =>
			dispatch({
				type: 'SET_FIRST_NAME',
				firstName,
			}),
		setLastName: (lastName: string) => (dispatch: Dispatch<Action>) =>
			dispatch({
				type: 'SET_LAST_NAME',
				lastName,
			}),
		setEmail: (email: string) => (dispatch: Dispatch<Action>) =>
			dispatch({
				type: 'SET_EMAIL',
				email,
			}),
		setTelephone: (telephone: string) => (dispatch: Dispatch<Action>) =>
			dispatch({
				type: 'SET_TELEPHONE',
				telephone,
			}),
		setConfirmEmail: (email: string) => (dispatch: Dispatch<Action>) =>
			dispatch({
				type: 'SET_CONFIRM_EMAIL',
				email,
			}),
		fetchAndStoreUserType:
			(email: string) =>
			(dispatch: Dispatch<Action>, getState: () => RedemptionPageState) => {
				fetchAndStoreUserType(email)(
					dispatch,
					getState,
					(userType) =>
						void dispatch({
							type: 'SET_USER_TYPE_FROM_IDENTITY_RESPONSE',
							userTypeFromIdentityResponse: userType,
						}),
				);
			},
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
									firstName={props.user.firstName}
									setFirstName={props.setFirstName}
									lastName={props.user.lastName}
									setLastName={props.setLastName}
									email={props.user.email}
									setEmail={props.setEmail}
									confirmEmail={props.confirmEmail}
									setConfirmEmail={props.setConfirmEmail}
									isSignedIn={props.user.isSignedIn}
									fetchAndStoreUserType={props.fetchAndStoreUserType}
									telephone={props.telephone}
									setTelephone={props.setTelephone}
									formErrors={props.formErrors}
									signOut={props.signOut}
								/>
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
