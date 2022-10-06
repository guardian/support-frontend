import { css } from '@emotion/react';
import type { IsoCountry } from 'helpers/internationalisation/country';
import CreditCardsROW from './creditCardsROW.svg';
import CreditCardsUS from './creditCardsUS.svg';

interface CreditCardIconsProps {
	country: IsoCountry;
}

const icons = css`
	margin-bottom: 5px;
	float: right;
	position: absolute;
	right: 0;
	top: -7px;
`;

export function CreditCardIcons({
	country,
}: CreditCardIconsProps): JSX.Element {
	if (country === 'US') {
		return <CreditCardsUS css={icons} />;
	}

	return <CreditCardsROW css={icons} />;
}
