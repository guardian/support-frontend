// ----- Imports ----- //
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import Links from '../links/links';
import { linksNavHide } from '../links/linksStyles';
import {
	headerContainer,
	headerLinksContainer,
	headerLinksContainerGBP,
	headerLinksContainerROW,
	headerWrapper,
} from './headerStyles';
import { HeaderTopNav } from './headerTopNav';
import MobileMenuToggler from './mobileMenuToggler';

export type HeaderProps = {
	countryGroupId: CountryGroupId;
	utility?: JSX.Element;
};

export default function Header({ utility, countryGroupId }: HeaderProps) {
	const headerLinksContainerRegion =
		countryGroupId === 'GBPCountries'
			? headerLinksContainerGBP
			: headerLinksContainerROW;
	return (
		<header css={headerContainer}>
			<div css={headerWrapper}>
				<div css={[headerLinksContainer]}>
					<HeaderTopNav countryGroupId={countryGroupId} utility={utility} />
					<MobileMenuToggler
						links={<Links countryGroupId={countryGroupId} location="mobile" />}
						utility={utility}
					/>
				</div>
				<div css={[headerLinksContainer, headerLinksContainerRegion]}>
					<Links
						countryGroupId={countryGroupId}
						location="desktop"
						cssOverride={linksNavHide}
					/>
				</div>
			</div>
		</header>
	);
}
