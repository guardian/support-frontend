import { css } from '@emotion/react';
import { cmp } from '@guardian/consent-manager';
import { getLocale } from '@guardian/libs';
import { from, palette, space, textSans12 } from '@guardian/source/foundations';
import { Container } from '@guardian/source/react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-development-kitchen/react-components';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { UnitedStates } from '@modules/internationalisation/countryGroup';
import { useEffect, useState } from 'react';
import { guardianContactUsLink, guardianHelpCentreLink } from 'helpers/legal';
import CurrentMaxRatesByCountry from 'pages/[countryGroupId]/helpers/CurrentMaxRatesByCountry';
import { getSupportRegionIdConfig } from '../../supportRegionConfig';
import { ThreeTierTsAndCs } from '../components/threeTierTsAndCs';
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

interface ThreeTierFooterProps {
	supportRegionId: SupportRegionId;
	showTaxDisclaimer: boolean;
}

export function ThreeTierFooter({
	supportRegionId,
	showTaxDisclaimer,
}: ThreeTierFooterProps): JSX.Element {
	const [localeCode, setLocaleCode] = useState<string | null>(null);

	useEffect(() => {
		const updateLocale = async () => {
			const locale = await getLocale();
			setLocaleCode(locale);
		};
		void updateLocale();
	}, []);
	const { countryGroupId } = getSupportRegionIdConfig(supportRegionId);

	const links = [
		{
			href: 'https://www.theguardian.com/info/privacy',
			text: 'Privacy policy',
			isExternal: true,
		},
		{
			text:
				localeCode === 'US'
					? 'Do not sell or share my personal information'
					: 'Privacy settings',
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
	return (
		<>
			{countryGroupId === UnitedStates && <USSupportAnotherWay />}
			<Container
				sideBorders
				borderColor="rgba(170, 170, 180, 0.5)"
				cssOverrides={disclaimerContainer}
			>
				<CurrentMaxRatesByCountry countryGroupId={countryGroupId} />
				{showTaxDisclaimer && (
					<p css={taxExclusionDisclaimer}>
						For All-access digital and Digital plus, taxes may apply.
					</p>
				)}
				<ThreeTierTsAndCs />
			</Container>
			<FooterWithContents>
				<FooterLinks links={links}></FooterLinks>
			</FooterWithContents>
		</>
	);
}
