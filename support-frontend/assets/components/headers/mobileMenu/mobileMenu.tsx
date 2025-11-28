// ----- Imports ----- //
import type { ReactNode } from 'react';
import SvgClose from 'components/svgs/close';
import VeggieBurgerButton from '../veggieBurgerButton/veggieBurgerButton';
import './mobileMenu.scss';
import { buttonClose } from './mobileMenuStyles';

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
			className="component-header-mobile-menu"
			style={
				closeButtonAt && {
					width: closeButtonAt.x,
				}
			}
		>
			<div className="component-header-mobile-menu__scroll">
				{links}
				{utility && (
					<div className="component-header-mobile-menu__utility">{utility}</div>
				)}
			</div>
			<VeggieBurgerButton
				style={
					closeButtonAt && {
						top: closeButtonAt.y,
					}
				}
				label="close"
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
