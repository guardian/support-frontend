// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgSubscribe from 'components/svgs/subscribe';
import SvgSubscribed from 'components/svgs/subscribed';
import SvgNewsletters from 'components/svgs/newsletters';
import type { Dispatch } from 'redux';
import type { Action } from '../../../helpers/user/userActions';
import type { Csrf as CsrfState } from '../../../helpers/csrf/csrfReducer';
import { sendMarketingPreferencesToIdentity } from '../../../components/marketingConsent/helpers';

// ----- Types ----- //

type PropTypes = {
  confirmOptIn: ?boolean,
  email: string,
  csrf: CsrfState,
  onClick: (?string, CsrfState) => void,
};

const mapStateToProps = state => ({
  confirmOptIn: state.page.marketingConsent.confirmOptIn,
  email: state.page.form.formData.email,
  csrf: state.page.csrf,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onClick: (email: string, csrf: CsrfState) => {
      sendMarketingPreferencesToIdentity(
        true,
        email,
        dispatch,
        csrf,
        'MARKETING_CONSENT',
      );
    },
  };
}

// ----- Render ----- //

function MarketingConsent(props: PropTypes) {
  return (
    <section className={classNameWithModifiers('confirmation', ['newsletter'])}>
      <h3 className="confirmation__title">Subscriptions, membership and contributions</h3>
      <p>
        Get related news and offers – whether you are a subscriber, member,
        contributor or would like to become one.
      </p>

      {props.confirmOptIn === null ?
        <button
          className={classNameWithModifiers('button', ['newsletter'])}
          onClick={
            () => props.onClick(props.email, props.csrf)
          }
        >
          <SvgSubscribe />
          Sign me up
        </button> :
        <button disabled="disabled" className={classNameWithModifiers('button', ['newsletter', 'newsletter__subscribed'])}>
          <SvgSubscribed />
          Signed up
        </button>
      }

      <p className="confirmation__meta"><small>You can stop these at any time.</small></p>
      <SvgNewsletters />
    </section>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
