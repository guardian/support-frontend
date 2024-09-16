// ----- Imports ----- //
import { css } from '@emotion/react';
import { error, textSans14 } from '@guardian/source/foundations';
import type { ReactNode } from 'react';

// ---- Types ----- //

type PropTypes = {
	message: string;
	svg?: ReactNode;
};

// ----- Component ----- //

export default function ErrorMessage(props: PropTypes): JSX.Element {
	return (
		<div css={styles.container}>
			{props.svg}
			<span>{props.message}</span>
		</div>
	);
}

// ----- Styles ----- //

const styles = {
	container: css`
		${textSans14};
		color: ${error[400]};
	`,
};
