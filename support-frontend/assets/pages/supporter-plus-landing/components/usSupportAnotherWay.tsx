import { css } from '@emotion/react';
import {
	palette,
	textSans17,
	textSansBold20,
} from '@guardian/source/foundations';
import { Container } from 'components/layout/container';

const supportAnotherWay = css`
	margin: 20px 0;
	max-width: 940px;
	text-align: left;
	color: ${palette.neutral[100]};
	h4 {
		${textSansBold20};
	}
	p {
		${textSans17};
	}
	a {
		color: ${palette.neutral[100]};
	}
`;

const supportAnotherWayContainer = css`
	display: flex;
	background-color: #1e3e72;
`;

export function USSupportAnotherWay() {
	return (
		<Container
			sideBorders
			borderColor="rgba(170, 170, 180, 0.5)"
			cssOverrides={supportAnotherWayContainer}
		>
			<div css={supportAnotherWay}>
				<h4>Support another way</h4>
				<p>
					If you are interested in contributing through a donor-advised fund,
					foundation or retirement account, or by mailing a check, <br />
					please visit our{' '}
					<a href="https://help.theguardian.com/article/how-can-i-make-a-tax-deductible-contribution-us-only">
						help page
					</a>{' '}
					to learn how.
				</p>
			</div>
		</Container>
	);
}
