// @flow

// ----- Campaigns ----- //

const campaigns : {
  [string]: string[],
} = {
  baseline_test: [
    'gdnwb_copts_memco_sandc_support_baseline_support_banner',
    'gdnwb_copts_memco_sandc_support_baseline_support_epic',
    'gdnwb_copts_memco_sandc_support_baseline_support_liveblog',
    'gdnwb_copts_memco_sandc_support_baseline_support_header_become_supporter',
    'gdnwb_copts_memco_sandc_support_baseline_support_header_subscribe',
    'gdnwb_copts_memco_sandc_support_baseline_support_side_menu_become_supporter',
    'gdnwb_copts_memco_sandc_support_baseline_support_side_menu_subscribe',
  ],
};

export type Campaign = $Keys<typeof campaigns>;


// ----- Functions ----- //

// Checks if a user is in a known campaign based upon their intCmp.
function inCampaign(campaign: Campaign, intCmp: string): boolean {

  return campaigns[campaign] && campaigns[campaign].includes(intCmp);

}


// ----- Reducers ----- //

// Since nothing changes the INTCMP, this reducer does not handle any actions.
const intCmpReducer = (state: ?string = null): ?string => state;

const refpvidReducer = (state: ?string = null): ?string => state;


// ----- Exports ----- //

export {
  intCmpReducer,
  refpvidReducer,
  inCampaign,
};

