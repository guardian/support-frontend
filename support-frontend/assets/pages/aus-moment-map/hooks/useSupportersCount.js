import React from 'react';


const useSupportersCount = () => {
  const [supportersCount, setSupportersCount] = React.useState(0);
  const supportersCountEndpoint = '/supporters-ticker.json';

  React.useEffect(() => {
    fetch(supportersCountEndpoint)
      .then(response => response.json())
      .then(data => setSupportersCount(data.total));
  }, []);

  return supportersCount;
};

export default useSupportersCount;
