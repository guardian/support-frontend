// @flow
import React from 'react';
import VictoriaSvg from './territories/victoriaSvg';
import NewSouthWalesSvg from './territories/newSouthWalesSvg';
import ActSvg from './territories/actSvg';
import QueenslandSvg from './territories/queenslandSvg';
import SouthAustraliaSvg from './territories/southAustraliaSvg';
import WesternAustraliaSvg from './territories/westernAustraliaSvg';
import TasmaniaSvg from './territories/tasmaniaSvg';
import NorthernTerritorySvg from './territories/northernTerritorySvg';

type MapProps = {
  selectedTerritory: string,
  setSelectedTerritory: function,
}

export const Map = (props: MapProps) => (
  <div className="svg-wrapper">
    <svg className="svg-content" viewBox="0 0 694 645" fill="none" xmlns="http://www.w3.org/2000/svg">
      <VictoriaSvg />
      <NewSouthWalesSvg />
      <ActSvg />
      <QueenslandSvg />
      <SouthAustraliaSvg />
      <WesternAustraliaSvg />
      <TasmaniaSvg />
      <NorthernTerritorySvg />
    </svg>
  </div>
);
