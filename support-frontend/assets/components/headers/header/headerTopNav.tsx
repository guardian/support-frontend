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

export function HeaderTopNav({ utility, countryGroupId }: HeaderProps) {
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
