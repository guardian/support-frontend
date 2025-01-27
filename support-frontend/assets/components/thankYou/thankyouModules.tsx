import { css } from '@emotion/react';
import { between, from, space } from '@guardian/source/foundations';
import { Column, Columns } from '@guardian/source/react-components';
import type { ThankYouModuleType } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import type { ThankYouModuleData } from 'components/thankYou/thankYouModuleData';

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

interface ThankYouModulesProps {
	isSignedIn: boolean;
	showNewspaperArchiveBenefit: boolean;
	thankYouModules: ThankYouModuleType[];
	thankYouModulesData: Record<ThankYouModuleType, ThankYouModuleData>;
}

export function ThankYouModules({
	isSignedIn = false,
	showNewspaperArchiveBenefit = false,
	thankYouModules,
	thankYouModulesData,
}: ThankYouModulesProps): JSX.Element {
	const maxModules = showNewspaperArchiveBenefit ? 5 : 6;
	const numberOfModulesInFirstColumn =
		thankYouModules.length >= maxModules ? 3 : 2;
	const firstColumn = thankYouModules.slice(0, numberOfModulesInFirstColumn);
	const secondColumn = thankYouModules.slice(numberOfModulesInFirstColumn);

	return (
		<>
			<Columns collapseUntil="desktop">
				<Column cssOverrides={[columnContainer, firstColumnContainer]}>
					{firstColumn.map((moduleType) => (
						<ThankYouModule
							moduleType={moduleType}
							isSignedIn={isSignedIn}
							{...thankYouModulesData[moduleType]}
						/>
					))}
				</Column>
				<Column cssOverrides={columnContainer}>
					{secondColumn.map((moduleType) => (
						<ThankYouModule
							moduleType={moduleType}
							isSignedIn={isSignedIn}
							{...thankYouModulesData[moduleType]}
						/>
					))}
				</Column>
			</Columns>
		</>
	);
}
