/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import { space } from '@guardian/src-foundations';
import { from } from '@guardian/src-foundations/mq';
import { LocalisedProductPriceType } from '../../helpers/getProductPrices';
import ProductOption, { Product } from '../../../../components/product/productOption';
import withHydration from '../../../../utils/withHydration';

export type ProductOptionGroupProps = {
    localisedProducts: LocalisedProductPriceType[];
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

function addEventListeners(localisedProducts: LocalisedProductPriceType[]): Product[] {
    return localisedProducts.map((product) => {
        const trackingProperties = {
            id: `subscribe_now_cta-${product.billingPeriod}`,
            product: product.product,
            componentType: 'ACQUISITIONS_BUTTON',
        };
        return {
            ...product,
            onClick: () => alert(`Sending tracking data: ${JSON.stringify(trackingProperties)}`),
            onView: () => undefined,
        };
    });
}

function ProductOptionGroup({ localisedProducts }: ProductOptionGroupProps): React.ReactElement {
    const products = addEventListeners(localisedProducts);

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
