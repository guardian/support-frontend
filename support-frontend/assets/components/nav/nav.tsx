import { css } from '@emotion/react';
import { brand, from, space } from '@guardian/source-foundations';
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

const col1CssOverrides = css`
	height: 28px;
	border-right: 1px solid ${brand[600]};
	margin-right: 0;
`;

const col2CssOverrides = css`
	min-height: 42px;
	display: flex;
	padding: ${space[2]}px;
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
					<Column span={5} cssOverrides={col1CssOverrides} />
					<Column cssOverrides={col2CssOverrides}>
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
