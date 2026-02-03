import type { ReactNode } from 'react';
import SvgClose from 'components/svgs/close';
import VeggieBurgerButton from '../veggieBurgerButton/veggieBurgerButton';
import {
	buttonClose,
	menuContainer,
	menuLinksContainer,
	menuUtilityContainer,
} from './mobileMenuStyles';

export type Position = {
	x: number;
	y: number;
};

type PropTypes = {
	onClose: () => void;
	utility: ReactNode;
	links: ReactNode;
	closeButtonAt?: Position;
};

// ----- Component ----- //
function MobileMenu({
	onClose,
	closeButtonAt,
	utility,
	links,
}: PropTypes): JSX.Element {
	return (
		<div
			css={menuContainer}
			style={
				closeButtonAt && {
					width: closeButtonAt.x,
				}
			}
		>
			<div css={menuLinksContainer}>
				{links}
				{utility && <div css={menuUtilityContainer}>{utility}</div>}
			</div>
			<VeggieBurgerButton
				style={
					closeButtonAt && {
						top: closeButtonAt.y,
					}
				}
				aria-label="close"
				onClick={onClose}
				cssOverride={buttonClose}
			>
				<SvgClose />
			</VeggieBurgerButton>
		</div>
	);
}

MobileMenu.defaultProps = {
	closeButtonAt: null,
	utility: null,
};
export default MobileMenu;
