import React from 'react';
import GridImage from 'components/gridImage/gridImage';
import * as styles from 'pages/subscriptions-redemption/components/productSummary/productSummaryStyles';

const Dot = () => <div css={styles.dot} />;

function ProductSummary() {
	return (
		<aside css={styles.wrapper}>
			<div css={styles.contentBlock}>
				<div css={styles.imageContainer}>
					<GridImage
						gridId="editionsPackshotShort"
						srcSizes={[1000, 500]}
						sizes="(max-width: 740px) 50vw, 500"
						imgType="png"
						altText=""
					/>
				</div>
				<div css={styles.textBlock}>
					<h3 css={styles.fromTablet}>
						What&apos;s included in my Digital Subscription?
					</h3>
					<h3 css={styles.untilTablet}>
						What&apos;s included in my subscription?
					</h3>
				</div>
			</div>
			<div>
				<ul css={styles.list}>
					<li>
						<Dot />
						<div css={styles.listMain}>The Guardian Editions app</div>
						<span css={styles.subText}>
							Access the UK Daily, Australia Weekend and other special editions.
							Read offline and ad-free across multiple devices
						</span>
					</li>
					<li>
						<Dot />
						<div css={styles.listMain}>
							Premium access to the Guardian Live app
						</div>
						<span css={styles.subText}>Live news, as it happens</span>
					</li>
					<li>
						<Dot />
						<div css={styles.listMain}>Ad-free web</div>
						<span css={styles.subText}>
							Enjoy an ad-free experience across all of your devices when
							you&apos;re signed in on your apps and theguardian.com
						</span>
					</li>
				</ul>
			</div>
		</aside>
	);
}

export default ProductSummary;
