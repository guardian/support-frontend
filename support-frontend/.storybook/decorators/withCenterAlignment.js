import React from 'react';

const styles = {
	display: 'flex',
	padding: '2em',
	minHeight: '100%',
	width: '100&',
	boxSizing: 'border-box',
	alignItems: 'center',
	justifyContent: 'center',
};

const stylesWithoutPadding = {
	...styles,
	padding: null,
};

export const withCenterAlignment = (storyFn) => (
	<div style={styles}>{storyFn()}</div>
);

export const withVerticalCenterAlignment = (storyFn) => (
	<div style={stylesWithoutPadding}>{storyFn()}</div>
);
