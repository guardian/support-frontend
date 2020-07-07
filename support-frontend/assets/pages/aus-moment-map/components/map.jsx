// @flow
import * as React from 'react';
import VictoriaSvg from './territories/victoriaSvg';
import NewSouthWalesSvg from './territories/newSouthWalesSvg';
import ActSvg from './territories/actSvg';
import QueenslandSvg from './territories/queenslandSvg';
import SouthAustraliaSvg from './territories/southAustraliaSvg';
import WesternAustraliaSvg from './territories/westernAustraliaSvg';
import TasmaniaSvg from './territories/tasmaniaSvg';
import NorthernTerritorySvg from './territories/northernTerritorySvg';

type TerritorySvgContainerProps = {
  onClick: () => void,
  isSelected: boolean,
  children: React.Node,
}

const TerritorySvgContainer = (props: TerritorySvgContainerProps) => (
  <g className={`territory ${props.isSelected ? 'territory-selected' : ''}`} onClick={props.onClick}>
    { props.children }
  </g>
);

type MapProps = {
  selectedTerritory: string,
  setSelectedTerritory: (string) => void,
}

export const Map = (props: MapProps) => (
  <div className="svg-wrapper">
    <svg className="svg-content" viewBox="0 0 694 645" fill="none" xmlns="http://www.w3.org/2000/svg">
      <TerritorySvgContainer onClick={() => props.setSelectedTerritory('VIC')} isSelected={props.selectedTerritory === 'VIC'}>
        <VictoriaSvg />
      </TerritorySvgContainer>

      <TerritorySvgContainer onClick={() => props.setSelectedTerritory('NSW')} isSelected={props.selectedTerritory === 'NSW'}>
        <NewSouthWalesSvg />
      </TerritorySvgContainer>

      <TerritorySvgContainer onClick={() => props.setSelectedTerritory('ACT')} isSelected={props.selectedTerritory === 'ACT'}>
        <ActSvg />
      </TerritorySvgContainer>

      <TerritorySvgContainer onClick={() => props.setSelectedTerritory('QLD')} isSelected={props.selectedTerritory === 'QLD'}>
        <QueenslandSvg />
      </TerritorySvgContainer>

      <TerritorySvgContainer onClick={() => props.setSelectedTerritory('SA')} isSelected={props.selectedTerritory === 'SA'}>
        <SouthAustraliaSvg />
      </TerritorySvgContainer>

      <TerritorySvgContainer onClick={() => props.setSelectedTerritory('WA')} isSelected={props.selectedTerritory === 'WA'}>
        <WesternAustraliaSvg />
      </TerritorySvgContainer>

      <TerritorySvgContainer onClick={() => props.setSelectedTerritory('TAS')} isSelected={props.selectedTerritory === 'TAS'}>
        <TasmaniaSvg />
      </TerritorySvgContainer>

      <TerritorySvgContainer onClick={() => props.setSelectedTerritory('NT')} isSelected={props.selectedTerritory === 'NT'}>
        <NorthernTerritorySvg />
      </TerritorySvgContainer>
    </svg>
  </div>
);
