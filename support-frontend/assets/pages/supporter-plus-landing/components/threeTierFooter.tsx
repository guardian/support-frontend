import { css } from '@emotion/react';
import { cmp } from '@guardian/consent-manager';
import {
	from,
	palette,
	space,
	textSans12,
	textSans17,
	textSansBold20,
} from '@guardian/source/foundations';
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
import { getPlanCost } from 'pages/[countryGroupId]/helpers/getPlanCost';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import type { CardContent } from '../components/threeTierCard';
import { ThreeTierTsAndCs } from '../components/threeTierTsAndCs';
import { useRatePlanKey } from '../twoStepPages/useRatePlanKey';

const supportAnotherWay = css`
	margin: 20px 0;
	max-width: 940px;
	text-align: left;
	color: ${palette.neutral[100]};
	h4 {
		${textSansBold20};
	}
	p {
		${textSans17};
	}
	a {
		color: ${palette.neutral[100]};
	}
`;

const supportAnotherWayContainer = css`
	display: flex;
	background-color: #1e3e72;
`;

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
	console.log(
		'*** ThreeTierFooter props supportRegionId:',
		supportRegionId,
		'contributionType:',
		contributionType,
		'tier1Card:',
		tier1Card,
		'tier2Card:',
		tier2Card,
		'tier2Promotion:',
		tier2Promotion,
		'tier3Card:',
		tier3Card,
		'tier3Promotion:',
		tier3Promotion,
	);
	const { taxExclusionEnabled } = useRatePlanKey(
		contributionType,
		supportRegionId,
	);
	const { currencyKey, countryGroupId } =
		getSupportRegionIdConfig(supportRegionId);
	console.log(
		'*** ThreeTierFooter taxExclusionEnabled:',
		taxExclusionEnabled,
		'currencyKey:',
		currencyKey,
		'countryGroupId:',
		countryGroupId,
	);
	return (
		<>
			{countryGroupId === UnitedStates && (
				<Container
					sideBorders
					borderColor="rgba(170, 170, 180, 0.5)"
					cssOverrides={supportAnotherWayContainer}
				>
					<div css={supportAnotherWay}>
						<h4>Support another way</h4>
						<p>
							If you are interested in contributing through a donor-advised
							fund, foundation or retirement account, or by mailing a check,{' '}
							<br />
							please visit our{' '}
							<a href="https://help.theguardian.com/article/how-can-i-make-a-tax-deductible-contribution-us-only">
								help page
							</a>{' '}
							to learn how.
						</p>
					</div>
				</Container>
			)}
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
							planCost: getPlanCost(tier1Card.price, contributionType),
						},
						{
							title: tier2Card.title,
							planCost: getPlanCost(
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
							planCost: getPlanCost(
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
