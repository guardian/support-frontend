import { css } from '@emotion/react';
import {
	palette,
	textSans17,
	visuallyHidden,
} from '@guardian/source/foundations';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { supportRegions } from '@modules/internationalisation/supportRegion';
import { useRef, useState } from 'react';
import Dialog from 'components/dialog/dialog';
import Menu, { LinkItem } from 'components/menu/menu';
import SvgDropdownArrow from 'components/svgs/dropdownArrow';
import { clearParticipationsFromSession } from 'helpers/abTests/sessionStorage';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { Option } from 'helpers/types/option';

const supportRegionSwitcherButton = css`
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

export type SupportRegionSwitcherProps = {
	supportRegionIds: SupportRegionId[];
	selectedSupportRegion: SupportRegionId;
	trackProduct?: Option<SubscriptionProduct>;
	subPath: string;
};

function SupportRegionSwitcher({
	subPath,
	selectedSupportRegion,
	supportRegionIds,
	trackProduct,
}: SupportRegionSwitcherProps): JSX.Element {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [bounds, setBounds] = useState({
		top: 0,
		left: 0,
	});

	function onSupportRegionSelect(supportRegionId: SupportRegionId): void {
		sendTrackingEventsOnClick({
			id: `toggle_country_${supportRegionId}`,
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
				css={supportRegionSwitcherButton}
				ref={buttonRef}
				onClick={() => {
					if (buttonRef.current) {
						setBounds(buttonRef.current.getBoundingClientRect());
					}

					setMenuOpen(true);
				}}
			>
				{supportRegions[selectedSupportRegion].name}{' '}
				<strong>
					{supportRegions[selectedSupportRegion].currency.extendedGlyph}
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
					{supportRegionIds.map((supportRegionId: SupportRegionId) => (
						<LinkItem
							href={`/${supportRegionId}${subPath}${window.location.search}`}
							onClick={() => {
								sendTrackingEventsOnClick({
									id: `toggle_country: ${supportRegionId}`,
									componentType: 'ACQUISITIONS_BUTTON',
								})();

								onSupportRegionSelect(supportRegionId);

								if (supportRegionId !== selectedSupportRegion) {
									clearParticipationsFromSession();
								}
							}}
							isSelected={supportRegionId === selectedSupportRegion}
						>
							{supportRegions[supportRegionId].name}{' '}
							{supportRegions[supportRegionId].currency.extendedGlyph}
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

SupportRegionSwitcher.defaultProps = {
	trackProduct: null,
};

export default SupportRegionSwitcher;
