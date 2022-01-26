// ----- Imports ----- //
import type { ReactNode } from 'react';
import React from 'react';
import './list.scss';

// ---- Types ----- //
type PropTypes = {
	items: ReactNode[];
};

// ----- Render ----- //
function OrderedList({ items }: PropTypes): JSX.Element {
	return (
		<ol className="component-list-ol">
			{items.map((item) => (
				<li className="component-list-ol__li">{item}</li>
			))}
		</ol>
	);
}

export default OrderedList;
