// ----- Imports ----- //
import type { CommonState } from "helpers/page/commonReducer";
import { getGlobal } from "helpers/globalsAndSwitches/globals";
import type { Option } from "helpers/types/option";
import type { User } from "helpers/user/user";
import { getUser } from "helpers/user/user";
import type { Csrf } from "helpers/csrf/csrfReducer";
import type { State as MarketingConsentState } from "components/marketingConsent/marketingConsentReducer";
import { marketingConsentReducerFor } from "components/marketingConsent/marketingConsentReducer";
import type { ReaderType } from "helpers/productPrice/readerType";
export type Stage = "form" | "processing" | "thankyou" | "thankyou-pending";
export type RedemptionFormState = {
  stage: Stage;
  userCode: Option<string>;
  readerType: Option<ReaderType>;
  error: Option<string>;
  user: User;
  csrf: Option<Csrf>;
  marketingConsent: MarketingConsentState;
};
export type RedemptionPageState = {
  common: CommonState;
  page: RedemptionFormState;
};
// ------- Actions ---------- //
export type Action = {
  type: "SET_USER_CODE";
  userCode: string;
} | {
  type: "SET_READER_TYPE";
  readerType: Option<ReaderType>;
} | {
  type: "SET_ERROR";
  error: Option<string>;
} | {
  type: "SET_STAGE";
  stage: Stage;
};
const initialState: RedemptionFormState = {
  stage: getGlobal('stage') || 'form',
  userCode: getGlobal('userCode'),
  readerType: getGlobal('readerType'),
  error: getGlobal('error'),
  user: getUser(),
  csrf: getGlobal('csrf'),
  marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT')
};

const redemptionFormReducer = (previousState: RedemptionFormState = initialState, action: Action): RedemptionFormState => {
  switch (action.type) {
    case 'SET_USER_CODE':
      return { ...previousState,
        userCode: action.userCode
      };

    case 'SET_READER_TYPE':
      return { ...previousState,
        readerType: action.readerType
      };

    case 'SET_ERROR':
      return { ...previousState,
        error: action.error
      };

    case 'SET_STAGE':
      return { ...previousState,
        stage: action.stage
      };

    default:
      return previousState;
  }
}; // ----- Export ----- //


export default (() => redemptionFormReducer);