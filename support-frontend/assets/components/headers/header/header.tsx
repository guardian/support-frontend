// ----- Imports ----- //
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { useState } from 'react';
import SvgGuardianLogo from 'components/svgs/guardianLogo';
import { getGlobal } from 'helpers/globalsAndSwitches/globals';
import Links from '../links/links';
import { component_header_links_mobile_hide } from '../links/linksStyles';
import {
	headerContainer,
	headerContainerGBP,
	headerContainerROW,
	headerLinksContainer,
	headerTestUserBanner,
	headerWrapper,
	logoContainer,
	logoContainerGBP,
	logoContainerROW,
	logoLink,
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
	const headerContainerRegion =
		countryGroupId === 'GBPCountries' ? headerContainerGBP : headerContainerROW;
	return (
		<header css={[headerContainer, headerContainerRegion]}>
			{!!isTestUser && (
				<div css={headerTestUserBanner}>
					<span>You are a test user</span>
				</div>
			)}
			<div css={headerWrapper}>
				<div css={headerLinksContainer}>
					<HeaderTopNav countryGroupId={countryGroupId} utility={utility} />
					<MobileMenuToggler
						links={<Links countryGroupId={countryGroupId} location="mobile" />}
						utility={utility}
					/>
				</div>
				<div css={headerLinksContainer}>
					<Links
						countryGroupId={countryGroupId}
						location="desktop"
						cssOverride={component_header_links_mobile_hide}
					/>
				</div>
			</div>
		</header>
	);
}
