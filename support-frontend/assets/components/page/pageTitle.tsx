import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	brandAlt,
	from,
	neutral,
	space,
	titlepiece,
} from '@guardian/source-foundations';
import type { ReactNode } from 'react';
import {
	digitalSubscriptionsBlue,
	guardianWeeklyBlue,
	paperSubscriptionsBlue,
} from 'stylesheets/emotion/colours';
import CentredContainer from '../containers/centredContainer';

type ThemeType = 'showcase' | 'digital' | 'weekly' | 'paper';
type PropTypes = {
	title: string;
	theme: ThemeType;
	cssOverrides?: SerializedStyles;
	children: ReactNode;
};
const themeColors: Record<ThemeType, string> = {
	weekly: guardianWeeklyBlue,
	digital: digitalSubscriptionsBlue,
	showcase: brandAlt[400],
	paper: paperSubscriptionsBlue,
};
const headerThemes: Record<ThemeType, SerializedStyles> = {
	// weekly: css`
	// 	:before {
	// 		background-color: ${themeColors.weekly};
	// 	}
	// `,
	weekly: css``,
	digital: css`
		color: ${neutral[97]};
		:before {
			background-color: ${themeColors.digital};
		}
	`,
	showcase: css`
		:before {
			background-color: ${themeColors.showcase};
		}
	`,
	// paper: css`
	// 	:before {
	// 		background-color: ${themeColors.paper};
	// 	}
	// `,
	paper: css``,
};
const header = css`
	color: ${neutral[7]};
	position: relative;
	background-color: ${neutral[93]};
	display: flex;
	flex-direction: column;

	:before {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		content: '';
	}

	${from.desktop} {
		:before {
			height: 370px;
		}
	}
`;
export const pageTitle = css`
	${titlepiece.small({
		fontWeight: 'bold',
	})};
	z-index: 10;
	padding: ${space[3]}px ${space[3]}px ${space[4]}px;
	width: 100%;

	${from.phablet} {
		padding: ${space[4]}px ${space[4]}px ${space[9]}px;
		padding-top: ${space[9]}px;
		width: 100%;
		align-self: center;
	}

	${from.desktop} {
		${titlepiece.medium({
			fontWeight: 'bold',
		})}
		margin: 0 auto;
		max-width: 1290px;
	}

	${from.leftCol} {
		${titlepiece.large({
			fontWeight: 'bold',
		})}
	}
`;

function PageTitle({
	title,
	theme,
	cssOverrides,
	children,
}: PropTypes): JSX.Element {
	return (
		<div css={[header, headerThemes[theme], cssOverrides]}>
			<CentredContainer>
				<h1 css={pageTitle}>{title}</h1>
			</CentredContainer>
			{children}
		</div>
	);
}

PageTitle.defaultProps = {
	cssOverrides: '',
};
export default PageTitle;
