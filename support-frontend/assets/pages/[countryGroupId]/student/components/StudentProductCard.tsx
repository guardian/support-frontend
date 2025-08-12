import { palette } from '@guardian/source/foundations';
import {
	LinkButton,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import type { ProductBenefit } from 'helpers/globalsAndSwitches/landingPageSettings';
import {
	benefitsListCSS,
	btnStyleOverrides,
	container,
	heading,
	headWrapper,
	pill,
	priceCss,
} from './StudentProductCardStyles';

export default function StudentProductCard({
	priceSlot,
	benefitsList,
	url,
}: {
	priceSlot: JSX.Element;
	benefitsList: ProductBenefit[];
	url: string;
}) {
	return (
		<section css={container}>
			<div css={pill}>Student offer</div>
			<div css={headWrapper}>
				<h2 css={heading}>All-access digital</h2>
				<p css={priceCss}>{priceSlot}</p>
			</div>
			<LinkButton
				href={url}
				cssOverrides={btnStyleOverrides}
				aria-label="All-access digital"
				theme={themeButtonReaderRevenueBrand}
			>
				Sign up for free
			</LinkButton>

			<BenefitsCheckList
				benefitsCheckListData={benefitsList.map((benefit) => {
					return {
						text: benefit.copy,
						isChecked: true,
						toolTip: benefit.tooltip,
						pill: benefit.label?.copy,
						hideBullet: false,
					};
				})}
				style={'compact'}
				iconColor={palette.brand[500]}
				cssOverrides={benefitsListCSS}
			/>
		</section>
	);
}
