// @flow

// ----- Campaigns ----- //

const baselineTestPrefix = 'gdnwb_copts_memco_sandc_support_baseline_support';

const campaigns : {
  [string]: string[],
} = {
  baseline_test: [
    `${baselineTestPrefix}_banner`,
    `${baselineTestPrefix}_epic`,
    `${baselineTestPrefix}_liveblog`,
    `${baselineTestPrefix}_header_become_supporter`,
    `${baselineTestPrefix}_header_subscribe`,
    `${baselineTestPrefix}_side_menu_become_supporter`,
    `${baselineTestPrefix}_side_menu_subscribe`,
  ],
};

export type Campaign = $Keys<typeof campaigns>;


// ----- Functions ----- //

// Retrieves the user's campaign, if known, from the intCmp.
function getCampaign(intCmp: string): ?Campaign {

  return Object.keys(campaigns).find(campaign =>
    campaigns[campaign].includes(intCmp),
  ) || null;

}


// ----- Reducers ----- //

// Since nothing changes the INTCMP, this reducer does not handle any actions.
const intCmpReducer = (state: ?string = null): ?string => state;

const refpvidReducer = (state: ?string = null): ?string => state;


// ----- Exports ----- //

export {
  intCmpReducer,
  refpvidReducer,
  getCampaign,
};

