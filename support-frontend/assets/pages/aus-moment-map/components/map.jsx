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

export const Map = () => (
  <div className="svg-wrapper">
    <svg className="svg-content" viewBox="0 0 700 645" fill="none" preserveAspectRatio="xMinYMin meet">
      <WesternAustralia />
      <NorthernTerritory />
      <Queensland />
      <NewSouthWales />
      <AustralianCapitalTerritory />
      <Victoria />
      <Tasmania />
      <SouthAustralia />
    </svg>
  </div>
);
