// @flow
import React from 'react';
import { WesternAustralia } from 'pages/aus-moment-map/components/territories/westernAustralia';
import { NorthernTerritory } from 'pages/aus-moment-map/components/territories/northernTerritory';
import { Queensland } from 'pages/aus-moment-map/components/territories/queensland';
import { NewSouthWales } from 'pages/aus-moment-map/components/territories/newSouthWales';
import { AustralianCapitalTerritory } from 'pages/aus-moment-map/components/territories/australianCapitalTerritory';
import { Victoria } from 'pages/aus-moment-map/components/territories/victoria';
import { Tasmania } from 'pages/aus-moment-map/components/territories/tasmania';
import { SouthAustralia } from 'pages/aus-moment-map/components/territories/southAustralia';



type MapProps = {
  selectedTerritory: string,
  onClick: function,
}

export const Map = (props: MapProps) => (
  <div className="svg-wrapper">
    <svg className="svg-content" viewBox="0 0 700 645" fill="none" preserveAspectRatio="xMinYMin meet">
      <WesternAustralia selectedTerritory={props.selectedTerritory} onClick={props.onClick} />
      <NorthernTerritory selectedTerritory={props.selectedTerritory} onClick={props.onClick} />
      <Queensland selectedTerritory={props.selectedTerritory} onClick={props.onClick} />
      <NewSouthWales selectedTerritory={props.selectedTerritory} onClick={props.onClick} />
      <AustralianCapitalTerritory selectedTerritory={props.selectedTerritory} onClick={props.onClick} />
      <Victoria selectedTerritory={props.selectedTerritory} onClick={props.onClick} />
      <Tasmania selectedTerritory={props.selectedTerritory} onClick={props.onClick} />
      <SouthAustralia selectedTerritory={props.selectedTerritory} onClick={props.onClick} />
    </svg>
  </div>
);
