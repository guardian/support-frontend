import { css } from '@emotion/react';
import { from, titlepiece } from '@guardian/source/foundations';
import DirectDebitMessage from 'pages/supporter-plus-thank-you/components/thankYouHeader/directDebitMessage';
import {
	header,
	headerSupportingText,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/thankYouHeader';
import Heading from './heading';
import Subheading from './subheading';

const headerTitleText = css`
	${titlepiece.small()};
	font-size: 24px;
	${from.tablet} {
		font-size: 40px;
	}
`;

type ThankYouHeaderProps = {
	name: string | null;
	showDirectDebitMessage: boolean;
};

function ThankYouHeader({
	name,
	showDirectDebitMessage,
}: ThankYouHeaderProps): JSX.Element {
	return (
		<header css={header}>
			<h1 css={headerTitleText}>
				<Heading name={name} />
			</h1>
			<p css={headerSupportingText}>
				{showDirectDebitMessage && <DirectDebitMessage />}
				<Subheading />
			</p>
		</header>
	);
}

export default ThankYouHeader;
