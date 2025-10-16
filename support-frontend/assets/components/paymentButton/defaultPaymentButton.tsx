import type { Theme } from '@emotion/react';
import { css, useTheme } from '@emotion/react';
import { brandAlt, neutral, opinion } from '@guardian/source/foundations';
import type { ButtonProps } from '@guardian/source/react-components';
import {
	Button,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';

const observerStyle = `background-color: ${opinion[400]}; :hover{background-color: ${opinion[200]};} color: ${neutral[100]};`;
const guardianStyle = `background-color: ${brandAlt[400]}; :hover{background-color: ${brandAlt[200]};} color: ${neutral[7]};`;
const buttonOverrides = (theme: Theme) => css`
	width: 100%;
	justify-content: center;
	${theme.organisation === 'observer' ? observerStyle : guardianStyle}
`;

export type DefaultPaymentButtonProps = ButtonProps & {
	id?: string;
	buttonText: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	type?: HTMLButtonElement['type'];
};

export function DefaultPaymentButton({
	id,
	buttonText,
	...buttonProps
}: DefaultPaymentButtonProps): JSX.Element {
	const theme = useTheme();
	return (
		<Button
			id={id}
			cssOverrides={buttonOverrides(theme)}
			isLoading={false}
			{...buttonProps}
			theme={themeButtonReaderRevenueBrand}
		>
			{buttonText}
		</Button>
	);
}
