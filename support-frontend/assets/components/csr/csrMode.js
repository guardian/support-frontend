const isSalesforceDomain = (domain) => domain.startsWith('https://gnmtouchpoint');

const isInCsrMode = () => window.location !== window.parent.location && isSalesforceDomain(document.referrer);

const listenForCsrDetails = (callback) =>
  window.addEventListener('message',
    (event) => {
      if (isSalesforceDomain(event.origin)) {
        callback(event.data);
      }
    });

export { isInCsrMode, listenForCsrDetails };
