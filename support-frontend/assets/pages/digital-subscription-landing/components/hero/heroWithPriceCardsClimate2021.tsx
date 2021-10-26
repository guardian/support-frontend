// ----- Imports ----- //
import React from 'react';
import CentredContainer from 'components/containers/centredContainer';
import Hero from 'components/page/hero';
import HeroRoundel from 'components/page/heroRoundel';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';
import {
	getTimeboundCopy,
	getTimeboundQuery,
} from 'helpers/timeBoundedCopy/timeBoundedCopy';
import { IconSmallEarth } from './climate2021/IconSmallEarth';
import { IconStarburst } from './climate2021/IconStarburst';
import { IconSwirl } from './climate2021/IconSwirl';
import { IconTrees } from './climate2021/IconTrees';
import DefaultRoundel from './defaultRoundel';
import { HeroPriceCards } from './heroPriceCardsClimate2021';
import {
	centredContainerOverride,
	circleTextGeneric,
	embeddedRoundel,
	heroCopy,
	heroOverride,
	heroTitle,
	pageTitleOverride,
	paragraphs,
	roundelOverrides,
} from './heroWithPriceCardsClimate2021Styles';
import PageTitle from './pageTitleClimate2021';

type PropTypes = {
	promotionCopy: PromotionCopy;
	priceList: any[];
	countryGroupId: CountryGroupId;
};

const HeroCopy = () => (
	<>
		<p>
			Digital subscribers help to sustain the Guardian’s reporting on the
			climate crisis. To say thank you, we offer{' '}
			<strong>two innovative apps and ad-free reading,</strong> so you can
			always catch up on world events without interruption.
		</p>
	</>
);

const HeroCopyAus = () => (
	<>
		<p>
			<strong>With two innovative apps and ad-free reading,</strong> a digital
			subscription gives you the richest experience of Guardian journalism,
			while helping to sustain vital, independent reporting.
		</p>
		<p>
			Start your free trial today and enjoy exclusive access to the new weekly
			edition, Australia Weekend.
		</p>
	</>
);

function HeroWithPriceCardsClimate2021({
	promotionCopy,
	priceList,
	countryGroupId,
}: PropTypes) {
	const title = promotionCopy.title || (
		<>
			Subscribe to support
			<br />urgent climate journalism
		</>
	);
	const promoCopy = promotionHTML(promotionCopy.description, {
		tag: 'div',
	});
	const roundelText = promotionHTML(promotionCopy.roundel, {
		css: circleTextGeneric,
	}) || <DefaultRoundel />;
	const nonAusCopy = getTimeboundCopy(
		'digitalSubscription',
		getTimeboundQuery() || new Date(),
	) || <HeroCopy />;
	let defaultCopy;

	if (countryGroupId === AUDCountries) {
		defaultCopy = <HeroCopyAus />;
	} else if (countryGroupId === UnitedStates) {
		defaultCopy = <HeroCopy />;
	} else {
		defaultCopy = nonAusCopy;
	}

	const copy = promoCopy || defaultCopy;
	return (
		<PageTitle
			title="Digital subscription"
			cssOverrides={pageTitleOverride}
			theme="digital"
		>
			<CentredContainer cssOverrides={centredContainerOverride}>
				<IconSmallEarth />
				<IconTrees />
				<IconStarburst />
				<Hero
					image={
						<HeroPriceCards
							priceList={priceList}
							roundel={
								<HeroRoundel cssOverrides={embeddedRoundel} theme="digital">
									{roundelText}
								</HeroRoundel>
							}
						/>
					}
					roundelElement={
						<HeroRoundel cssOverrides={roundelOverrides} theme="digital">
							{roundelText}
						</HeroRoundel>
					}
					cssOverrides={heroOverride}
				>
					<section css={heroCopy}>
						<h2 css={heroTitle}>{title}</h2>
						<div css={paragraphs}>{copy}</div>
					</section>
				</Hero>
			</CentredContainer>
			<IconSwirl />
		</PageTitle>
	);
}

export { HeroWithPriceCardsClimate2021 };
