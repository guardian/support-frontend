// ----- Imports ----- //

import { connect } from 'react-redux';

import { setEmail } from 'helpers/user/userActions';
import EmailFormField from 'components/emailFormField/emailFormField';

// ----- State/Action Maps ----- //

function mapStateToProps(state) {

  return {
    email: state.page.user.email,
    isSignedIn: state.page.user.isSignedIn,
  };

}

const mapDispatchToProps = { emailUpdate: setEmail };


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(EmailFormField);
