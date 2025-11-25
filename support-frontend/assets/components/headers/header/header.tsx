// ----- Imports ----- //
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { useState } from 'react';
import SvgGuardianLogo from 'components/svgs/guardianLogo';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import Links from '../links/links';
import {
	component_header__row,
	logoContainer,
	logoContainerGBP,
	logoContainerROW,
	logoLink,
	testUserBanner,
	topNavContainer,
	utilityContainer,
} from './headerStyles';
import MobileMenuToggler from './mobileMenuToggler';
import './header.scss';

type HeaderProps = {
	countryGroupId: CountryGroupId;
	utility?: JSX.Element;
};

function HeaderTopNav({ utility, countryGroupId }: HeaderProps) {
	const logoContainerRegion =
		countryGroupId === 'GBPCountries' ? logoContainerGBP : logoContainerROW;
	return (
		<div css={topNavContainer}>
			<div css={utilityContainer}>{utility}</div>
			<div css={[logoContainer, logoContainerRegion]}>
				<a css={logoLink} href="https://www.theguardian.com">
					<div className="visually-hidden">Return to the Guardian</div>
					<SvgGuardianLogo />
				</a>
			</div>
		</div>
	);
}

export default function Header({ utility, countryGroupId }: HeaderProps) {
	const [isTestUser] = useState(getGlobal<boolean>('isTestUser'));
	const countryModifier =
		countryGroupId !== 'GBPCountries'
			? 'one-row-from-tablet'
			: 'one-row-from-leftCol';
	return (
		<header
			className={classNameWithModifiers('component-header', [
				countryModifier,
				'display-navigation',
			])}
		>
			{!!isTestUser && (
				<div css={testUserBanner}>
					<span>You are a test user</span>
				</div>
			)}
			<div className="component-header__wrapper">
				<div className="component-header__row">
					<HeaderTopNav countryGroupId={countryGroupId} utility={utility} />
					<MobileMenuToggler
						links={<Links countryGroupId={countryGroupId} location="mobile" />}
						utility={utility}
					/>
				</div>
				<div css={component_header__row}>
					<Links countryGroupId={countryGroupId} location="desktop" />
				</div>
			</div>
		</header>
	);
}
