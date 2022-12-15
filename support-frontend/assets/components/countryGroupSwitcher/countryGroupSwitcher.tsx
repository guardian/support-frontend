// ----- Imports ----- //
import { css } from '@emotion/react';
import { visuallyHidden } from '@guardian/source-foundations';
import { useRef, useState } from 'react';
import Dialog from 'components/dialog/dialog';
import Menu, { LinkItem } from 'components/menu/menu';
import SvgDropdownArrow from 'components/svgs/dropdownArrow';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';
import './countryGroupSwitcher.scss';
import moduleStyles from './countryGroupSwitcher.module.scss';

const styles = moduleStyles as { button: string };

// ----- Props ----- //
export type CountryGroupSwitcherProps = {
	countryGroupIds: CountryGroupId[];
	selectedCountryGroup: CountryGroupId;
	trackProduct?: Option<SubscriptionProduct>;
	subPath: string;
};

// ----- Component ----- //
function CountryGroupSwitcher({
	subPath,
	selectedCountryGroup,
	countryGroupIds,
	trackProduct,
}: CountryGroupSwitcherProps): JSX.Element {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [bounds, setBounds] = useState({
		top: 0,
		left: 0,
	});

	function onCountryGroupSelect(cgId: CountryGroupId): void {
		sendTrackingEventsOnClick({
			id: `toggle_country_${cgId}`,
			...(trackProduct
				? {
						product: trackProduct,
				  }
				: {}),
			componentType: 'ACQUISITIONS_OTHER',
		})();
	}

	return (
		<div className="component-country-group-switcher">
			<button
				aria-label="Select a country"
				className={styles.button}
				ref={buttonRef}
				onClick={() => {
					if (buttonRef.current) {
						setBounds(buttonRef.current.getBoundingClientRect());
					}

					setMenuOpen(true);
				}}
			>
				{countryGroups[selectedCountryGroup].name}{' '}
				<strong>
					{
						currencies[countryGroups[selectedCountryGroup].currency]
							.extendedGlyph
					}
				</strong>
				<SvgDropdownArrow />
			</button>
			<Dialog
				aria-label="Select a country"
				open={menuOpen}
				blocking={false}
				styled={false}
				closeDialog={() => {
					setMenuOpen(false);
				}}
			>
				<Menu
					style={{
						top: bounds.top,
						left: bounds.left,
						position: 'absolute',
					}}
				>
					{countryGroupIds.map((countryGroupId: CountryGroupId) => (
						<LinkItem
							href={`/${countryGroups[countryGroupId].supportInternationalisationId}${subPath}${window.location.search}`}
							onClick={() => {
								sendTrackingEventsOnClick({
									id: `toggle_country: ${countryGroupId}`,
									componentType: 'ACQUISITIONS_BUTTON',
								})();

								onCountryGroupSelect(countryGroupId);
							}}
							isSelected={countryGroupId === selectedCountryGroup}
						>
							{countryGroups[countryGroupId].name}{' '}
							{currencies[countryGroups[countryGroupId].currency].extendedGlyph}
						</LinkItem>
					))}
					<button
						css={css`
							${visuallyHidden}
						`}
						onClick={() => {
							setMenuOpen(false);
						}}
					>
						Close
					</button>
				</Menu>
			</Dialog>
		</div>
	);
}

CountryGroupSwitcher.defaultProps = {
	trackProduct: null,
};

// ----- Exports ----- //

export default CountryGroupSwitcher;
