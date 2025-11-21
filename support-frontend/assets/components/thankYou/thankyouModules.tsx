import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';
import type { ThankYouModuleType } from 'components/thankYou/thankYouModule';
import ThankYouModule from 'components/thankYou/thankYouModule';
import type { ThankYouModuleData } from 'components/thankYou/thankYouModuleData';

type ThankYouModulesProps = {
	isSignedIn: boolean;
	thankYouModules: ThankYouModuleType[];
	thankYouModulesData: Record<ThankYouModuleType, ThankYouModuleData>;
};

const mansory = css`
	column-count: 1;
	column-gap: ${space[4]}px;
	margin-top: ${space[4]}px;

	${from.desktop} {
		column-count: 2;
	}
`;

function ThankYouModules({
	isSignedIn = false,
	thankYouModules,
	thankYouModulesData,
}: ThankYouModulesProps) {
	return (
		<div css={mansory} data-testid="thankyou-modules">
			{thankYouModules.map((moduleType) => (
				<ThankYouModule
					key={moduleType}
					moduleType={moduleType}
					isSignedIn={isSignedIn}
					{...thankYouModulesData[moduleType]}
				/>
			))}
		</div>
	);
}

export default ThankYouModules;
