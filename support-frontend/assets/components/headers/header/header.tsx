import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
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
	supportRegionId: SupportRegionId;
	utility?: JSX.Element;
};

export default function Header({ utility, supportRegionId }: HeaderProps) {
	const headerLinksContainerRegion =
		supportRegionId === 'uk'
			? headerLinksContainerGBP
			: headerLinksContainerROW;
	return (
		<header css={headerContainer}>
			<div css={headerWrapper}>
				<div css={[headerLinksContainer]}>
					<HeaderTopNav supportRegionId={supportRegionId} utility={utility} />
					<MobileMenuToggler
						links={<Links supportRegionId={supportRegionId} location="mobile" />}
						utility={utility}
					/>
				</div>
				<div css={[headerLinksContainer, headerLinksContainerRegion]}>
					<Links
						supportRegionId={supportRegionId}
						location="desktop"
						cssOverride={linksNavHide}
					/>
				</div>
			</div>
		</header>
	);
}
