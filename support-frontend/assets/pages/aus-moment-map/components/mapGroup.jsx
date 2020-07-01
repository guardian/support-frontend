// @flow
import React from 'react';
import { MapPath } from 'pages/aus-moment-map/components/mapPath';

type PropTypes = {|
  name: string,
  labelContrast: boolean,
  labelPath: string,
  mapPaths: Array<string>
|};

export const MapGroup = (props: PropTypes) => {
  const labelPath = (
    <MapPath
      territory={props.name}
      d={props.labelPath}
      type={props.labelContrast ? 'label light' : 'label dark'}
    />
  );

  const mapPaths = props.mapPaths.map(path => <MapPath territory={props.name} d={path} type="map" />);

  return (
    <g>
      { mapPaths }
      { labelPath }
    </g>
  );
};
