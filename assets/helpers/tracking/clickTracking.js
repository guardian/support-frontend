// @flow

// ----- Imports ----- //

import { gaEvent } from './googleTagManager';


// ----- Functions ----- //

function sendClickedEvent(
  label: string,
  triggerActivity?: string,
): () => void {

  return () => {
    gaEvent({
      category: 'click',
      action: triggerActivity || 'CLICK',
      label,
    });
  };

}

// ----- Exports ----- //

export {
  sendClickedEvent,
};
