import { css } from '@emotion/react';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import 'stylesheets/gu-sass/gu-sass.scss';
import 'stylesheets/skeleton/fonts.scss';
import 'stylesheets/skeleton/reset-src.scss';
import { PageScaffold } from 'components/page/pageScaffold';
import Footer from './components/footer';

const container = css`
	background-color: white;
	color: black;
	font-size: 24px;
`;

export default function UnsupportedBrowser(): JSX.Element {
	return (
		<>
			<PageScaffold header={<Header />} footer={<Footer />}>
				<div css={container}>UNSUPPORTED BROWSER</div>
			</PageScaffold>
		</>
	);
}

/*
Standard sizes and margins for unsupportedBrowser
*/
// .gu-content-margin {
// 	box-sizing: border-box;
// 	padding: 0 ($gu-h-spacing * 0.5);

// 	@include mq($from: mobileLandscape) {
// 		width: gu-breakpoint(mobileLandscape);
// 		margin: 0 auto;
// 		padding: 0 $gu-h-spacing;
// 	}

// 	@include mq($from: phablet) {
// 		width: gu-breakpoint(phablet);
// 		margin: 0 auto;
// 		padding: 0 auto;
// 	}

// 	@include mq($from: tablet) {
// 		width: gu-breakpoint(tablet);
// 		padding: 0 $gu-h-spacing;
// 	}

// 	@include mq($from: desktop) {
// 		width: gu-breakpoint(desktop);
// 		padding: 0 $gu-h-spacing 0 $gu-h-spacing * 2;
// 	}

// 	@include mq($from: leftCol) {
// 		width: gu-breakpoint(leftCol);
// 		padding: 0 $gu-h-spacing * 1.5;
// 	}

// 	@include mq($from: wide) {
// 		width: gu-breakpoint(wide);
// 	}
// }

// .unsupported-browser__introduction-text {
// 	@extend .gu-content-margin;
// 	background-color: #e9e939;
// 	padding-top: 5px;
// 	padding-bottom: 5px;
// 	margin-top: 5px;
// 	margin-bottom: 5px;
// }

// .unsupported-browser__why-support {
// 	padding-bottom: $gu-v-spacing * 2;
// }

// .unsupported-browser__why-support-content {
// 	@extend .gu-content-margin;
// }

// .unsupported-browser__why-support-heading {
// 	font-weight: 700;
// 	font-family: $gu-headline;
// 	font-size: 24px;
// 	padding: $gu-v-spacing 0 0;
// }

// .unsupported-browser__why-support-subheading {
// 	font-weight: 700;
// 	font-family: $gu-headline;
// 	font-size: 20px;
// 	padding: $gu-v-spacing 0;
// }

// .unsupported-browser__why-support-copy {
// 	@include mq($from: desktop) {
// 		width: 60%;
// 	}
// }
