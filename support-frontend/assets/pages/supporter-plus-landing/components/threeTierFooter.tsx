import { css } from '@emotion/react';
import { cmp } from '@guardian/consent-manager';
import { from, palette, space, textSans12 } from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { UnitedStates } from '@modules/internationalisation/countryGroup';
import type { ContributionType } from 'helpers/contributions';
import { glyph } from 'helpers/internationalisation/currency';
import { guardianContactUsLink, guardianHelpCentreLink } from 'helpers/legal';
import type { Promotion } from 'helpers/productPrice/promotions';
import CurrentMaxRatesByCountry from 'pages/[countryGroupId]/helpers/CurrentMaxRatesByCountry';
import { getTierPlanCost } from 'pages/[countryGroupId]/helpers/getTierPlanCost';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import type { CardContent } from '../components/threeTierCard';
import { ThreeTierTsAndCs } from '../components/threeTierTsAndCs';
import { useRatePlanKey } from '../twoStepPages/useRatePlanKey';
import { USSupportAnotherWay } from './usSupportAnotherWay';

const disclaimerContainer = css`
	background-color: ${palette.brand[400]};
	> div {
		border-bottom: 1px solid ${palette.brand[600]};
		padding: ${space[4]}px 10px;
	}
	${from.mobileLandscape} {
		> div {
			padding: ${space[5]}px ${space[5]}px;
		}
	}
`;

const taxExclusionDisclaimer = css`
	${textSans12};
	color: ${palette.neutral[100]};
	margin-bottom: ${space[2]}px;
`;

const links = [
	{
		href: 'https://www.theguardian.com/info/privacy',
		text: 'Privacy policy',
		isExternal: true,
	},
	{
		text: 'Privacy settings',
		onClick: () => {
			cmp.showPrivacyManager();
		},
	},
	{
		href: guardianContactUsLink,
		text: 'Contact us',
		isExternal: true,
	},
	{
		href: guardianHelpCentreLink,
		text: 'Help centre',
		isExternal: true,
	},
];

interface ThreeTierFooterProps {
	supportRegionId: SupportRegionId;
	contributionType: ContributionType;
	tier1Card: CardContent;
	tier2Card: CardContent;
	tier2Promotion?: Promotion;
	tier3Card: CardContent;
	tier3Promotion?: Promotion;
}

export function ThreeTierFooter({
	supportRegionId,
	contributionType,
	tier1Card,
	tier2Card,
	tier2Promotion,
	tier3Card,
	tier3Promotion,
}: ThreeTierFooterProps): JSX.Element {
	const { taxExclusionEnabled } = useRatePlanKey(
		contributionType,
		supportRegionId,
	);
	const { currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
	return (
		<>
			{countryGroupId === UnitedStates && <USSupportAnotherWay />}
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={disclaimerContainer}
			>
				<CurrentMaxRatesByCountry countryGroupId={countryGroupId} />
				{taxExclusionEnabled && (
					<p css={taxExclusionDisclaimer}>
						For All-access digital and Digital plus, taxes may apply.
					</p>
				)}
				<ThreeTierTsAndCs
					tsAndCsContent={[
						{
							title: tier1Card.title,
							planCost: getTierPlanCost(tier1Card.price, contributionType),
						},
						{
							title: tier2Card.title,
							planCost: getTierPlanCost(
								tier2Card.price,
								contributionType,
								tier2Promotion,
							),
							starts: tier2Promotion?.starts
								? new Date(tier2Promotion.starts)
								: undefined,
							expires: tier2Promotion?.expires
								? new Date(tier2Promotion.expires)
								: undefined,
						},
						{
							title: tier3Card.title,
							planCost: getTierPlanCost(
								tier3Card.price,
								contributionType,
								tier3Promotion,
							),
							starts: tier3Promotion?.starts
								? new Date(tier3Promotion.starts)
								: undefined,
							expires: tier3Promotion?.expires
								? new Date(tier3Promotion.expires)
								: undefined,
						},
					]}
					currency={glyph(currencyKey)}
				></ThreeTierTsAndCs>
			</Container>
			<FooterWithContents>
				<FooterLinks links={links}></FooterLinks>
			</FooterWithContents>
		</>
	);
}
