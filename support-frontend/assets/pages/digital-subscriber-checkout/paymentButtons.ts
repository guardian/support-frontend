import { AmazonPaymentButton } from 'components/amazonPayForm/amazonPaymentButton';
import { DirectDebitPaymentButton } from 'components/paymentButton/directDebitPaymentButton';
import type { PaymentButtonComponentProps } from 'components/paymentButton/paymentButtonController';
import { DigiSubPayPalPaymentButton } from 'components/payPalPaymentButton/digiSubPayPalPaymentButton';
import { StripePaymentButton } from 'components/stripeCardForm/stripePaymentButton';
import type { ContributionType } from 'helpers/contributions';
import { getValidPaymentMethods } from 'helpers/forms/checkouts';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

type PaymentMethodButtons = Partial<
	Record<PaymentMethod, React.FC<PaymentButtonComponentProps>>
>;
const allPaymentMethodButtons: PaymentMethodButtons = {
	AmazonPay: AmazonPaymentButton,
	DirectDebit: DirectDebitPaymentButton,
	PayPal: DigiSubPayPalPaymentButton,
	Stripe: StripePaymentButton,
};

export function getPaymentMethodButtons(
	contributionType: ContributionType,
	countryId: IsoCountry,
	countryGroupId: CountryGroupId,
): PaymentMethodButtons {
	const paymentMethodList = getValidPaymentMethods(
		contributionType,
		countryId,
		countryGroupId,
	);

	return paymentMethodList.reduce<PaymentMethodButtons>(
		(buttons, paymentMethod) => {
			buttons[paymentMethod] = allPaymentMethodButtons[paymentMethod];
			return buttons;
		},
		{},
	);
}
