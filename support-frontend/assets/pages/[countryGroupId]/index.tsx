import { useState } from 'react';
import {
	init as abTestInit,
	getAmountsTestVariant,
} from 'helpers/abTests/abtest';
import type { ContributionType } from 'helpers/contributions';
import {
	type AppConfig,
	parseAppConfig,
} from 'helpers/globalsAndSwitches/window';
import CountryHelper from 'helpers/internationalisation/classes/country';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { setUpTrackingAndConsents } from 'helpers/page/page';
import { getPromotion } from 'helpers/productPrice/promotions';
import { renderPage } from 'helpers/rendering/render';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import { sendEventContributionCartValue } from 'helpers/tracking/quantumMetric';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';
import { ThreeTierLanding } from 'pages/supporter-plus-landing/twoStepPages/threeTierLanding';

setUpTrackingAndConsents();
const appConfig = parseAppConfig(window.guardian);

type Props = { geoId: GeoId; appConfig: AppConfig };
export function Index({ geoId, appConfig }: Props) {
	const countryId = CountryHelper.detect();
	const { currencyKey, countryGroupId } = getGeoIdConfig(geoId);

	const abParticipations = abTestInit({ countryId, countryGroupId });

	const [contributionTypeFromState, setContributionTypeFromState] =
		useState<ContributionType>('MONTHLY');

	const billingPeriod =
		contributionTypeFromState === 'MONTHLY' ? 'Monthly' : 'Annual';

	const promotionTier2 = getPromotion(
		appConfig.productPrices,
		countryId,
		billingPeriod,
	);

	const fulfilmentOption =
		countryGroupId === 'International' ? 'RestOfWorld' : 'Domestic';

	const promotionTier3 = getPromotion(
		// TODO: These need to be TierThree specific
		appConfig.productPrices,
		countryId,
		billingPeriod,
		fulfilmentOption,
	);

	const { selectedAmountsVariant } = getAmountsTestVariant(
		countryId,
		countryGroupId,
		appConfig.settings,
	);

	return (
		<ThreeTierLanding
			abParticipations={abParticipations}
			countryGroupId={countryGroupId}
			currencyId={currencyKey}
			countryId={countryId}
			contributionTypeFromState={contributionTypeFromState}
			promotionTier2={promotionTier2}
			promotionTier3={promotionTier3}
			handlePaymentFrequencyBtnClick={(buttonIndex: number) => {
				if (buttonIndex === 0) {
					// Monthly
					setContributionTypeFromState('MONTHLY');
				} else if (buttonIndex === 1) {
					// Annual
					setContributionTypeFromState('ANNUAL');
				}
			}}
			handleLinkCtaClick={(
				event: React.MouseEvent<HTMLAnchorElement>,
				link: string,
				price: number,
				cardTier: 1 | 2 | 3,
				contributionType: ContributionType,
				contributionCurrency: IsoCurrency,
				recurringAmount: number,
			) => {
				if (cardTier === 3) {
					sendEventContributionCartValue(
						price.toString(),
						contributionType,
						contributionCurrency,
					);
					/**
					 * Lower & middle tier track component click fired via redux side effects.
					 * Top tier accessed via network request to GuardianWeekly landing page
					 * therefore tracking required
					 **/
					trackComponentClick(
						`npf-contribution-amount-toggle-${countryGroupId}-${contributionType}-${price}`,
					);
				} else {
					event.preventDefault();

					sendEventContributionCartValue(
						recurringAmount.toString(),
						contributionType,
						currencyKey,
					);
				}
				window.location.href = link;
			}}
			handleSupportOnceBtnClick={() => {
				// TODO: this is a hangover from redux / react router days
				const urlParams = new URLSearchParams();
				urlParams.set('selected-contribution-type', 'one_off');

				const href = `/contribute/checkout?${urlParams.toString()}${
					window.location.hash
				}`;

				trackComponentClick(
					`npf-contribution-amount-toggle-${countryGroupId}-ONE_OFF`,
				);
				window.location.href = href;
			}}
			amounts={selectedAmountsVariant}
		/>
	);
}
renderPage(<Index geoId="uk" appConfig={appConfig} />);
