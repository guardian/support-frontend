import { css } from '@emotion/react';
import {
	from,
	headlineBold20,
	headlineBold24,
	palette,
	space,
	until,
} from '@guardian/source/foundations';
import { LinkButton, themeLinkBrand } from '@guardian/source/react-components';
import { Divider } from '@guardian/source-development-kitchen/react-components';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import { type ProductDescription } from 'helpers/productCatalog';
import { guardianAdLiteIconLeftSvg } from './guardianAdLiteIconLeftSvg';
import { guardianAdLiteIconRightSvg } from './guardianAdLiteIconRightSvg';

export type GuardianAdLiteCardProps = {
	cardIndex: number;
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
	${from.desktop} {
		max-width: 460px;
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
		margin-bottom: ${space[3]}px;
	}
`;
const titleCss = (cardIndex: number) => css`
	text-align: center;
	${headlineBold20};
	color: ${palette.brand[100]};
	${until.desktop} {
		max-width: ${cardIndex === 1 ? '85%' : '100%'};
	}
	${from.desktop} {
		max-width: ${cardIndex === 0 ? '50%' : '100%'};
		${headlineBold24};
	}
`;
const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-bottom: ${space[1]}px;
	${from.desktop} {
		margin-bottom: ${space[2]}px;
	}
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

export function GuardianAdLiteCard({
	cardIndex,
	link,
	productDescription,
	ctaCopy,
}: GuardianAdLiteCardProps): JSX.Element {
	const quantumMetricButtonRef = `guardianAdLite-${cardIndex}-button`;
	const { label, benefits } = productDescription;
	const icon =
		cardIndex === 0 ? guardianAdLiteIconLeftSvg : guardianAdLiteIconRightSvg;
	return (
		<section css={container}>
			<div css={titleSummarySvgCss}>
				<div css={svgCss}>{icon}</div>
				<h2 css={titleCss(cardIndex)}>{label}</h2>
			</div>
			<LinkButton
				href={link}
				cssOverrides={btnStyleOverrides}
				data-qm-trackable={quantumMetricButtonRef}
				theme={themeLinkBrand}
			>
				{ctaCopy}
			</LinkButton>
			<Divider cssOverrides={dividerCss} />
			<BenefitsCheckList
				benefitsCheckListData={benefits.map((benefit) => {
					return {
						text: benefit.copy,
						isChecked: true,
						toolTip: benefit.tooltip,
						isNew: benefit.isNew,
						hideBullet: benefit.hideBullet,
					};
				})}
				style={'bullet'}
				iconColor={palette.brand[500]}
				cssOverrides={checkmarkBenefitList}
			/>
		</section>
	);
}
