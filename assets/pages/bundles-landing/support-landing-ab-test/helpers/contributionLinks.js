// @flow

// ----- Imports ----- //

import { routes } from 'helpers/routes';

import type {
  Amount,
  Contrib as ContributionType,
} from 'helpers/contributions';
import type { Currency } from 'helpers/internationalisation/currency';


// ----- Functions ----- //

function getCheckoutUrl(contributionType: ContributionType) {

  if (contributionType === 'ONE_OFF') {
    return routes.oneOffContribCheckout;
  }

  return routes.recurringContribCheckout;

}

function getCardLink(
  contributionType: ContributionType,
  amount: Amount,
  currency: Currency,
) {

  const params = new URLSearchParams();

  params.append('contributionValue', amount.value);
  params.append('contribType', contributionType);
  params.append('currency', currency.iso);

  return `${getCheckoutUrl(contributionType)}?${params.toString()}`;

}


// ----- Exports ----- //

export {
  getCardLink,
};
