import { css } from '@emotion/react';
import { space, sport, textSans } from '@guardian/source-foundations';

const container = css`
	display: flex;

	& div:first-child {
		margin-right: ${space[5]}px;
	}
`;

const qrContainer = css`
	background-color: ${sport[800]};
`;

const title = css`
	${textSans.small({ lineHeight: 'regular' })};
	margin-top: ${space[3]}px;
	margin-left: ${space[3]}px;
`;

const img = css`
	max-width: 175px;
	margin: ${space[5]}px 40px 35px;
`;

function QRCodes(): JSX.Element {
	return (
		<div css={container}>
			<div css={qrContainer}>
				<p css={title}>Download on the App Store</p>
				<img
					css={img}
					src="https://tools-qr-production.s3.amazonaws.com/output/apple-toolbox/731eb34571091e0b5081c965ebb0d652/f04d238959ff2fb888b8cb92efae42d8.png"
				/>
			</div>
			<div css={qrContainer}>
				<p css={title}>Get it on Google Play</p>
				<img
					css={img}
					src="https://tools-qr-production.s3.amazonaws.com/output/apple-toolbox/731eb34571091e0b5081c965ebb0d652/f04d238959ff2fb888b8cb92efae42d8.png"
				/>
			</div>
		</div>
	);
}

export default QRCodes;
