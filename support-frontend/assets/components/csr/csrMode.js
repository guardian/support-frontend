// $FlowIgnore - required for hooks
import { useEffect, useState } from 'react';
import { getQueryParameter } from 'helpers/urls/url';

const domains = ['https://gnmtouchpoint.my.salesforce.com', 'https://gnmtouchpoint--dev1--c.cs88.visual.force.com'];
const isSalesforceDomain = domain => domains.find(element => element === domain);

const isInCsrMode = () => window.location !== window.parent.location;

const hasCsrQueryParam = () => getQueryParameter('csr', "0") === "1";

const useCsrDetails = () => {
  const [csrUsername, setCsrUsername] = useState('');

  function checkForParentMessage(event) {
    if (isSalesforceDomain(event.origin)) {
      setCsrUsername(event.data);
    }
  }
  useEffect(() => {
    window.addEventListener('message', checkForParentMessage);
    return () => window.removeEventListener('message', checkForParentMessage);
  }, []);
  return csrUsername;
};

export { isInCsrMode, useCsrDetails, hasCsrQueryParam };
