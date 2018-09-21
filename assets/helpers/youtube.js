// @flow

// ----- Setup ----- //

const videoCatalogue: {
  [string]: string,
} = {
  subscribeCampaignUK: 'j_Br32rpZwc',
  subscribeCampaignUS: 'wflh6lkbZyU',
};

export type VideoId = $Keys<typeof videoCatalogue>;


// ----- Exports ----- //

export { videoCatalogue };
