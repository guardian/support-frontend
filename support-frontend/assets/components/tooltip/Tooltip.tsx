import { css } from '@emotion/react';
import { Button, themeButtonBrand } from '@guardian/source/react-components';
import { Popover } from '@guardian/source-development-kitchen/react-components';
import { useState } from 'react';
import { InfoRound } from './InfoRound';

const popoverStyles = css`
	display: inline-block;
`;

export default function Tooltip({ content }: { content: string }): JSX.Element {
	const [isPopoverOpen, setPopoverOpen] = useState<boolean>(false);

	const handlePopoverClick = () => {
		setPopoverOpen((prev) => !prev);
	};

	return (
		<div css={popoverStyles}>
			<Popover
				title="More information"
				hideTitle={true}
				isOpen={isPopoverOpen}
				position="bottom"
				showPointer={true}
				content={content}
				width="270px"
				trigger={
					<Button
						id="info-icon"
						icon={<InfoRound />}
						size="xsmall"
						priority="primary"
						hideLabel={true}
						onClick={handlePopoverClick}
						aria-haspopup="dialog"
						data-testid="popover-trigger"
						theme={themeButtonBrand}
					>
						More information
					</Button>
				}
				handleClose={() => setPopoverOpen(false)}
			/>
		</div>
	);
}
