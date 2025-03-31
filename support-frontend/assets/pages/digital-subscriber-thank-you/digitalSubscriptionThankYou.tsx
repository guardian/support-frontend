import { css } from '@emotion/react';
import {
	between,
	from,
	neutral,
	space,
	sport,
} from '@guardian/source/foundations';
import { Column, Columns, LinkButton } from '@guardian/source/react-components';
import { FooterWithContents } from '@guardian/source-development-kitchen/react-components';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import { PageScaffold } from 'components/page/pageScaffold';
import type { ThankYouModuleType } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import { getThankYouModuleData } from 'components/thankYou/thankYouModuleData';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import { isSupporterPlusFromState } from 'helpers/redux/checkout/product/selectors/isSupporterPlus';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN } from 'helpers/thankYouPages/utils/ophan';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import ThankYouFooter from 'pages/supporter-plus-thank-you/components/thankYouFooter';
import ThankYouHeader from './components/thankYouHeader';

const checkoutContainer = css`
	background-color: ${neutral[100]};
	${from.tablet} {
		background-color: ${sport[800]};
	}
`;

const columnContainer = css`
	> *:not(:last-child) {
		${from.tablet} {
			margin-bottom: ${space[6]}px;
		}

		${from.desktop} {
			margin-bottom: ${space[5]}px;
		}
	}
`;

const firstColumnContainer = css`
	${between.tablet.and.desktop} {
		margin-bottom: ${space[6]}px;
	}
`;

const headerContainer = css`
	${from.desktop} {
		width: 60%;
	}
	${from.leftCol} {
		width: calc(50% - ${space[3]}px);
	}
`;

const buttonContainer = css`
	padding: ${space[12]}px 0;
`;

export function DigitalSubscriptionThankYou(): JSX.Element {
	const { countryId, countryGroupId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { csrf } = useContributionsSelector((state) => state.page.checkoutForm);
	const { firstName, email } = useContributionsSelector(
		(state) => state.page.checkoutForm.personalDetails,
	);
	const paymentMethod = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.paymentMethod.name,
	);

	const amountIsAboveThreshold = useContributionsSelector(
		isSupporterPlusFromState,
	);
	const { isSignedIn } = useContributionsSelector((state) => state.page.user);
	const thankYouModuleData = getThankYouModuleData(
		'DigitalSubscription',
		countryGroupId,
		countryId,
		csrf,
		false,
		amountIsAboveThreshold,
		'',
		email,
	);

	const maybeThankYouModule = (
		condtion: boolean,
		moduleType: ThankYouModuleType,
	): ThankYouModuleType[] => (condtion ? [moduleType] : []);

	const thankYouModules: ThankYouModuleType[] = [
		...maybeThankYouModule(!isSignedIn && email.length > 0, 'signIn'),
		'appDownloadEditions',
		...maybeThankYouModule(countryId === 'AU', 'ausMap'),
		'socialShare',
	];

	const numberOfModulesInFirstColumn = thankYouModules.length === 3 ? 1 : 2;
	const firstColumn = thankYouModules.slice(0, numberOfModulesInFirstColumn);
	const secondColumn = thankYouModules.slice(numberOfModulesInFirstColumn);

	return (
		<PageScaffold
			header={<Header />}
			footer={
				<FooterWithContents>
					<ThankYouFooter />
				</FooterWithContents>
			}
		>
			<div css={checkoutContainer}>
				<Container>
					<div css={headerContainer}>
						<ThankYouHeader
							name={firstName}
							showDirectDebitMessage={paymentMethod === DirectDebit}
						/>
					</div>

					<Columns collapseUntil="desktop">
						<Column cssOverrides={[columnContainer, firstColumnContainer]}>
							{firstColumn.map((moduleType) => (
								<ThankYouModule
									moduleType={moduleType}
									isSignedIn={isSignedIn}
									{...thankYouModuleData[moduleType]}
								/>
							))}
						</Column>
						<Column cssOverrides={columnContainer}>
							{secondColumn.map((moduleType) => (
								<ThankYouModule
									moduleType={moduleType}
									isSignedIn={isSignedIn}
									{...thankYouModuleData[moduleType]}
								/>
							))}
						</Column>
					</Columns>

					<div css={buttonContainer}>
						<LinkButton
							href="https://www.theguardian.com"
							priority="tertiary"
							onClick={() =>
								trackComponentClick(OPHAN_COMPONENT_ID_RETURN_TO_GUARDIAN)
							}
						>
							Return to the Guardian
						</LinkButton>
					</div>
				</Container>
			</div>
		</PageScaffold>
	);
}
