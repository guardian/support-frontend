// ----- Imports ----- //
import type { Node } from 'react';
import React, { Component } from 'react';
import Dialog from 'components/dialog/dialog';
import SvgMenu from 'components/svgs/menu';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { Position } from '../mobileMenu/mobileMenu';
import MobileMenu from '../mobileMenu/mobileMenu';
import VeggieBurgerButton from '../veggieBurgerButton/veggieBurgerButton';

export default class MobileMenuToggler extends Component<
	{
		utility: Node;
		links: Node;
	},
	{
		menuOpen: boolean;
		buttonPosition: Position;
	}
> {
	state = {
		buttonPosition: null,
		menuOpen: false,
	};
	buttonRef: Element | null | undefined;

	render() {
		const { menuOpen, buttonPosition } = this.state;
		const { utility, links } = this.props;
		return (
			<div className="component-header-mobile-menu-toggler">
				<VeggieBurgerButton
					getRef={(r) => {
						this.buttonRef = r;
					}}
					aria-haspopup="dialog"
					label="menu"
					onClick={() => {
						this.setState({
							menuOpen: true,
						});
						sendTrackingEventsOnClick({
							id: 'open_mobile_menu',
							componentType: 'ACQUISITIONS_BUTTON',
						})();

						if (this.buttonRef) {
							const bounds = this.buttonRef.getBoundingClientRect();
							this.setState({
								buttonPosition: {
									x: bounds.left + bounds.width / 2,
									y: bounds.top,
								},
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
						this.setState({
							menuOpen: false,
						});
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
							this.setState({
								menuOpen: false,
							});
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
}
