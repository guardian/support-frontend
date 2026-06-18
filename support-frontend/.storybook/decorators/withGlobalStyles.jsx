import { Global } from '@emotion/react';
import React from 'react';
import { guardianFonts } from '../../assets/stylesheets/emotion/fonts';
import { reset } from '../../assets/stylesheets/emotion/reset';

export const withGlobalStyles = (storyFn) => (
	<>
		<Global styles={[reset, guardianFonts]} />
		{storyFn()}
	</>
);
