import type { SerializedStyles } from '@emotion/react';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getPatronsLink } from 'helpers/urls/externalLinks';
import { routes } from 'helpers/urls/routes';
import {
	linksList,
	linksListItem,
	linksListItemActive,
	linksListItemNavigate,
	linksListItemTabletDisplay,
	linksNav,
} from './linksStyles';

// types
type HeaderNavLink = {
	href: string;
	text: string;
	trackAs: string;
	internal: boolean;
	opensInNewWindow?: boolean;
	include?: SupportRegionId[];
	exclude?: SupportRegionId[];
	additionalStyles?: SerializedStyles;
};

type PropTypes = {
	location: 'desktop' | 'mobile';
	supportRegionId?: SupportRegionId;
	getRef?: (element: Element | null) => void;
	cssOverride?: SerializedStyles;
};

const links: HeaderNavLink[] = [
	{
		href: routes.recurringContribCheckout,
		text: 'Contributions',
		trackAs: 'contributions',
		additionalStyles: linksListItemTabletDisplay,
		internal: true,
	},
	{
		href: routes.subscriptionsLanding,
		text: 'Subscriptions',
		trackAs: 'subscriptions',
		internal: true,
	},
	{
		href: routes.digitalSubscriptionLanding,
		text: 'Digital',
		trackAs: 'subscriptions:digital',
		internal: true,
	},
	{
		href: routes.paperSubscriptionLanding,
		text: 'Newspaper',
		trackAs: 'subscriptions:paper',
		include: ['uk'],
		internal: true,
	},
	{
		href: routes.guardianWeeklySubscriptionLanding,
		text: 'Guardian Weekly',
		trackAs: 'subscriptions:guardianweekly',
		internal: true,
	},
	{
		href: getPatronsLink('support-header'),
		text: 'Patrons',
		trackAs: 'patrons',
		opensInNewWindow: true,
		exclude: ['au', 'nz', 'us'],
		internal: false,
	},
];

function internationalisationID(
	supportRegionId?: SupportRegionId,
): string | null {
	if (supportRegionId != null) {
		return supportRegionId;
	}

	return null;
}

function isActiveLink(urlWithoutParams: string, href: string): boolean {
	return (
		urlWithoutParams.endsWith(href) ||
		urlWithoutParams.endsWith(`${href}/delivery`)
	);
}

// Export
function Links({
	location,
	getRef,
	supportRegionId,
	cssOverride,
}: PropTypes): JSX.Element {
	const { protocol, host, pathname } = window.location;
	const urlWithoutParams = `${protocol}//${host}${pathname}`;
	const internationalisationIDValue = internationalisationID(supportRegionId);
	const isNotUk = internationalisationIDValue !== 'uk';
	return (
		<nav css={[linksNav, cssOverride]}>
			<ul css={linksList} ref={getRef}>
				{links
					.filter(({ text }) => {
						if (
							text === 'Digital' ||
							text === 'Support' ||
							text === 'Contributions' ||
							(text === 'Newspaper' && isNotUk) ||
							(text === 'Subscriptions' && isNotUk)
						) {
							return false;
						}
						return true;
					})
					.filter(({ include, exclude }) => {
						// If there is no country group ID for the link, return true and include the link in the rendering.
						if (!supportRegionId) {
							return true;
						}

						// If the link is not meant to be included for a specific SupportRegionId, do not include in array.
						if (include && !include.includes(supportRegionId)) {
							return false;
						}

						// If the link is meant to be excluded for a specific SupportRegionId, exclude from array.
						if (exclude?.includes(supportRegionId)) {
							return false;
						}

						// Otherwise return true.
						return true;
					})
					.map((link) => {
						if (internationalisationIDValue == null || !link.internal) {
							return link;
						}

						return {
							...link,
							href: `/${internationalisationIDValue}${link.href}`,
						};
					})
					.map(
						({ href, text, trackAs, opensInNewWindow, additionalStyles }) => (
							<li
								css={[
									linksListItem,
									isActiveLink(urlWithoutParams, href) && linksListItemActive,
									additionalStyles,
								]}
							>
								<a
									onClick={sendTrackingEventsOnClick({
										id: ['header-link', trackAs, location].join(' - '),
										componentType: 'ACQUISITIONS_OTHER',
									})}
									css={linksListItemNavigate}
									href={href}
									target={opensInNewWindow ? '_blank' : ''}
								>
									{text}
								</a>
							</li>
						),
					)}
			</ul>
		</nav>
	);
}

Links.defaultProps = {
	getRef: null,
};

export default Links;
