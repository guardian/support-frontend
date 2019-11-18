// @flow

function doNotTrack(): boolean {
  // $FlowIgnore
  const doNotTrackFlag = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;

  return doNotTrackFlag === '1' || doNotTrackFlag === 'yes';
}

const maybeTrack = (trackingFunction: () => void) => {
  if (!doNotTrack()) {
    console.log("Executing tracking function and Analytics Setup.");
    trackingFunction();
  }
};

export {
  maybeTrack,
  doNotTrack,
};
