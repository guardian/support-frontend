import type { SerializedStyles } from '@emotion/utils';
import { Accordion, RadioGroup } from '@guardian/source-react-components';
import { useEffect } from 'react';
import AnimatedDots from 'components/spinners/animatedDots';
import type {
	ExistingPaymentMethod,
	RecentlySignedInExistingPaymentMethod,
} from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import { mapExistingPaymentMethodToPaymentMethod } from 'helpers/forms/existingPaymentMethods/existingPaymentMethods';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { setPaymentMethod } from 'helpers/redux/checkout/payment/paymentMethod/actions';
import { useContributionsDispatch } from 'helpers/redux/storeHooks';
import { getReauthenticateUrl } from 'helpers/urls/externalLinks';
import { paymentMethodData } from './paymentMethodData';
import {
	AvailablePaymentMethodAccordionRow,
	ExistingPaymentMethodAccordionRow,
} from './paymentMethodSelectorAccordionRow';

export interface PaymentMethodSelectorProps {
	cssOverrides?: SerializedStyles;
	availablePaymentMethods: PaymentMethod[];
	paymentMethod: PaymentMethod | null;
	validationError: string | undefined;
	fullExistingPaymentMethods?: RecentlySignedInExistingPaymentMethod[];
	contributionTypeIsRecurring?: boolean;
	existingPaymentMethod?: RecentlySignedInExistingPaymentMethod;
	existingPaymentMethods?: ExistingPaymentMethod[];
}

export function PaymentMethodSelector({
	availablePaymentMethods,
	paymentMethod,
	validationError,
	fullExistingPaymentMethods,
	contributionTypeIsRecurring,
	existingPaymentMethod,
	existingPaymentMethods,
}: PaymentMethodSelectorProps): JSX.Element {
	const dispatch = useContributionsDispatch();

	useEffect(() => {
		availablePaymentMethods.length === 1 &&
			dispatch(setPaymentMethod(availablePaymentMethods[0]));
	}, []);

	return (
		<RadioGroup label="Select payment method" hideLabel error={validationError}>
			{contributionTypeIsRecurring && !existingPaymentMethods && (
				<div className="awaiting-existing-payment-options">
					<AnimatedDots appearance="medium" />
				</div>
			)}

			<Accordion>
				{[
					<>
						{contributionTypeIsRecurring &&
							fullExistingPaymentMethods?.map(
								(
									preExistingPaymentMethod: RecentlySignedInExistingPaymentMethod,
								) => (
									<ExistingPaymentMethodAccordionRow
										expanded={
											paymentMethod ===
												mapExistingPaymentMethodToPaymentMethod(
													preExistingPaymentMethod,
												) && existingPaymentMethod === preExistingPaymentMethod
										}
										paymentMethod={paymentMethod}
										preExistingPaymentMethod={preExistingPaymentMethod}
										existingPaymentMethod={existingPaymentMethod}
									/>
								),
							)}

						{availablePaymentMethods.map((method) => (
							<AvailablePaymentMethodAccordionRow
								id={paymentMethodData[method].id}
								image={paymentMethodData[method].icon}
								label={paymentMethodData[method].label}
								name="paymentMethod"
								checked={paymentMethod === method}
								onChange={() => dispatch(setPaymentMethod(method))}
								accordionBody={paymentMethodData[method].accordionBody}
							/>
						))}
					</>,
				]}
			</Accordion>

			{contributionTypeIsRecurring &&
				existingPaymentMethods &&
				existingPaymentMethods.length > 0 &&
				fullExistingPaymentMethods?.length === 0 && (
					<li className="form__radio-group-item">
						...or{' '}
						<a className="reauthenticate-link" href={getReauthenticateUrl()}>
							re-enter your password
						</a>{' '}
						to use one of your existing payment methods.
					</li>
				)}
		</RadioGroup>
	);
}
