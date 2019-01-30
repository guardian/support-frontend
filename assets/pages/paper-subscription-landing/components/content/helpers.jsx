// @flow

// ----- Imports ----- //

import React, { type Element, type Node } from 'react';

import { type Option } from 'helpers/types/option';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { SansParagraph } from 'components/productPage/productPageTextBlock/productPageTextBlock';
import ProductPageInfoChip from 'components/productPage/productPageInfoChip/productPageInfoChip';
import { paperSubsUrl } from 'helpers/routes';
import { flashSaleIsActive, getDiscount, getDuration } from 'helpers/flashSale';

import { type ActiveTabState } from '../../paperSubscriptionLandingPageReducer';
import { setTab } from '../../paperSubscriptionLandingPageActions';

import Form from '../form';


// Helper functions

function getPageInfoChip(): string {
  if (flashSaleIsActive('Paper', 'GBPCountries')) {
    return 'You can cancel your subscription at any time. Offer is for the first year. Standard subscription rates apply thereafter.';
  }
  return 'You can cancel your subscription at any time.';
}

const getSaleTitle = (): ?string => {

  if (!flashSaleIsActive('Paper', 'GBPCountries')) {
    return null;
  }

  const discount = getDiscount('Paper', 'GBPCountries');
  const duration = getDuration('Paper', 'GBPCountries');

  if (discount && duration) {
    return `Save an extra ${Math.round(discount * 100)}% for ${duration}`;
  } else if (discount) {
    return `Save an extra ${Math.round(discount * 100)}%`;
  }
  return null;

};


// ----- Auxiliary Components ----- //
const ContentHelpBlock = ({ faqLink, telephoneLink }: {faqLink: Element<string>, telephoneLink: Element<string>}) => (
  <ProductPageContentBlock type="feature" modifierClasses={['faqs']}>
    <ProductPageTextBlock title="FAQ and help">
      <SansParagraph>
      If you’ve got any more questions, you might well find the answers in the {faqLink}.
      </SansParagraph>
      <SansParagraph>
       If you can’t find the answer to your question here, please call our customer services team on {telephoneLink}.
      </SansParagraph>
    </ProductPageTextBlock>
  </ProductPageContentBlock>
);

const LinkTo = ({ setTabAction, tab, children }: {
  setTabAction: typeof setTab,
  tab: ActiveTabState,
  children: Node
}) => (
  <a
    href={paperSubsUrl(tab === 'delivery')}
    onClick={(ev) => {
      ev.preventDefault();
      setTabAction(tab);
    }}
  >
    {children}
  </a>
);

const ContentForm = ({
  title, text, setTabAction, selectedTab,
}: {
  title: string,
  text?: Option<string>,
  selectedTab: ActiveTabState,
  setTabAction: typeof setTab}) => (
    <ProductPageContentBlock type="feature" id="subscribe">
      <ProductPageTextBlock {...{ title }} callout={getSaleTitle()} />
      {text &&
      <ProductPageTextBlock>
        <p>{text}</p>
      </ProductPageTextBlock>
    }
      <Form />
      <ProductPageTextBlock>
        <SansParagraph>
          {
            selectedTab === 'collection'
            ? <LinkTo tab="delivery" setTabAction={setTabAction}>Switch to Delivery</LinkTo>
            : <LinkTo tab="collection" setTabAction={setTabAction}>Switch to Vouchers</LinkTo>
          }
        </SansParagraph>
      </ProductPageTextBlock>
      <ProductPageInfoChip>
        {getPageInfoChip()}
      </ProductPageInfoChip>
    </ProductPageContentBlock>
);
ContentForm.defaultProps = { text: null };

export { ContentHelpBlock, LinkTo, ContentForm };
