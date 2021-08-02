
const domains = ["https://gnmtouchpoint.my.salesforce.com", "https://gnmtouchpoint--dev1--c.cs88.visual.force.com"]
const isSalesforceDomain = domain => domains.find(element => element === domain)

const isInCsrMode = () => window.location !== window.parent.location;

const listenForCsrDetails = callback =>
  window.addEventListener(
    'message',
    (event) => {
      if (isSalesforceDomain(event.origin)) {
        callback(event.data);
      }
    },
  );

export { isInCsrMode, listenForCsrDetails };
