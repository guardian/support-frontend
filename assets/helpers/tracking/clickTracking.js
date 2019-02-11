// @flow

// ----- Imports ----- //

import { gaEvent } from './googleTagManager';


// ----- Functions ----- //

function clickedEvent(
  label: string,
  triggerActivity?: string,
): void {
  gaEvent({
    category: 'click',
    action: triggerActivity || 'CLICK',
    label,
  });
}


function sendClickedEvent(
  label: string,
  triggerActivity?: string,
): () => void {

  return () => {
    clickedEvent(label, triggerActivity);
  };

}

// ----- Exports ----- //

export {
  sendClickedEvent,
  clickedEvent,
};
