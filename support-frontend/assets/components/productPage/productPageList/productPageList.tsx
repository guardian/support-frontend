import React from 'react';
// styles
import './productPageList.scss';

type ListPropTypes = {
	items: Array<Record<string, any>>;
};

const List = ({ items }: ListPropTypes) => (
	<ul className="product-block__list-item__ul--simple">
		{items.map((item) => (
			<li className="product-block__list-item__li--simple">
				<span className="product-block__list-item__bullet" />
				<span className="product-block__list-item__explainer--simple">
					{item.explainer}
				</span>
			</li>
		))}
	</ul>
);

const ListHeading = ({ items }: ListPropTypes) => (
	<ul className="product-block__list-item__ul">
		{items.map((item) => (
			<li className="product-block__list-item__li">
				<div className="product-block__list-item__bullet" />
				<span className="product-block__list-item--bold">{item.boldText}</span>
				<br />
				<div className="product-block__list-item__explainer">
					{item.explainer}
				</div>
			</li>
		))}
	</ul>
);

export { List, ListHeading };
