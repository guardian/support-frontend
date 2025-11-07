import { css, useTheme } from '@emotion/react';
import type { ButtonProps } from '@guardian/source/react-components';
import {
	Button,
	themeButtonReaderRevenueBrand,
} from '@guardian/source/react-components';
import { getObserverButtonProps } from 'components/observer-layout/observerButtonProps';

const buttonOverrides = css`
	width: 100%;
	justify-content: center;
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
	const { observerThemeButton } = useTheme();

	const mergedTheme = {
		...themeButtonReaderRevenueBrand,
		...observerThemeButton,
	};

	const mergedProps = {
		...buttonProps,
		...(observerThemeButton ? getObserverButtonProps() : {}),
	};

	return (
		<Button
			id={id}
			cssOverrides={buttonOverrides}
			isLoading={false}
			theme={mergedTheme}
			{...mergedProps}
		>
			{buttonText}
		</Button>
	);
}
