import { css } from '@emotion/react';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import 'stylesheets/gu-sass/gu-sass.scss';
import 'stylesheets/skeleton/fonts.scss';
import 'stylesheets/skeleton/reset-src.scss';
import { PageScaffold } from 'components/page/pageScaffold';

const container = css`
	background-color: white;
	color: black;
	font-size: 24px;
`;

export default function UnsupportedBrowser(): JSX.Element {
	return (
		<>
			<PageScaffold header={<Header />}>
				<div css={container}>UNSUPPORTED BROWSER</div>
			</PageScaffold>
		</>
	);
}
