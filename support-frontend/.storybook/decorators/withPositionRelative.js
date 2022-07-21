import React from 'react';

export function withPositionRelative(storyFn) {
	return <div style={{ position: 'relative' }}>{storyFn()}</div>;
}