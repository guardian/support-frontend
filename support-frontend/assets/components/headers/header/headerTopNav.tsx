import SvgGuardianLogo from 'components/svgs/guardianLogo';
import type { HeaderProps } from './header';
import {
	logoContainer,
	logoContainerGBP,
	logoContainerROW,
	logoLink,
	topNavContainer,
	utilityContainer,
} from './headerTopNavStyles';

export function HeaderTopNav({ utility, supportRegionId }: HeaderProps) {
	const logoContainerRegion =
		supportRegionId === 'uk' ? logoContainerGBP : logoContainerROW;

	return (
		<div css={topNavContainer}>
			<div css={utilityContainer}>{utility}</div>
			<div css={[logoContainer, logoContainerRegion]}>
				<a
					css={logoLink}
					href="https://www.theguardian.com"
					aria-label="Return to the Guardian"
				>
					<SvgGuardianLogo />
				</a>
			</div>
		</div>
	);
}
