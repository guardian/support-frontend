import type { IsoCountry } from 'helpers/internationalisation/country';
import CreditCardsROW from './creditCardsROW.svg';
import CreditCardsUS from './creditCardsUS.svg';

interface CreditCardIconsProps {
	country: IsoCountry;
}

export function CreditCardIcons({
	country,
}: CreditCardIconsProps): JSX.Element {
	if (country === 'US') {
		return <CreditCardsUS className="form__credit-card-icons" />;
	}

	return <CreditCardsROW className="form__credit-card-icons" />;
}
