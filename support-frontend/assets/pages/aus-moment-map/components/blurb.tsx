// ----- Imports ----- //
// @ts-ignore
import * as React from "preact/compat";
import { SocialLinks } from "pages/aus-moment-map/components/socialLinks";
const enableSupporterCount = true;

const useSupportersCount = () => {
  const [supportersCount, setSupportersCount] = React.useState(0);
  const supportersCountEndpoint = '/supporters-ticker.json';
  React.useEffect(() => {
    if (enableSupporterCount) {
      fetch(supportersCountEndpoint).then(response => response.json()).then(data => setSupportersCount(data.total));
    }
  }, []);
  return supportersCount;
};

type PropTypes = {
  slim?: boolean;
};
// ----- Render ----- //
export const Blurb = (props: PropTypes) => {
  const supportersCount = useSupportersCount();
  return <div className="blurb-wrapper">
      <div>
        <h2 className={`blurb ${props.slim ? 'blurb-slim' : ''}`}>Hear from Guardian supporters across Australia</h2>
        {!props.slim && <div>
          <p className="blurb">
            Our supporters are doing something powerful. As our readership grows, more people are supporting Guardian
            journalism than ever before. But what drives this support? We asked readers across every state to share
            their reasons with us – and here is a selection. You can become a supporter right now and add to the
            conversation.
          </p>
          {enableSupporterCount && <>
              <p className="supporters-total">{supportersCount.toLocaleString()}</p>
              <p className="supporters-total-caption">Total supporters in Australia</p>
            </>}
        </div>}
      </div>
      <SocialLinks />
    </div>;
};
Blurb.defaultProps = {
  slim: false
};