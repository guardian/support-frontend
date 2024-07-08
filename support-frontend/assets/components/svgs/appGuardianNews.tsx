import { css } from '@emotion/react';
import { from } from '@guardian/source/foundations';

const scales = css`
	height: 55px;
	width: auto;
	display: block;

	${from.mobileLandscape} {
		height: 75px;
	}
`;

export default function AppImageGuardianNews() {
	return (
		<svg
			width="75"
			height="75"
			viewBox="0 0 75 75"
			css={scales}
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			aria-labelledby="svgGuardianNewsApp"
			fill="none"
		>
			<path
				d="m0 10.059c0-5.5228 4.4772-10 10-10h54.648c5.5229 0 10 4.4772 10 10v54.648c0 5.5229-4.4771 10-10 10h-54.648c-5.5228 0-10-4.4771-10-10v-54.648z"
				fill="#052962"
			/>
			<path
				d="m0.5 10.059c0-5.2467 4.2533-9.5 9.5-9.5h54.648c5.2467 0 9.5 4.2533 9.5 9.5v54.648c0 5.2467-4.2533 9.5-9.5 9.5h-54.648c-5.2467 0-9.5-4.2533-9.5-9.5v-54.648z"
				stroke="#EC0EFF"
				stroke-opacity=".2"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="m61.134 38.699-3.6452 1.6296v16.808c-2.0504 1.9532-7.2905 4.9973-12.303 6.0436v-23.219l-3.873-1.3683v-1.0151h19.821v1.1203zm-18.172-27.999s-0.0748-7e-4 -0.1118-7e-4c-8.2172 0-12.918 11.08-12.681 26.025-0.237 15 4.4641 26.079 12.681 26.079 0.037 0 0.1118-5e-4 0.1118-5e-4v1.1515c-12.319 0.8237-29.14-8.3541-28.903-27.176-0.2369-18.876 16.584-28.054 28.903-27.23v1.1517zm2.4788-1.2026c4.8176 0.73573 10.323 3.8998 12.388 6.146v10.372h-1.1863l-11.202-15.373v-1.1445z"
				fill="#fff"
			/>
		</svg>
	);
}
