// @flow
import type { ContributionType } from 'helpers/contributions';

const recaptchaEnabled = (contributionType: ContributionType): boolean => contributionType !== 'ONE_OFF';

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

