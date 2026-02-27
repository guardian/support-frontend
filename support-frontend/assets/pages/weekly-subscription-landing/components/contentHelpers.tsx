import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';
import {
	type CountryGroupId,
	GBPCountries,
} from '@modules/internationalisation/countryGroup';
import type { PromotionCopy } from 'helpers/productPrice/promotions';
import { promotionHTML } from 'helpers/productPrice/promotions';

const showOnMobile = css`
	display: block;
	${from.mobileLandscape} {
		display: none;
	}
`;

export const getFirstParagraph = (
	promotionCopy: PromotionCopy,
	orderIsAGift: boolean,
): JSX.Element | null => {
	if (promotionCopy.description) {
		return promotionHTML(promotionCopy.description);
	}

	if (orderIsAGift) {
		return (
			<>
				<p>
					Gift the Guardian Weekly magazine to someone today, so they can gain a
					deeper understanding of the issues they care about. They’ll find
					in-depth reporting, alongside news, opinion pieces and long reads from
					around the globe. From unpicking the election results to debunking
					climate misinformation, they can take time with the Guardian Weekly to
					help them make sense of the world.
				</p>
			</>
		);
	}

	return (
		<>
			The Guardian Weekly takes you beyond the headlines to give you a deeper
			understanding of the issues that really matter. Inside you’ll find the
			week’s most memorable stories brought to life with striking photography.
			Featuring a roundup of global news, opinion and long reads, all handpicked
			from the Guardian and Observer.
		</>
	);
};

export const getRegionalTitle = (
	region: CountryGroupId,
	enableWeeklyDigital?: boolean,
): JSX.Element => {
	const regionalTitle =
		region === GBPCountries ? (
			<span>
				Find clarity
				<br css={showOnMobile} /> with the Guardian&apos;s global magazine
			</span>
		) : (
			<span>
				Read The
				<br css={showOnMobile} /> Guardian in print
			</span>
		);
	const weeklyDigitalTitle = enableWeeklyDigital ? (
		<span>A week in the life of the world</span>
	) : (
		regionalTitle
	);
	return weeklyDigitalTitle;
};
