import { AmazonPaymentButton } from 'components/amazonPaymentButton/amazonPaymentButton';
import { DirectDebitPaymentButton } from 'components/paymentButton/directDebitPaymentButton';
import { PayPalPaymentButton } from 'components/payPalPaymentButton/payPalPaymentButton';
import { SepaPaymentButton } from 'components/sepaForm/sepaPaymentButton';
import { StripePaymentButton } from 'components/stripeCardForm/stripePaymentButton';
import type { ContributionType } from 'helpers/contributions';
import { getValidPaymentMethods } from 'helpers/forms/checkouts';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { Switches } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

type PaymentMethodButtons = Partial<Record<PaymentMethod, React.FC>>;

const allPaymentMethodButtons: PaymentMethodButtons = {
	AmazonPay: AmazonPaymentButton,
	DirectDebit: DirectDebitPaymentButton,
	PayPal: PayPalPaymentButton,
	Sepa: SepaPaymentButton,
	Stripe: StripePaymentButton,
};

export function getPaymentMethodButtons(
	contributionType: ContributionType,
	switches: Switches,
	countryId: IsoCountry,
	countryGroupId: CountryGroupId,
): PaymentMethodButtons {
	const paymentMethodList = getValidPaymentMethods(
		contributionType,
		switches,
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
