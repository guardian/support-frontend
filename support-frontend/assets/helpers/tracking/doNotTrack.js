// @flow

function doNotTrack(): boolean {
  // $FlowIgnore
  const doNotTrackFlag = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;

  return doNotTrackFlag === '1' || doNotTrackFlag === 'yes';
}

const maybeTrack = (trackingFunction: () => void) => {
  if (!doNotTrack) {
    trackingFunction();
  }
};

export {
  maybeTrack,
  doNotTrack,
};
