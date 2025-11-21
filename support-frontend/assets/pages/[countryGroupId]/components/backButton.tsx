import { Button } from '@guardian/source/react-components';

type BackButtonProps = {
	path: string;
	buttonText: string;
};

export function BackButton({ path, buttonText }: BackButtonProps) {
	return (
		<a href={path}>
			<Button priority="tertiary" size="xsmall" role="link">
				{buttonText}
			</Button>
		</a>
	);
}
