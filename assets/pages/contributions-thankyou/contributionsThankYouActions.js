// @flow


// ----- Actions ----- //


export type Action = { type: 'CONSENT_API_ERROR', consentApiError: boolean }


function setConsentApiError(consentApiError: boolean): Action {
  return { type: 'CONSENT_API_ERROR', consentApiError };

}

// ----- Exports ----- //

export { setConsentApiError };
