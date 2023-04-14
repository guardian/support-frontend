import { config } from 'helpers/contributions';
import { detect, glyph } from 'helpers/internationalisation/currency';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { CardClickableProps } from './cardClickable';

type CardClickableContainerProps = {
	renderCardClickable: (props: CardClickableProps) => JSX.Element;
	onCardClick: () => void;
};

export function CardClickableContainer({
	renderCardClickable,
	onCardClick,
}: CardClickableContainerProps): JSX.Element | null {
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const currencyGlyph = glyph(detect(countryGroupId));
	const minAmount = config[countryGroupId]['ONE_OFF'].min;
	const cardTitle = `Support us just once`;
	const cardParagraph = `We welcome support of any size, any time, whether you choose to give ${
		currencyGlyph + minAmount.toString()
	} or much more`;

	return renderCardClickable({
		cardTitle,
		cardParagraph,
		onCardClick,
	});
}
