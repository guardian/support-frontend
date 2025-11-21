import { useTheme } from '@emotion/react';
import { Button } from '@guardian/source/react-components';

type BackButtonProps = {
	path: string;
	buttonText: string;
};

export function BackButton({ path, buttonText }: BackButtonProps) {
	const { observerThemeButton } = useTheme();
	return (
		<a href={path}>
			<Button
				priority="tertiary"
				size="xsmall"
				role="link"
				theme={observerThemeButton}
			>
				{buttonText}
			</Button>
		</a>
	);
}
