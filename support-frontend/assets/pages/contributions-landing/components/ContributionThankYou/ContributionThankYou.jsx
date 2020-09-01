import OldContributionThankYou from './old-flow/ContributionThankYouContainer';
import NewContribtuionThankYou from './new-flow/ContributionThankYou';

const ContributionThankYou = () => {
  const showNew = false;
  return (
    showNew ? <NewContribtuionThankYou /> : <OldContributionThankYou />
  );
};

export default ContributionThankYou;
