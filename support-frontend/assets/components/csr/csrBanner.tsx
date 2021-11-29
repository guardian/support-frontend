import { css } from '@emotion/core';
import React from 'react';
import { csrUserName, useCsrCustomerData } from 'components/csr/csrMode';

const container = css`
	margin-bottom: 57px;
`;
const banner = css`
	padding: 16px 8px;
	background-color: #555;
	color: white;
	border-bottom: solid 1px white;
	position: fixed;
	top: 0;
	width: 100%;
	z-index: 10;
`;

function CsrBanner() {
	const csrCustomerData = useCsrCustomerData();

	if (csrCustomerData) {
		return (
			<div css={container}>
				<div css={banner}>
					You are in customer support mode. Signed in as:{' '}
					{csrUserName(csrCustomerData)}
				</div>
			</div>
		);
	}

	return null;
}

export default CsrBanner;
