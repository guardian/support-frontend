// ----- Imports ----- //
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { Component } from 'react';
import SvgGuardianLogo from 'components/svgs/guardianLogo';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import Links from '../links/links';
import MobileMenuToggler from './mobileMenuToggler';
import './header.scss';

type PropTypes = {
	utility?: JSX.Element;
	countryGroupId: CountryGroupId;
};
type State = {
	isTestUser: boolean | null | undefined;
};

// ----- Component ----- //

type TopNavPropTypes = {
	utility?: JSX.Element;
};

function TopNav({ utility }: TopNavPropTypes) {
	return (
		<div className="component-header-topnav">
			<div className="component-header-topnav__utility">{utility}</div>
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
	};
	state = {
		isTestUser: getGlobal<boolean>('isTestUser'),
	};

	componentDidMount(): void {
		this.setState({
			isTestUser: getGlobal<boolean>('isTestUser'),
		});
	}

	render(): JSX.Element {
		const { utility, countryGroupId } = this.props;
		const { isTestUser } = this.state;

		return (
			<header
				className={classNameWithModifiers('component-header', [
					countryGroupId !== 'GBPCountries'
						? 'one-row-from-tablet'
						: 'one-row-from-leftCol',
				])}
			>
				{!!isTestUser && (
					<div className="test-user-banner">
						<span>You are a test user</span>
					</div>
				)}
				<div className="component-header__wrapper">
					<div className="component-header__row">
						<TopNav utility={utility} />
						<MobileMenuToggler
							links={
								<Links countryGroupId={countryGroupId} location="mobile" />
							}
							utility={utility}
						/>
					</div>
					<div className="component-header__row">
						<Links countryGroupId={countryGroupId} location="desktop" />
					</div>
				</div>
			</header>
		);
	}
}
