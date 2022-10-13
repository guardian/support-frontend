import { css } from '@emotion/react';
import { Button } from '@guardian/source-react-components';

const buttonStyles = css`
	justify-content: center;
	width: 100%;
`;

export type SavedCardButtonProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function SavedCardButton({
	onClick,
}: SavedCardButtonProps): JSX.Element {
	return (
		<Button priority="primary" onClick={onClick} cssOverrides={buttonStyles}>
			Pay with saved card
		</Button>
	);
}
