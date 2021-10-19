import React from "react";
import GridImage from "components/gridImage/gridImage";

const PremiumAppPackshot = () => <div>
    <GridImage classModifiers={['subscriptions-premium-image']} gridId="subscriptionIphone" srcSizes={[578, 527, 264]} sizes="(max-width: 480px) 100px,
              (max-width: 740px) 200px,
              300px" imgType="png" />
  </div>;

export default PremiumAppPackshot;