import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { isOneOff } from 'helpers/supporterPlus/isContributionRecurring';

type TooltipContainerProps = {
	renderTooltip: () => JSX.Element;
};

export function TooltipContainer({
	renderTooltip,
}: TooltipContainerProps): JSX.Element | null {
	const contributionType = useContributionsSelector(getContributionType);

	if (isOneOff(contributionType)) {
		return null;
	}

	return renderTooltip();
}
