import { css } from '@emotion/react';
import {
	headline,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import type { ListItemText } from 'components/list/list';
import { ListWithSubText } from 'components/list/list';

const container = css`
	&:not(:last-of-type) {
		border-bottom: 1px solid ${neutral[86]};
	}
`;
const title = css`
	${headline.xsmall({
		fontWeight: 'bold',
	})};
	background-color: ${neutral[97]};
	padding: ${space[2]}px;
`;
const list = css`
	padding-top: ${space[2]}px;
	padding-left: ${space[2]}px;
	${textSans.medium()};
`;
type OrderSummaryProductProps = {
	productName: string;
	productInfo: ListItemText[];
};

function OrderSummaryProduct(props: OrderSummaryProductProps): JSX.Element {
	return (
		<div css={container}>
			<h4 css={title}>{props.productName}</h4>
			<ListWithSubText
				cssOverrides={list}
				items={props.productInfo}
				bulletSize="small"
				bulletColour="dark"
			/>
		</div>
	);
}

export default OrderSummaryProduct;
