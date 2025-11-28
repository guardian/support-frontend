import SvgGuardianLogo from 'components/svgs/guardianLogo';
import type { HeaderProps } from './header';
import './header.scss';

export function TopNav({ utility }: HeaderProps) {
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
