import type { SerializedStyles } from '@emotion/react';
import { css, ThemeProvider } from '@emotion/react';
import { neutral, space } from '@guardian/source-foundations';
import {
	Button,
	buttonThemeReaderRevenueBrand,
} from '@guardian/source-react-components';

const button = css`
	width: 100%;
	justify-content: space-around;
	margin: ${space[5]}px 0;
	color: ${neutral[7]};
`;

interface UpsellButtonProps {
	buttonCopy: string | null;
	handleButtonClick: () => void;
	cssOverrides?: SerializedStyles;
}

function UpsellButton({
	buttonCopy,
	handleButtonClick,
	cssOverrides,
}: UpsellButtonProps): JSX.Element {
	return (
		<>
			{buttonCopy && (
				<ThemeProvider theme={buttonThemeReaderRevenueBrand}>
					<Button
						iconSide="left"
						priority="primary"
						size="default"
						css={[button, cssOverrides]}
						onClick={() => handleButtonClick()}
						cssOverrides={cssOverrides}
					>
						{buttonCopy}
					</Button>
				</ThemeProvider>
			)}
		</>
	);
}

export default UpsellButton;
