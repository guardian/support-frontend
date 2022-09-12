import { css } from '@emotion/react';
import { brand, space } from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { Container } from 'components/layout/container';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

const switcherContainer = css`
	height: 28px;
	border-left: 1px solid ${brand[600]};
	padding: ${space[2]}px 0 0 ${space[3]}px;
	margin-bottom: ${space[3]}px;
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
		<Container
			element="nav"
			sideBorders={true}
			topBorder={true}
			borderColor={brand[600]}
			backgroundColor={brand[400]}
		>
			<Hide until="desktop">
				<Columns>
					<Column span={5} />
					<Column>
						<div css={switcherContainer}>
							<CountryGroupSwitcher
								countryGroupIds={countryGroupIds}
								selectedCountryGroup={selectedCountryGroup}
								subPath={subPath}
							/>
						</div>
					</Column>
				</Columns>
			</Hide>
		</Container>
	);
}

export default Nav;
