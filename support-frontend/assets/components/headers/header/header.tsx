import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import Links from '../links/links';
import { linksNavHide } from '../links/linksStyles';
import TopNav from './headerTopNav';
import MobileMenuToggler from './mobileMenuToggler';
import './header.scss';

export type HeaderProps = {
	utility?: JSX.Element;
	countryGroupId?: CountryGroupId;
};

export default function Header({ utility, countryGroupId }: HeaderProps) {
	return (
		<header
			className={classNameWithModifiers('component-header', [
				countryGroupId !== 'GBPCountries'
					? 'one-row-from-tablet'
					: 'one-row-from-leftCol',
			])}
		>
			<div className="component-header__wrapper">
				<div className="component-header__row">
					<TopNav utility={utility} />
					<MobileMenuToggler
						links={<Links countryGroupId={countryGroupId} location="mobile" />}
						utility={utility}
					/>
				</div>
				<div className="component-header__row">
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
