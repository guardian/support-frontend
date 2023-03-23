import { config } from 'helpers/contributions';
import { detect, glyph } from 'helpers/internationalisation/currency';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import type { CheckoutSupportOnceProps } from './checkoutSupportOnce';

type SupportOnceContainerProps = {
	supportOnceDisplay: boolean;
	renderSupportOnce: (props: CheckoutSupportOnceProps) => JSX.Element;
	onSupportOnceContainerClick: () => void;
};

export function CheckoutSupportOnceContainer({
	supportOnceDisplay,
	renderSupportOnce,
	onSupportOnceContainerClick,
}: SupportOnceContainerProps): JSX.Element | null {
	const contributionType = useContributionsSelector(getContributionType);
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const currencyGlyph = glyph(detect(countryGroupId));
	const minAmount = config[countryGroupId]['ONE_OFF'].min;

	const [title, paragraph] = [
		`Support us just once`,
		`We welcome support of any size, any time, whether you choose to give ${
			currencyGlyph + minAmount.toString()
		} or much more`,
	];

	function onSupportOnceClick() {
		onSupportOnceContainerClick();
	}

	return renderSupportOnce({
		contributionType,
		supportOnceDisplay,
		supportOnceTitle: title,
		supportOnceParagraph: paragraph,
		onSupportOnceClick,
	});
}
