// @flow
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { ContributionType } from 'helpers/contributions';

const
  recaptchaEnabled = (countryGroupId: CountryGroupId, contributionType: ContributionType): boolean =>
  window.guardian.recaptchaV2
  && contributionType !== 'ONE_OFF'
  && countryGroupId === 'AUDCountries';

const loadRecaptchaV2 = () =>
  new Promise<void>((resolve, reject) => {
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?onload=v2OnloadCallback&render=explicit';

    recaptchaScript.onerror = reject;
    recaptchaScript.onload = resolve;

    if (document.head) {
      document.head.appendChild(recaptchaScript);
    }
  });

export { loadRecaptchaV2, recaptchaEnabled };

