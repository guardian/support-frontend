// ----- Imports ----- //
import { Component } from 'react';
import SvgGuardianLogo from 'components/svgs/guardianLogo';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import Links from '../links/links';
import MobileMenuToggler from './mobileMenuToggler';
import Padlock from './padlock.svg';
import './header.scss';

export type PropTypes = {
	utility?: JSX.Element;
	countryGroupId: CountryGroupId;
	display?: 'navigation' | 'checkout' | 'guardianLogo' | void;
};
export type State = {
	isTestUser: boolean | null | undefined;
};

// ----- Component ----- //

type TopNavPropTypes = {
	utility?: JSX.Element;
	display: 'navigation' | 'checkout' | 'guardianLogo' | void;
};

function TopNav({ display, utility }: TopNavPropTypes) {
	return (
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
			<div className="component-header-topnav-logo">
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
}

export default class Header extends Component<PropTypes, State> {
	static defaultProps = {
		utility: null,
		display: 'navigation',
	};
	state = {
		isTestUser: getGlobal<boolean>('isTestUser'),
	};

	componentDidMount(): void {
		if (this.props.display === 'navigation') {
			this.setState({
				isTestUser: getGlobal<boolean>('isTestUser'),
			});
		}
	}

	render(): JSX.Element {
		const { utility, display, countryGroupId } = this.props;
		const { isTestUser } = this.state;

		return (
			<header
				className={classNameWithModifiers('component-header', [
					countryGroupId !== 'GBPCountries'
						? 'one-row-from-tablet'
						: 'one-row-from-leftCol',
					display === 'navigation' ? 'display-navigation' : null,
					display === 'checkout' ? 'display-checkout' : null,
				])}
			>
				{!!isTestUser && (
					<div className="test-user-banner">
						<span>You are a test user</span>
					</div>
				)}
				<div className="component-header__wrapper">
					<div className="component-header__row">
						<TopNav
							display={display}
							utility={display === 'navigation' ? utility : undefined}
						/>
						{display === 'navigation' && (
							<MobileMenuToggler
								links={
									<Links countryGroupId={countryGroupId} location="mobile" />
								}
								utility={utility}
							/>
						)}
					</div>
					{display === 'navigation' && (
						<div className="component-header__row">
							<Links countryGroupId={countryGroupId} location="desktop" />
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
