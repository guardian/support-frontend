// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgSubscribe from 'components/svgs/subscribe';
import SvgSubscribed from 'components/svgs/subscribed';
import SvgNewsletters from 'components/svgs/newsletters';
import SvgInformation from 'components/svgs/information';
import { trackComponentClick } from 'helpers/tracking/ophanComponentEventTracking';
import type { Dispatch } from 'redux';
import type { Action } from '../../../helpers/user/userActions';
import type { Csrf as CsrfState } from '../../../helpers/csrf/csrfReducer';
import { sendMarketingPreferencesToIdentity } from '../../../components/marketingConsent/helpers';

// ----- Types ----- //

type PropTypes = {|
  confirmOptIn: ?boolean,
  email: string,
  csrf: CsrfState,
  onClick: (?string, CsrfState) => void,
|};

const mapStateToProps = state => ({
  confirmOptIn: state.page.marketingConsent.confirmOptIn,
  email: state.page.form.formData.email,
  csrf: state.page.csrf,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onClick: (email: string, csrf: CsrfState) => {
      trackComponentClick('marketing-permissions');
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
    <section className={classNameWithModifiers('marketing-permissions', ['newsletter'])}>
      <h3 className="marketing-permissions__title">Subscriptions, membership and contributions</h3>
      <p className="marketing-permissions__message">
        Get related news and offers – whether you are a subscriber, member,
        contributor or would like to become one.
      </p>

      {props.confirmOptIn === true ?
        <button disabled="disabled" className={classNameWithModifiers('button', ['newsletter', 'newsletter__subscribed'])}>
          <SvgSubscribed />
          Signed up
        </button> :
        <button
          className={classNameWithModifiers('button', ['newsletter'])}
          onClick={
            () => props.onClick(props.email, props.csrf)
          }
        >
          <SvgSubscribe />
          Sign me up
        </button>
      }

      <p className="confirmation__meta">
        <small>
          { props.confirmOptIn === true ?
            'We\'ll be in touch. Check your inbox for a confirmation link.' :
            <div>
              <SvgInformation />
              <span className="information__message">You can unsubscribe at any time</span>
            </div>
          }
        </small>
      </p>
      <SvgNewsletters />
    </section>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
