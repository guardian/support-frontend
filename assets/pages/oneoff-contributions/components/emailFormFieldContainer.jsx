// ----- Imports ----- //

import { connect } from 'react-redux';

import { setEmail } from 'helpers/user/userActions';
import EmailFormField from 'components/emailFormField/emailFormField';
import { setEmailHasBeenBlurred } from '../oneoffContributionsActions';

// ----- State/Action Maps ----- //

function mapStateToProps(state) {

  return {
    email: state.page.user.email,
    isSignedIn: state.page.user.isSignedIn,
    emailHasBeenBlurred: state.page.oneoffContrib.emailHasBeenBlurred,
  };

}

const mapDispatchToProps = {
  emailUpdate: setEmail,
  setEmailHasBeenBlurred,
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(EmailFormField);
