/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { CountryCode } from '../../helpers/internationalisation';
import getProductPrices, { ProductPrices } from '../../helpers/getProductPrices';
import ProductOption from '../../../../components/product/productOption';
import withHydration from '../../../../utils/withHydration';

export type ProductOptionGroupProps = {
    productPrices: ProductPrices;
    countryId: CountryCode;
};

const productOverride = css`
    &:not(:first-of-type) {
        margin-top: ${space[4]}px;
    }
    ${from.tablet} {
        &:not(:first-of-type) {
            margin-top: 0;
        }
        &:not(:last-of-type) {
            margin-right: ${space[5]}px;
        }
    }
`;

const productOverrideWithLabel = css`
    &:not(:first-of-type) {
        margin-top: ${space[12]}px;
    }
    ${from.tablet} {
        &:not(:first-of-type) {
            margin-top: 0;
        }
        &:not(:last-of-type) {
            margin-right: ${space[5]}px;
        }
    }
`;

function ProductOptionGroup({
    productPrices,
    countryId,
}: ProductOptionGroupProps): React.ReactElement {
    const products = getProductPrices(productPrices, countryId);

    return (
        <React.Fragment>
            {products.map((product) => (
                <ProductOption
                    key={product.title}
                    cssOverrides={product.label ? productOverrideWithLabel : productOverride}
                    title={product.title}
                    price={product.price}
                    offerCopy={product.offerCopy}
                    priceCopy={product.priceCopy}
                    buttonCopy={product.buttonCopy}
                    href={product.href}
                    onClick={product.onClick}
                    onView={product.onView}
                    label={product.label}
                />
            ))}
        </React.Fragment>
    );
}

export default withHydration(ProductOptionGroup);
