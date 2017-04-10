// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

export default function FeatureList(props) {

    const items = props.listItems.map((item) => {

        const itemText = <p>{ item.text }</p>;

        return (
          <li>
            <h3>{ item.heading }</h3>
            { item.text ? itemText : '' }
          </li>
        );

    });

    return <ul className="component-feature-list">{ items }</ul>;

}


// ----- Proptypes ----- //

FeatureList.propTypes = {
    listItems: React.PropTypes.arrayOf(React.PropTypes.shape({
        heading: React.PropTypes.string,
        text: React.PropTypes.string,
    })).isRequired,
};
