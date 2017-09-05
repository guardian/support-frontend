const dimensions = {
  experience: 'dimension16',
};

const create = () => {

  /* eslint-disable */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
  /* eslint-enable */

  ga('create', 'UA-51507017-5', 'auto');
};

export const init = () => {
  create();
};

export const setDimension = (name, value) => {
  ga('set', dimensions[name], value);
};

export const trackPageview = () => {
  ga('send', 'pageview');
};

export const trackEvent = (category, action, label, value, fields) => {
  ga('send', 'event', category, action, label, value, fields);
};
