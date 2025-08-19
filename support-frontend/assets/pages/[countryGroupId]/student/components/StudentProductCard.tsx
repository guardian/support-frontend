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
	discountSummaryCss,
	heading,
	headWrapper,
	pill,
	priceCss,
} from './StudentProductCardStyles';

export default function StudentProductCard({
	price,
	benefitsList,
	ctaUrl,
	ctaLabel,
	discountSummary,
}: {
	price: JSX.Element;
	benefitsList: ProductBenefit[];
	ctaUrl: string;
	ctaLabel: string;
	discountSummary?: string;
}) {
	return (
		<section css={container}>
			<div css={pill}>Student offer</div>
			<div css={headWrapper}>
				<h2 css={heading}>All-access digital</h2>
				<p css={priceCss}>{price}</p>
			</div>
			<LinkButton
				data-testid="cta-button"
				href={ctaUrl}
				cssOverrides={btnStyleOverrides}
				aria-label="All-access digital"
				theme={themeButtonReaderRevenueBrand}
			>
				{ctaLabel}
			</LinkButton>
			{discountSummary && <p css={discountSummaryCss}>{discountSummary}</p>}

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
