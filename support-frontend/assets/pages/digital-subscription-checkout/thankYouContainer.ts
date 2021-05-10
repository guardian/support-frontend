import { connect } from "react-redux";
import { getFormFields } from "helpers/subscriptionsForms/formFields";
import ThankYouContent from "pages/digital-subscription-checkout/thankYouContent";
export default connect(state => ({ ...getFormFields(state),
  includePaymentCopy: true
}))(ThankYouContent);