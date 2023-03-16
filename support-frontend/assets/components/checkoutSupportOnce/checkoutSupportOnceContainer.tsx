import { useState } from 'preact/hooks';
import { init as initAbTests } from 'helpers/abTests/abtest';
import { config } from 'helpers/contributions';
import { getSettings } from 'helpers/globalsAndSwitches/globals';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { detect, glyph } from 'helpers/internationalisation/currency';
import { setProductType } from 'helpers/redux/checkout/product/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import type { CheckoutSupportOnceProps } from './checkoutSupportOnce';

type SupportOnceContainerProps = {
	renderSupportOnce: (props: CheckoutSupportOnceProps) => JSX.Element;
};

export function CheckoutSupportOnceContainer({
	renderSupportOnce,
}: SupportOnceContainerProps): JSX.Element | null {
	const dispatch = useContributionsDispatch();
	const contributionType = useContributionsSelector(getContributionType);
	const { countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);

	const [supportOnceDisplay, setSupportOnceDisplay] = useState(true);

	const currencyGlyph = glyph(detect(countryGroupId));
	const minAmount = config[countryGroupId]['ONE_OFF'].min;

	const [title, paragraph] = [
		`Support us just once`,
		`We welcome support of any size, any time, whether you choose to give ${
			currencyGlyph + minAmount.toString()
		} or much more`,
	];

	const participations = initAbTests(
		detectCountry(),
		countryGroupId,
		getSettings(),
	);
	setSupportOnceDisplay(participations.singleLessProminent === 'variant');

	function onSupportOnceClick() {
		setSupportOnceDisplay(false);
		dispatch(setProductType('ONE_OFF'));
	}

	return renderSupportOnce({
		contributionType,
		supportOnceDisplay,
		supportOnceTitle: title,
		supportOnceParagraph: paragraph,
		onSupportOnceClick,
	});
}
