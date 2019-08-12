/* eslint-disable */
import { getOptimizeExperiments } from './optimize';
import { doNotTrack } from 'helpers/tracking/doNotTrack';

if(!doNotTrack()) {
  try {

      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-51507017-5', 'auto', {cookieDomain: 'auto', anonymizeIp: true});
      ga('require', 'GTM-NZGXNBL');

  } catch (e) {
    console.log(`Error initialising Optimize script: ${e.message}`);
  }
}
/* eslint-enable */
