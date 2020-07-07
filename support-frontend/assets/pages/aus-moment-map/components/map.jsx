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
  setSelectedTerritory: string => void,
}

export const Map = (props: MapProps) => (
  <div className="svg-wrapper">
    <svg className="svg-content" viewBox="0 0 700 645" fill="none" preserveAspectRatio="xMinYMin meet">
      <WesternAustralia selectedTerritory={props.selectedTerritory} onClick={props.setSelectedTerritory} />
      <NorthernTerritory selectedTerritory={props.selectedTerritory} onClick={props.setSelectedTerritory} />
      <Queensland selectedTerritory={props.selectedTerritory} onClick={props.setSelectedTerritory} />
      <NewSouthWales selectedTerritory={props.selectedTerritory} onClick={props.setSelectedTerritory} />
      <AustralianCapitalTerritory selectedTerritory={props.selectedTerritory} onClick={props.setSelectedTerritory} />
      <Victoria selectedTerritory={props.selectedTerritory} onClick={props.setSelectedTerritory} />
      <Tasmania selectedTerritory={props.selectedTerritory} onClick={props.setSelectedTerritory} />
      <SouthAustralia selectedTerritory={props.selectedTerritory} onClick={props.setSelectedTerritory} />
    </svg>
  </div>
);
