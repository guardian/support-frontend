// ----- Imports ----- //
import { useRef, useState } from 'preact/hooks';
import type { ReactNode } from 'react';
import Dialog from 'components/dialog/dialog';
import SvgMenu from 'components/svgs/menu';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { Position } from '../mobileMenu/mobileMenu';
import MobileMenu from '../mobileMenu/mobileMenu';
import VeggieBurgerButton from '../veggieBurgerButton/veggieBurgerButton';

type PropTypes = {
	utility: ReactNode;
	links: ReactNode;
};

export default function MobileMenuToggler({
	utility,
	links,
}: PropTypes): JSX.Element {
	const [menuOpen, setMenuOpen] = useState<boolean>(false);
	const [buttonPosition, setButtonPosition] = useState<Position | undefined>(
		undefined,
	);
	const buttonRef = useRef<HTMLButtonElement>(null);

	return (
		<div className="component-header-mobile-menu-toggler">
			<VeggieBurgerButton
				ref={buttonRef}
				aria-haspopup="dialog"
				label="menu"
				onClick={() => {
					setMenuOpen(true);
					sendTrackingEventsOnClick({
						id: 'open_mobile_menu',
						componentType: 'ACQUISITIONS_BUTTON',
					})();

					if (buttonRef.current) {
						const bounds = buttonRef.current.getBoundingClientRect();
						setButtonPosition({
							x: bounds.left + bounds.width / 2,
							y: bounds.top,
						});
					}
				}}
			>
				<SvgMenu />
			</VeggieBurgerButton>
			<Dialog
				aria-label="Menu"
				open={menuOpen}
				closeDialog={() => {
					setMenuOpen(false);
					sendTrackingEventsOnClick({
						id: 'dismiss_mobile_menu',
						componentType: 'ACQUISITIONS_BUTTON',
					})();
				}}
			>
				<MobileMenu
					closeButtonAt={buttonPosition}
					utility={utility}
					links={links}
					onClose={() => {
						setMenuOpen(false);
						sendTrackingEventsOnClick({
							id: 'close_mobile_menu',
							componentType: 'ACQUISITIONS_BUTTON',
						})();
					}}
				/>
			</Dialog>
		</div>
	);
}
