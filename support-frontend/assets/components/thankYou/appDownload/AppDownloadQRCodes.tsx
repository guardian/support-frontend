import { css } from '@emotion/react';
import { neutral, space, sport, textSans } from '@guardian/source-foundations';

const container = css`
	display: flex;
	margin-bottom: ${space[3]}px;

	& div:first-of-type {
		margin-right: ${space[5]}px;
	}
`;

const qrContainer = css`
	background-color: ${sport[800]};
	border: 1px solid ${neutral[93]};
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const title = css`
	${textSans.small({ lineHeight: 'regular' })};
	margin-top: ${space[3]}px;
	margin-left: ${space[3]}px;
`;

const qrCode = css`
	padding: ${space[5]}px ${space[9]}px ${space[9]}px;
	width: 100%;
	display: block;
`;

function SvgQRCode(): JSX.Element {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 29 29"
			shape-rendering="crispEdges"
			css={qrCode}
		>
			<path fill="#ffffff" d="M0 0h29v29H0z" />
			<path
				stroke="#000000"
				d="M0 0.5h7m3 0h1m2 0h3m1 0h3m2 0h7M0 1.5h1m5 0h1m4 0h7m2 0h1m1 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1m1 0h1m4 0h1m1 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h4m2 0h2m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h1m3 0h1m2 0h2m1 0h3m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m1 0h2m7 0h2m1 0h1m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h2m4 0h1m1 0h1m1 0h3M0 8.5h1m1 0h5m2 0h1m1 0h1m4 0h2m1 0h1m2 0h5M2 9.5h4m1 0h4m2 0h3m3 0h6m3 0h1M0 10.5h2m1 0h1m1 0h2m2 0h1m1 0h6m3 0h2M1 11.5h1m1 0h3m2 0h1m2 0h1m1 0h1m1 0h1m3 0h1m3 0h1m1 0h1m1 0h1M0 12.5h2m4 0h1m1 0h3m1 0h1m1 0h2m1 0h1m7 0h2M0 13.5h4m1 0h1m2 0h4m3 0h2m1 0h5m1 0h1m3 0h1M2 14.5h3m1 0h1m2 0h4m11 0h3M0 15.5h2m8 0h1m3 0h1m1 0h1m2 0h3m2 0h1m2 0h1M2 16.5h1m3 0h5m1 0h1m3 0h2m1 0h1m3 0h1m1 0h2M0 17.5h1m1 0h4m2 0h1m2 0h5m2 0h2m1 0h4m1 0h1m1 0h1M0 18.5h1m1 0h1m1 0h1m1 0h2m3 0h1m1 0h5m3 0h2m1 0h1m1 0h1M0 19.5h1m1 0h1m1 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1m2 0h1M0 20.5h1m2 0h7m4 0h2m1 0h2m1 0h5m1 0h3M8 21.5h4m3 0h2m2 0h2m3 0h5M0 22.5h7m2 0h2m1 0h1m4 0h4m1 0h1m1 0h3M0 23.5h1m5 0h1m1 0h2m2 0h1m1 0h1m1 0h1m2 0h2m3 0h1m2 0h2M0 24.5h1m1 0h3m1 0h1m1 0h2m2 0h1m4 0h2m1 0h5m1 0h1m1 0h1M0 25.5h1m1 0h3m1 0h1m1 0h1m2 0h5m1 0h1m1 0h2m2 0h1m1 0h2M0 26.5h1m1 0h3m1 0h1m1 0h1m1 0h3m2 0h1m2 0h1m3 0h6M0 27.5h1m5 0h1m2 0h2m1 0h1m1 0h2m2 0h3m2 0h3m1 0h1M0 28.5h7m1 0h1m4 0h1m2 0h2m1 0h1m4 0h1m1 0h1"
			/>
		</svg>
	);
}

function AppDownloadQRCodes(): JSX.Element {
	return (
		<div css={container}>
			<div css={qrContainer}>
				<p css={title}>Download on the App Store</p>

				<SvgQRCode />
			</div>

			<div css={qrContainer}>
				<p css={title}>Get it on Google Play</p>

				<SvgQRCode />
			</div>
		</div>
	);
}

export default AppDownloadQRCodes;
