import cx from 'classnames';
import type { Option } from 'helpers/types/option';
import 'helpers/types/option';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	countryGroups,
	GBPCountries,
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
	additionalClasses?: string;
};
type PropTypes = {
	location: 'desktop' | 'mobile';
	countryGroupId: CountryGroupId | null | undefined;
	getRef: Option<(arg0: Element | null | undefined) => void>;
};
const links: HeaderNavLink[] = [
	{
		href: routes.showcase,
		text: 'Support',
		trackAs: 'showcase',
		internal: true,
	},
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
		internal: false,
	},
];

function internationalisationID(
	countryGroupId: CountryGroupId | null | undefined = null,
): string | null | undefined {
	if (countryGroupId != null) {
		const group = countryGroups[countryGroupId];
		return group ? group.supportInternationalisationId : null;
	}

	return null;
}

// Export
const Links = ({ location, getRef, countryGroupId }: PropTypes) => {
	const { protocol, host, pathname } = window.location;
	const urlWithoutParams = `${protocol}//${host}${pathname}`;
	return (
		<nav
			className={classNameWithModifiers('component-header-links', [location])}
		>
			<ul className="component-header-links__ul" ref={getRef}>
				{links
					.filter(({ include }) => {
						// If there is no country group ID for the link, return true and include the link in the rendering.
						if (!countryGroupId) {
							return true;
						}

						// If the link is not meant to be rendered for a specific CountryGroupID, do not include.
						if (include && !include.includes(countryGroupId)) {
							return false;
						}

						// Otherwise return true.
						return true;
					})
					.map((link) => {
						const internationalisationIDValue =
							internationalisationID(countryGroupId);

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
										urlWithoutParams.endsWith(href) ? 'active' : null,
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
									target={opensInNewWindow ? '_blank' : null}
								>
									{text}
								</a>
							</li>
						),
					)}
			</ul>
		</nav>
	);
};

Links.defaultProps = {
	getRef: null,
};
export default Links;
