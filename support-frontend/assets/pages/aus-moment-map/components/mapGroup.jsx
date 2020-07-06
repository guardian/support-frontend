// @flow
import React from 'react';
import { MapPath } from 'pages/aus-moment-map/components/mapPath';

type PropTypes = {|
  name: string,
  labelContrast: boolean,
  labelPath: string,
  mapPaths: Array<string>,
  selectedTerritory: string,
  onClick: function,
|};

export const MapGroup = (props: PropTypes) => {
  const labelPath = (
    <MapPath
      territory={props.name}
      d={props.labelPath}
      type={props.labelContrast ? 'label light' : 'label dark'}
    />
  );

  const clickHandler = () => {
    props.onClick(props.name);
  };

  const mapPaths = props.mapPaths.map(path => <MapPath territory={props.name} d={path} type="map" />);
  const isSelected = props.selectedTerritory === props.name;

  return (
    <g onClick={clickHandler} className={isSelected ? 'map-group selected' : 'map-group'}>
      { mapPaths }
      { labelPath }
    </g>
  );
};
