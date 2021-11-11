import React from 'react';
import { connect } from 'react-redux';
import { getGiftOrderSummaryText } from '../helpers';
import mapStateToProps from './endSummarySelector';
import * as styles from './endSummaryStyles';

export type EndSummaryProps = {
	priceDescription: string;
	promotion: string;
	orderIsAGift: boolean;
	digitalGiftBillingPeriod: 'Annual' | 'Quarterly';
	price: string;
	isPatron: boolean;
};

function Dot() {
	return <div css={styles.dot} />;
}

function EndSummary({
	promotion,
	priceDescription,
	orderIsAGift = false,
	digitalGiftBillingPeriod,
	price,
	isPatron = false,
}: EndSummaryProps) {
	const giftText = getGiftOrderSummaryText(digitalGiftBillingPeriod, price);
	return (
		<span>
			{orderIsAGift ? (
				<GiftSummary giftText={giftText} />
			) : (
				<NonGiftSummary
					promotion={promotion}
					priceDescription={priceDescription}
					isPatron={isPatron}
				/>
			)}
		</span>
	);
}

type GiftSummaryTypes = {
	giftText: {
		period: string;
		cost: string;
	};
};

function GiftSummary(props: GiftSummaryTypes) {
	return (
		<ul css={styles.list}>
			<li>
				<Dot />
				<div css={styles.listMain}>{props.giftText.period}</div>
				<span css={styles.subText}>{props.giftText.cost}</span>
			</li>
			<li>
				<Dot />
				<div css={styles.listMain}>Personalised gift message</div>
				<span css={styles.subText}>
					Your gift recipient will receive their gift on your chosen date which
					will include a personalised message
				</span>
			</li>
			<li>
				<Dot />
				<div css={styles.listMain}>Activating your gift subscription</div>
				<span css={styles.subText}>
					A gift redemption link with instructions will be emailed to you and
					the gift recipient
				</span>
			</li>
		</ul>
	);
}

type NonGiftSummaryTypes = {
	priceDescription: string;
	promotion: string;
	isPatron: boolean;
};

function NonGiftSummary(props: NonGiftSummaryTypes) {
	return (
		<ul css={styles.list}>
			<li>
				<Dot />
				<div css={styles.listMain}>{props.promotion}</div>
				<span css={styles.subText}>{props.priceDescription}</span>
			</li>
			{props.isPatron && (
				<>
					<li>
						<Dot />
						<div css={styles.listMain}>14-day free trial</div>
						<span css={styles.subText}>
							Your first payment will occur after the trial ends
						</span>
					</li>
					<li>
						<Dot />
						<div css={styles.listMain}>You can cancel any time</div>
					</li>
				</>
			)}
		</ul>
	);
}

export default connect(mapStateToProps)(EndSummary);
