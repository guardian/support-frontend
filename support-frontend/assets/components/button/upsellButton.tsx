import type { SerializedStyles } from '@emotion/react';
import { css, ThemeProvider } from '@emotion/react';
import { from, neutral, space } from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenueBrand,
} from '@guardian/source-react-components';

const button = css`
	width: 100%;
	justify-content: space-around;
	color: ${neutral[7]};
	margin: ${space[5]}px 0 ${space[3]}px;

	${from.mobileMedium} {
		margin-bottom: ${space[4]}px;
	}

	${from.desktop} {
		margin: ${space[6]}px 0 ${space[5]}px;
	}
`;

interface UpsellButtonProps {
	buttonCopy: string | null;
	handleButtonClick: () => void;
	cssOverrides?: SerializedStyles;
}

function UpsellButton({
	buttonCopy,
	handleButtonClick,
}: UpsellButtonProps): JSX.Element {
	return (
		<>
			{buttonCopy && (
				<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
					<Button
						iconSide="left"
						priority="primary"
						size="default"
						cssOverrides={button}
						onClick={handleButtonClick}
					>
						{buttonCopy}
					</Button>
				</ThemeProvider>
			)}
		</>
	);
}

export default UpsellButton;
