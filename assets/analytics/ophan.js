const ophanUrl = '//j.ophan.co.uk/membership.js';
const ophan = curl(ophanUrl);


const init = () => {
  ophan.then(null, function(err) {
    console.log("Error initializing OPHAN."); //TODO this should be logged using sentry.
  });
};

export default init;

