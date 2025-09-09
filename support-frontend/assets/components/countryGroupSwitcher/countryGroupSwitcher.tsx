import { css } from '@emotion/react';
import {
	palette,
	textSans17,
	visuallyHidden,
} from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { countryGroups } from '@modules/internationalisation/countryGroup';
import { useRef, useState } from 'react';
import Dialog from 'components/dialog/dialog';
import Menu, { LinkItem } from 'components/menu/menu';
import SvgDropdownArrow from 'components/svgs/dropdownArrow';
import { clearParticipationsFromSession } from 'helpers/abTests/sessionStorage';
import { currencies } from 'helpers/internationalisation/currency';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';

const countryGroupSwitcherButton = css`
	appearance: none;
	border: 0;
	padding: 0;
	color: inherit;
	cursor: pointer;
	color: ${palette.neutral[100]};
	${textSans17};

	svg {
		position: absolute;
		margin-top: 0.3125rem;
		margin-left: 0.3125rem;
		path {
			fill: currentColor;
		}
	}

	&:hover {
		color: ${palette.brandAlt[400]};
	}
`;

export type CountryGroupSwitcherProps = {
	countryGroupIds: CountryGroupId[];
	selectedCountryGroup: CountryGroupId;
	trackProduct?: Option<SubscriptionProduct>;
	subPath: string;
};

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
		<div
			css={css`
				display: inline-flex;
			`}
		>
			<button
				aria-label="Select a country"
				css={countryGroupSwitcherButton}
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
						top: bounds.top + 30,
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

								if (countryGroupId !== selectedCountryGroup) {
									clearParticipationsFromSession();
								}
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

export default CountryGroupSwitcher;
