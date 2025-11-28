// ----- Imports ----- //
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { useState } from 'react';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import Links from '../links/links';
import { TopNav } from './headerTopNav';
import MobileMenuToggler from './mobileMenuToggler';
import './header.scss';

export type HeaderProps = {
	utility?: JSX.Element;
	countryGroupId?: CountryGroupId;
};

export default function Header({ utility, countryGroupId }: HeaderProps) {
	const [isTestUser] = useState(getGlobal<boolean>('isTestUser'));
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
						links={<Links countryGroupId={countryGroupId} location="mobile" />}
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
