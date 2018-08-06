// @flow

// ----- Importd ----- //

import { type Node } from 'react';


// ----- Types ----- //

type StageToPage<Stage> = {
  [Stage]: Node,
};

export type PropTypes<Stage> = {
  stage: Stage;
};


// ----- Component ----- //

const StageSelection = <Stage>(stageToPage: StageToPage<Stage>) => (props: PropTypes<Stage>) =>
  stageToPage[props.stage];


// ----- Exports ----- //

export default StageSelection;
