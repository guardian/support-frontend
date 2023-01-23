import cx from 'classnames';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	AUDCountries,
	countryGroups,
	GBPCountries,
	NZDCountries,
} from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { getPatronsLink } from 'helpers/urls/externalLinks';
import { routes } from 'helpers/urls/routes';
import { classNameWithModifiers } from 'helpers/utilities/utilities';

// types
type HeaderNavLink = {
	href: string;
	text: string;
	trackAs: string;
	internal: boolean;
	opensInNewWindow?: boolean;
	include?: CountryGroupId[];
	exclude?: CountryGroupId[];
	additionalClasses?: string;
};

type PropTypes = {
	location: 'desktop' | 'mobile';
	countryGroupId?: CountryGroupId;
	getRef?: (element: Element | null) => void;
	hideDigiSub?: boolean;
};

const links: HeaderNavLink[] = [
	{
		href: routes.recurringContribCheckout,
		text: 'Contributions',
		trackAs: 'contributions',
		additionalClasses: 'component-header-links__li--show-on-tablet',
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
		include: [GBPCountries],
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
		exclude: [AUDCountries, NZDCountries],
		internal: false,
	},
];

function internationalisationID(
	countryGroupId?: CountryGroupId,
): string | null {
	if (countryGroupId != null) {
		const group = countryGroups[countryGroupId];
		return group.supportInternationalisationId;
	}

	return null;
}

function getActiveLinkClassModifiers(
	urlWithoutParams: string,
	href: string,
): string | null {
	if (
		urlWithoutParams.endsWith(href) ||
		urlWithoutParams.endsWith(`${href}/delivery`)
	) {
		return 'active';
	}
	return null;
}

// Export
function Links({
	location,
	getRef,
	countryGroupId,
	hideDigiSub,
}: PropTypes): JSX.Element {
	const { protocol, host, pathname } = window.location;
	const urlWithoutParams = `${protocol}//${host}${pathname}`;
	const internationalisationIDValue = internationalisationID(countryGroupId);
	const isNotUk = internationalisationIDValue !== 'uk';
	return (
		<nav
			className={classNameWithModifiers('component-header-links', [location])}
		>
			<ul className="component-header-links__ul" ref={getRef}>
				{links
					.filter(({ text }) => {
						if (
							text === 'Digital' ||
							text === 'Support' ||
							text === 'Contributions' ||
							(text === 'Newspaper' && isNotUk) ||
							(text === 'Subscriptions' && isNotUk)
						) {
							if (hideDigiSub) {
								return false;
							}
						}
						return true;
					})
					.filter(({ include, exclude }) => {
						// If there is no country group ID for the link, return true and include the link in the rendering.
						if (!countryGroupId) {
							return true;
						}

						// If the link is not meant to be included for a specific CountryGroupID, do not include in array.
						if (include && !include.includes(countryGroupId)) {
							return false;
						}

						// If the link is meant to be excluded for a specific CountryGroupID, exclude from array.
						if (exclude?.includes(countryGroupId)) {
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
						({ href, text, trackAs, opensInNewWindow, additionalClasses }) => (
							<li
								className={cx(
									classNameWithModifiers('component-header-links__li', [
										getActiveLinkClassModifiers(urlWithoutParams, href),
									]),
									additionalClasses,
								)}
							>
								<a
									onClick={sendTrackingEventsOnClick({
										id: ['header-link', trackAs, location].join(' - '),
										componentType: 'ACQUISITIONS_OTHER',
									})}
									className="component-header-links__link"
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
