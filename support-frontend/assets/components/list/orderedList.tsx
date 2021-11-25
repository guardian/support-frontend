// ----- Imports ----- //
import type { Node } from 'react';
import React from 'react';
import './list.scss';
// ---- Types ----- //
type PropTypes = {
	items: Node[];
};

// ----- Render ----- //
const OrderedList = ({ items }: PropTypes) => (
	<ol className="component-list-ol">
		{items.map((item) => (
			<li className="component-list-ol__li">{item}</li>
		))}
	</ol>
);

export default OrderedList;
