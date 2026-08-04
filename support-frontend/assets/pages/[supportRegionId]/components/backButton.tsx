import { useTheme } from '@emotion/react';
import { LinkButton } from '@guardian/source/react-components';

type BackButtonProps = {
	path: string;
	buttonText: string;
};

export function BackButton({ path, buttonText }: BackButtonProps) {
	const { observerThemeButton } = useTheme();
	return (
		<LinkButton
			href={path}
			priority="tertiary"
			size="xsmall"
			role="link"
			theme={observerThemeButton}
		>
			{buttonText}
		</LinkButton>
	);
}
