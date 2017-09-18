// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';


// ----- Types ----- //

type PropTypes = {
  isTestUser: boolean,
};

// ----- Component ----- //

const TestUserBanner = (props: PropTypes) => {
  const suffix = !props.isTestUser ? '--disabled' : '';
  const className = `component-test-user-banner${suffix}`;

  return (
    <div className={className}>
      Using test backend: <strong>UAT</strong> because you are signed in as a user
      with a valid Test Username.
    </div>
  );
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    isTestUser: state.page.user.isTestUser,
  };

}

// ----- Exports ----- //

export default connect(mapStateToProps)(TestUserBanner);
