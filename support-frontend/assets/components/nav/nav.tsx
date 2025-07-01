import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { Column, Columns, Hide } from '@guardian/source/react-components';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { Container } from 'components/layout/container';

const switcherContainer = css`
	height: 28px;
	border-left: 1px solid ${palette.brand[600]};
	padding: ${space[2]}px 0 0 ${space[3]}px;
	margin-bottom: ${space[3]}px;
`;
interface NavProps {
	countryGroupIds: CountryGroupId[];
	selectedCountryGroup: CountryGroupId;
	subPath: string;
	countryIsAffectedByVATStatus?: boolean;
}

function Nav({
	countryGroupIds,
	selectedCountryGroup,
	subPath,
	countryIsAffectedByVATStatus = false,
}: NavProps): JSX.Element {
	return (
		<Container
			id="navigation"
			element="nav"
			sideBorders={true}
			topBorder={true}
			borderColor={palette.brand[600]}
			backgroundColor={palette.brand[400]}
		>
			<Hide until="desktop">
				<Columns>
					<Column span={5} />
					{!countryIsAffectedByVATStatus && (
						<Column>
							<div css={switcherContainer} data-test="xxx">
								<CountryGroupSwitcher
									countryGroupIds={countryGroupIds}
									selectedCountryGroup={selectedCountryGroup}
									subPath={subPath}
								/>
							</div>
						</Column>
					)}
				</Columns>
			</Hide>
		</Container>
	);
}

export default Nav;
