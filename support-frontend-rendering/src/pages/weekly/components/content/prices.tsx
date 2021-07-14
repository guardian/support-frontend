/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { body, headline } from '@guardian/src-foundations/typography';
import { from } from '@guardian/src-foundations/mq';
import { SvgInfo } from '@guardian/src-icons';
import ProductOptionGroup from './productOptionGroup';
import { CountryCode } from '../../helpers/internationalisation';
import { ProductPrices } from '../../helpers/getProductPrices';
import ProductInfoChip from '../../../../components/product/productInfoChip';
import SvgGift from '../../../../components/svgs/gift';
import FlexContainer from '../../../../components/containers/flexContainer';

export type WeeklyPricesProps = {
    productPrices: ProductPrices;
    countryId: CountryCode;
};

const priceBoxes = css`
    margin-top: ${space[6]}px;
    justify-content: flex-start;
    align-items: stretch;
    ${from.desktop} {
        margin-top: ${space[9]}px;
    }
`;

const pricesSection = css`
    padding: 0 ${space[3]}px ${space[12]}px;
`;

const pricesHeadline = css`
    ${headline.medium({ fontWeight: 'bold' })};
`;

const pricesSubHeadline = css`
    ${body.medium()}
    padding-bottom: ${space[2]}px;
`;

const pricesInfo = css`
    margin-top: ${space[6]}px;
`;

function Prices({ productPrices, countryId }: WeeklyPricesProps): React.ReactElement {
    return (
        <section css={pricesSection} id="subscribe">
            <h2 css={pricesHeadline}>Subscribe to the Guardian Weekly today</h2>
            <p css={pricesSubHeadline}>Choose how you&apos;d like to pay</p>
            <FlexContainer cssOverrides={priceBoxes}>
                <ProductOptionGroup productPrices={productPrices} countryId={countryId} />
            </FlexContainer>
            <div css={pricesInfo}>
                <ProductInfoChip icon={<SvgGift />}>Gifting is available</ProductInfoChip>
                <ProductInfoChip icon={<SvgInfo />}>
                    Delivery cost included You can cancel your subscription at any time.
                </ProductInfoChip>
            </div>
        </section>
    );
}

export default Prices;
