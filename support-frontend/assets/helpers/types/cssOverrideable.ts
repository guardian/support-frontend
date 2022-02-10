import type { SerializedStyles } from '@emotion/react';

// A generic interface that can be extended by any component which allows the passing of additional CSS
export interface CSSOverridable {
	cssOverrides?: SerializedStyles | SerializedStyles[];
}
