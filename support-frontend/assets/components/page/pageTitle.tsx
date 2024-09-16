import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { from, neutral, space, titlepiece42, titlepiece50, titlepiece70 } from '@guardian/source/foundations';
import type { ReactNode } from 'react';
import {
	digitalSubscriptionsBlue,
	guardianWeeklyBlue,
	paperSubscriptionsBlue,
} from 'stylesheets/emotion/colours';
import CentredContainer from '../containers/centredContainer';

type ThemeType = 'digital' | 'weekly' | 'paper';
type PropTypes = {
	title: string;
	theme: ThemeType;
	cssOverrides?: SerializedStyles;
	children: ReactNode;
};
const themeColors: Record<ThemeType, string> = {
	weekly: guardianWeeklyBlue,
	digital: digitalSubscriptionsBlue,
	paper: paperSubscriptionsBlue,
};
const headerThemes: Record<ThemeType, SerializedStyles> = {
	weekly: css``,
	digital: css`
		color: ${neutral[97]};
		:before {
			background-color: ${themeColors.digital};
		}
	`,
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
		width: 100%;
		:before {
			height: 370px;
		}
	}
`;
export const pageTitle = css`
	${titlepiece42}; //TODO check whether this is also bold by default
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
		${titlepiece50}; //TODO check whether this is also bold by default
		margin: 0 auto;
		max-width: 1290px;
	}

	${from.leftCol} {
		${titlepiece70}  //TODO check whether this is also bold by default
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
