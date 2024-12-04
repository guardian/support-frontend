import { css, ThemeProvider } from '@emotion/react';
import {
	from,
	headlineBold17,
	headlineBold24,
	palette,
	space,
	until,
} from '@guardian/source/foundations';
import { LinkButton, themeLinkBrand } from '@guardian/source/react-components';
import { Divider } from '@guardian/source-development-kitchen/react-components';
import { BenefitsCheckList } from 'components/checkoutBenefits/benefitsCheckList';
import { type ProductDescription } from 'helpers/productCatalog';

export type GuardianLightCardProps = {
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
	color: ${palette.brand[100]};
	${from.desktop} {
		${headlineBold24};
	}
`;
const btnStyleOverrides = css`
	width: 100%;
	justify-content: center;
	margin-bottom: ${space[1]}px;
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
	cardIndex,
	link,
	productDescription,
	ctaCopy,
}: GuardianLightCardProps): JSX.Element {
	const quantumMetricButtonRef = `guardianLight-${cardIndex}-button`;
	const { label, benefits } = productDescription;
	const icon = cardIndex === 0 ? leftSvgIcon : rightSvgIcon;
	return (
		<section css={container}>
			<div css={titleSummarySvgCss}>
				<div css={svgCss}>{icon}</div>
				<h2 css={titleCss}>{label}</h2>
			</div>
			<ThemeProvider theme={themeLinkBrand}>
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

const leftSvgIcon = (
	<svg
		width="58"
		height="59"
		viewBox="0 0 58 59"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect y="0.734375" width="58" height="58" rx="28.9248" fill="#FFE500" />
		<mask
			id="mask0_1729_29710"
			mask-type="alpha"
			maskUnits="userSpaceOnUse"
			x="13"
			y="14"
			width="32"
			height="32"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M44.97 29.7344C44.97 38.3447 37.82 45.3247 29 45.3247C20.18 45.3247 13.03 38.3447 13.03 29.7344C13.03 21.1241 20.18 14.144 29 14.144C37.82 14.144 44.97 21.1241 44.97 29.7344ZM29.0533 30.2933C30.8522 30.2933 32.9998 28.3193 32.9998 25.8893C32.9998 23.4593 31.5425 22.0366 29.0533 22.0366C26.5641 22.0366 25.0999 23.4593 25.0999 25.8893C25.0999 28.3193 27.4287 30.2933 29.0533 30.2933ZM37.8987 41.0875C35.4336 42.9305 32.3509 44.0255 29.0061 44.0255C25.6883 44.0255 22.6282 42.948 20.1731 41.1319L22.0729 34.1868L23.07 33.2134C25.0223 32.5736 26.884 32.24 29.0455 32.24C31.207 32.24 33.0756 32.5872 35.021 33.2134L36.018 34.1868H36.0111L37.8987 41.0875Z"
				fill="#052962"
			/>
		</mask>
		<g mask="url(#mask0_1729_29710)">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M30.402 15.6597H27.6754C27.6754 15.6597 25.6063 17.0441 22.9538 18.5681C21.1744 19.5544 19.303 20.37 17.3652 21.0035L15.7957 23.2738C17.246 35.3871 21.3326 42.4583 27.6754 45.3699H30.3956C36.7382 42.4583 40.8249 35.3871 42.2753 23.2738L40.709 21.0035C38.7699 20.3703 36.8974 19.5548 35.1171 18.5681C32.4646 17.0441 30.3956 15.6597 30.3956 15.6597H30.402Z"
				fill="#052962"
			/>
			<path
				d="M27.5497 16.2662C27.6589 16.195 27.7456 16.138 27.8074 16.0972H30.2637C30.3255 16.138 30.4121 16.195 30.5213 16.2662C30.7582 16.4208 31.1015 16.6426 31.5279 16.9122C32.3804 17.4511 33.5662 18.1816 34.8992 18.9475L34.8991 18.9475L34.9051 18.9508C36.6666 19.927 38.5171 20.738 40.4324 21.3731L41.821 23.3858C40.3673 35.2852 36.3583 42.1043 30.2992 44.9324H27.7718C21.7126 42.1043 17.7037 35.2853 16.2499 23.386L17.6416 21.3731C19.5557 20.7377 21.4052 19.9267 23.1659 18.9508L23.1659 18.9508L23.1718 18.9475C24.5047 18.1816 25.6905 17.4511 26.5431 16.9122C26.9694 16.6426 27.3128 16.4208 27.5497 16.2662Z"
				stroke="#052962"
				stroke-opacity="0.3"
				stroke-width="0.875"
			/>
		</g>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M30.3624 15.605H27.6422C27.6422 15.605 27.5416 15.6723 27.3563 15.7936C26.7013 16.2224 24.9881 17.3255 22.9206 18.5134C21.1412 19.4997 19.2698 20.3153 17.332 20.9488L15.7625 23.2191C17.2128 35.3324 21.2994 42.4036 27.6422 45.3152H30.3624C36.705 42.4036 40.7917 35.3324 42.2421 23.2191L40.6758 20.9488C38.7367 20.3156 36.8642 19.5001 35.0839 18.5134C32.5173 17.0387 30.4969 15.6947 30.3688 15.6093C30.3646 15.6064 30.3624 15.605 30.3624 15.605ZM39.4813 22.466C37.6434 21.8274 35.8651 21.033 34.1662 20.0916L34.1536 20.0845L34.141 20.0773C32.7862 19.2989 31.5827 18.5574 30.7181 18.0109C30.3423 17.7733 30.0296 17.5719 29.7953 17.4196H28.2093C27.975 17.5719 27.6623 17.7733 27.2864 18.0109C26.4218 18.5574 25.2183 19.2989 23.8635 20.0773L23.851 20.0845L23.8384 20.0915C22.1403 21.0328 20.3627 21.8272 18.5257 22.466L17.6916 23.6725C19.148 34.8812 22.8993 40.9355 28.0718 43.5005H29.9328C35.1053 40.9354 38.8567 34.8808 40.313 23.6715L39.4813 22.466Z"
			fill="#052962"
		/>
	</svg>
);

const rightSvgIcon = (
	<svg
		width="58"
		height="59"
		viewBox="0 0 58 59"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="29" cy="29.7344" r="29" fill="#FFE500" />
		<path
			d="M44.3594 29.7344C44.3594 38.2171 37.4827 45.0938 29 45.0938C20.5173 45.0938 13.6406 38.2171 13.6406 29.7344C13.6406 21.2516 20.5173 14.375 29 14.375C37.4827 14.375 44.3594 21.2516 44.3594 29.7344Z"
			fill="#052962"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M29 43.6346C36.6769 43.6346 42.9002 37.4112 42.9002 29.7344C42.9002 22.0575 36.6769 15.8342 29 15.8342C21.3231 15.8342 15.0998 22.0575 15.0998 29.7344C15.0998 37.4112 21.3231 43.6346 29 43.6346ZM29 45.0938C37.4827 45.0938 44.3594 38.2171 44.3594 29.7344C44.3594 21.2516 37.4827 14.375 29 14.375C20.5173 14.375 13.6406 21.2516 13.6406 29.7344C13.6406 38.2171 20.5173 45.0938 29 45.0938Z"
			fill="#052962"
		/>
		<mask
			id="mask0_1729_29750"
			mask-type="alpha"
			maskUnits="userSpaceOnUse"
			x="14"
			y="15"
			width="29"
			height="29"
		>
			<path
				d="M42.9968 29.3324C42.9968 37.1314 36.6744 43.4538 28.8753 43.4538C21.0763 43.4538 14.7539 37.1314 14.7539 29.3324C14.7539 21.5333 21.0763 15.2109 28.8753 15.2109C36.6744 15.2109 42.9968 21.5333 42.9968 29.3324Z"
				fill="#0077B6"
			/>
		</mask>
		<g mask="url(#mask0_1729_29750)">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M19.7899 21.4688C19.91 21.4688 20.0137 21.5529 20.0385 21.6704C20.1664 22.2759 20.3484 22.6859 20.599 22.9778C20.8469 23.2666 21.1815 23.4623 21.6583 23.6032C21.7663 23.6351 21.8404 23.7343 21.8404 23.8469C21.8404 23.9595 21.7663 24.0587 21.6583 24.0906C21.1815 24.2315 20.8469 24.4273 20.5989 24.716C20.3482 25.0079 20.1661 25.418 20.038 26.0236C20.0131 26.141 19.9094 26.2251 19.7894 26.2251C19.6693 26.2251 19.5656 26.141 19.5407 26.0236C19.4126 25.418 19.2305 25.0079 18.9798 24.716C18.7318 24.4271 18.3972 24.2312 17.9203 24.09C17.8123 24.0581 17.7383 23.9589 17.7383 23.8463C17.7383 23.7338 17.8124 23.6346 17.9204 23.6027C18.4174 23.4558 18.7546 23.2479 18.9991 22.9548C19.2468 22.6578 19.4184 22.2506 19.5413 21.6702C19.5661 21.5528 19.6699 21.4687 19.7899 21.4688ZM24.1034 23.1681C24.2207 23.1681 24.3228 23.2484 24.3504 23.3625C24.6261 24.5023 24.9134 25.238 25.3586 25.7739C25.7994 26.3045 26.4183 26.6664 27.4193 27.0043C27.5226 27.0392 27.5922 27.136 27.5922 27.245C27.5922 27.354 27.5227 27.4509 27.4194 27.4858C26.464 27.8086 25.8519 28.1426 25.4029 28.6638C24.9504 29.189 24.6392 29.9325 24.3504 31.1281C24.3223 31.2446 24.218 31.3228 24.1032 31.3226C23.9884 31.3229 23.8841 31.2447 23.8559 31.1282C23.5807 29.991 23.2929 29.2549 22.8471 28.7181C22.4056 28.1866 21.7861 27.8234 20.7864 27.4858C20.6832 27.451 20.6136 27.3541 20.6136 27.2451C20.6136 27.1361 20.6831 27.0392 20.7864 27.0043C21.7419 26.6815 22.354 26.3477 22.8032 25.8266C23.2559 25.3014 23.5673 24.5581 23.8564 23.3625C23.884 23.2484 23.9861 23.1681 24.1034 23.1681Z"
				fill="#FFE500"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M36.8039 25.5123C36.8039 27.7162 34.9086 29.5234 33.2997 29.5234C31.8671 29.5234 29.8174 27.7162 29.8174 25.5123C29.8174 23.3083 31.0957 22.03 33.2997 22.03C35.5036 22.03 36.8039 23.3083 36.8039 25.5123ZM27.1066 32.9238L28.0102 31.9944C29.7734 31.3823 31.3602 31.1103 33.2997 31.1103C35.2172 31.1103 36.826 31.4277 38.5892 31.9944L39.4708 32.9238L41.2339 39.7246L40.3303 40.6314H26.225L25.3655 39.7246L27.1066 32.9238Z"
				fill="#FFE500"
			/>
			<path
				d="M23.8426 44.9629L27.0314 33.2021L39.6497 40.7942L31.9522 46.2925L23.8426 44.9629Z"
				fill="#FFE500"
			/>
		</g>
	</svg>
);
