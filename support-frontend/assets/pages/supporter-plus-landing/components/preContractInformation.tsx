import { css } from '@emotion/react';
import {
	brand,
	neutral,
	space,
	textSans15,
} from '@guardian/source/foundations';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { CancellationPolicy } from './cancellationPolicy';
import { PriceRisePolicy } from './priceRisePolicy';
import { RenewalTermPolicy } from './renewalTermPolicy';

const containerSummaryTsCs = css`
	margin-top: ${space[5]}px;
	border-radius: ${space[2]}px;
	background-color: ${neutral[97]};
	padding: ${space[2]}px ${space[3]}px;
	& p {
		${textSans15};
		color: ${neutral[7]};
	}
	p:first-child {
		margin-top: 0;
	} // dependent on product and rateplan this could be renewal terms or cancellation
	p:not(:first-child) {
		margin-top: ${space[2]}px;
	}
	& a {
		color: ${brand[500]};
	}
`;

interface PreContractInformationProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	amount: number;
	promotion?: Promotion;
}
export function PreContractInformation({
	productKey,
	ratePlanKey,
	amount,
	promotion,
}: PreContractInformationProps): JSX.Element {
	return (
		<div css={containerSummaryTsCs}>
			<RenewalTermPolicy
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				amount={amount}
				promotion={promotion}
			/>
			<CancellationPolicy
				productKey={productKey}
				ratePlanKey={ratePlanKey}
				promotion={promotion}
			/>
			<PriceRisePolicy productKey={productKey} ratePlanKey={ratePlanKey} />
		</div>
	);
}
