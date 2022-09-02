import { css } from '@emotion/react';
import { between, brand, from } from '@guardian/source-foundations';
import { Column, Columns } from '@guardian/source-react-components';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { Container } from 'components/layout/container';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

const container = css`
	display: none;

	${from.desktop} {
		display: block;
	}
`;

const divider = css`
	width: 420px;
	height: 28px;
	border-right: 1px solid ${brand[600]};
	margin-right: 11px;

	${between.leftCol.and.wide} {
		margin-right: 7px;
	}
`;

const columnCssOverrides = css`
	min-height: 42px;
	display: flex;
	align-items: center;
`;

interface NavProps {
	countryGroupIds: CountryGroupId[];
	selectedCountryGroup: CountryGroupId;
	subPath: string;
}

function Nav({
	countryGroupIds,
	selectedCountryGroup,
	subPath,
}: NavProps): JSX.Element {
	return (
		<nav css={container}>
			<Container
				sideBorders={true}
				sidePadding={false}
				topBorder={true}
				borderColor={brand[600]}
				backgroundColor={brand[400]}
			>
				<Columns>
					<div css={divider} />
					<Column cssOverrides={columnCssOverrides}>
						<CountryGroupSwitcher
							countryGroupIds={countryGroupIds}
							selectedCountryGroup={selectedCountryGroup}
							subPath={subPath}
						/>
					</Column>
				</Columns>
			</Container>
		</nav>
	);
}

export default Nav;
