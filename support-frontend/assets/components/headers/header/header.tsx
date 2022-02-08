// ----- Imports ----- //
import type { Node } from 'react';
import { Component } from 'react';
import SvgGuardianLogo from 'components/svgs/guardianLogo';
import 'helpers/types/option';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { ElementResizer } from 'helpers/polyfills/layout';
import { onElementResize } from 'helpers/polyfills/layout';
import type { Option } from 'helpers/types/option';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import Links from '../links/links';
import MobileMenuToggler from './mobileMenuToggler';
import Padlock from './padlock.svg';
import './header.scss';

export type PropTypes = {
	utility: Option<Node>;
	countryGroupId: CountryGroupId;
	display?: 'navigation' | 'checkout' | 'guardianLogo' | void;
};
export type State = {
	fitsLinksInOneRow: boolean;
	fitsLinksAtAll: boolean;
	isTestUser: boolean | null | undefined;
};

// ----- Metrics ----- //
const getMenuStateMetrics = ({ menuRef, logoRef, containerRef }): State => {
	const [logoLeft, menuWidth, containerLeft, containerWidth] = [
		logoRef.getBoundingClientRect().left,
		menuRef.getBoundingClientRect().width,
		containerRef.getBoundingClientRect().left,
		containerRef.getBoundingClientRect().width,
	];
	const fitsLinksAtAll = containerWidth - menuWidth > 0;
	const fitsLinksInOneRow =
		fitsLinksAtAll && logoLeft - containerLeft - menuWidth > 0;
	const isTestUser = getGlobal<boolean>('isTestUser');
	return {
		fitsLinksInOneRow,
		fitsLinksAtAll,
		isTestUser,
	};
};

// ----- Component ----- //
type TopNavPropTypes = {
	utility: Node;
	getLogoRef: (arg0: Element | null | undefined) => void;
	display: 'navigation' | 'checkout' | 'guardianLogo' | void;
};

const TopNav = ({ display, getLogoRef, utility }: TopNavPropTypes) => (
	<div className="component-header-topnav">
		<div className="component-header-topnav__utility">{utility}</div>
		{display === 'checkout' && (
			<div className="component-header-topnav__checkout">
				<div />
				<div className="component-header-topnav--checkout-text">
					<div className="component-header--padlock">
						<Padlock />
					</div>
					<h1>Checkout</h1>
				</div>
			</div>
		)}
		<div className="component-header-topnav-logo" ref={getLogoRef}>
			<a
				className="component-header-topnav-logo__graun"
				href="https://www.theguardian.com"
			>
				<div className="visually-hidden">Return to the Guardian</div>
				<SvgGuardianLogo />
			</a>
		</div>
	</div>
);

export default class Header extends Component<PropTypes, State> {
	static defaultProps = {
		utility: null,
		display: 'navigation',
	};
	state = {
		fitsLinksInOneRow: false,
		fitsLinksAtAll: false,
		isTestUser: getGlobal<boolean>('isTestUser'),
	};

	componentDidMount() {
		if (
			this.props.display === 'navigation' &&
			this.menuRef &&
			this.logoRef &&
			this.containerRef
		) {
			this.observer = onElementResize(
				[this.logoRef, this.menuRef, this.containerRef],
				([logoRef, menuRef, containerRef]) => {
					this.setState(
						getMenuStateMetrics({
							menuRef,
							logoRef,
							containerRef,
						}),
					);
				},
			);
		}
	}

	componentWillUnmount() {
		if (this.observer) {
			this.observer.stopListening();
		}
	}

	logoRef: Element | null | undefined;
	menuRef: Element | null | undefined;
	containerRef: Element | null | undefined;
	observer: ElementResizer;

	render() {
		const { utility, display, countryGroupId } = this.props;
		const { fitsLinksInOneRow, fitsLinksAtAll, isTestUser } = this.state;
		return (
			<header
				className={classNameWithModifiers('component-header', [
					fitsLinksInOneRow ? 'one-row' : null,
					display === 'navigation' ? 'display-navigation' : null,
					!fitsLinksAtAll ? 'display-veggie-burger' : null,
					display === 'checkout' ? 'display-checkout' : null,
				])}
			>
				{!!isTestUser && (
					<div className="test-user-banner">
						<span>You are a test user</span>
					</div>
				)}
				<div
					className="component-header__wrapper"
					ref={(el) => {
						this.containerRef = el;
					}}
				>
					<div className="component-header__row">
						<TopNav
							display={display}
							utility={
								display === 'navigation' && fitsLinksAtAll ? utility : null
							}
							getLogoRef={(el) => {
								this.logoRef = el;
							}}
						/>
						{display === 'navigation' && (
							<MobileMenuToggler
								links={
									<Links countryGroupId={countryGroupId} location="mobile" />
								}
								countryGroupId={countryGroupId}
								utility={utility}
							/>
						)}
					</div>
					{display === 'navigation' && (
						<div className="component-header__row">
							<Links
								countryGroupId={countryGroupId}
								location="desktop"
								getRef={(el) => {
									this.menuRef = el;
								}}
							/>
						</div>
					)}
					{display === 'checkout' && (
						<div className="component-header__row component-header-checkout--row">
							<div className="component-header--padlock">
								<Padlock />
							</div>
							<div>Checkout</div>
						</div>
					)}
				</div>
			</header>
		);
	}
}
