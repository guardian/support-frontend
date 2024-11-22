import { css, ThemeProvider } from '@emotion/react';
import {
	brand,
	from,
	headlineBold17,
	headlineBold24,
	neutral,
	palette,
	space,
	until,
} from '@guardian/source/foundations';
import {
	buttonThemeReaderRevenueBrand,
	LinkButton,
} from '@guardian/source/react-components';
import { Divider } from '@guardian/source-development-kitchen/react-components';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import { type ProductDescription } from 'helpers/productCatalog';

export type CardPosition = 1 | 2;
export type GuardianLightProps = {
	cardPosition: CardPosition;
	link: string;
	productDescription: ProductDescription;
	ctaCopy: string;
};

const container = css`
	position: 'static';
	background-color: ${palette.neutral[100]};
	border-radius: ${space[3]}px;
	padding: ${space[6]}px ${space[5]}px ${space[6]}px ${space[5]}px;
	${until.desktop} {
		order: ${2};
		padding: ${space[4]}px ${space[3]}px ${space[4]}px ${space[3]}px;
		margin-top: ${'0'}px;
	}
`;
const titleSummarySvgCss = css`
	display: flex;
	flex-direction: column;
	width: 100%;
	align-items: center;
	margin-bottom: ${`${space[4]}px`};
	${from.desktop} {
		margin-bottom: ${space[6]}px;
	}
`;
const svgCss = css`
	margin-bottom: ${`${space[2]}px`};
	${from.desktop} {
		margin-bottom: ${space[4]}px;
	}
`;
const titleCss = css`
	text-align: center;
	${headlineBold17};
	color: ${neutral[7]};
	${from.desktop} {
		${headlineBold24};
	}
`;
const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-bottom: ${space[1]}px;
	background-color: ${brand[400]};
	color: ${neutral[100]};
`;
const dividerCss = css`
	width: 100%;
	margin: ${space[4]}px 0;
	${from.desktop} {
		margin: ${space[6]}px 0;
	}
`;
const checkmarkBenefitList = css`
	text-align: left;
	width: 100%;
	${from.desktop} {
		width: 90%;
	}
`;

export function GuardianLightCard({
	cardPosition,
	link,
	productDescription,
	ctaCopy,
}: GuardianLightProps): JSX.Element {
	const quantumMetricButtonRef = `guardianLight-${cardPosition}-button`;
	const { label, benefits } = productDescription;
	return (
		<section css={container}>
			<div css={titleSummarySvgCss}>
				<div css={svgCss}>{productDescription.icon}</div>
				<h2 css={titleCss}>{label}</h2>
			</div>
			<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
				<LinkButton
					href={link}
					cssOverrides={btnStyleOverrides}
					data-qm-trackable={quantumMetricButtonRef}
				>
					{ctaCopy}
				</LinkButton>
			</ThemeProvider>
			<Divider cssOverrides={dividerCss} />
			<BenefitsCheckList
				benefitsCheckListData={benefits.map((benefit) => {
					return {
						text: benefit.copy,
						isChecked: true,
						toolTip: benefit.tooltip,
						isNew: benefit.isNew,
					};
				})}
				style={'noIcon'}
				iconColor={palette.brand[500]}
				cssOverrides={checkmarkBenefitList}
			/>
		</section>
	);
}
