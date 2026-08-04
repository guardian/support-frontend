import { css } from '@emotion/react';
import { palette, space } from '@guardian/source/foundations';
import { Column, Columns, Hide } from '@guardian/source/react-components';
import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { Container } from 'components/layout/container';
import SupportRegionSwitcher from '../supportRegionSwitcher/supportRegionSwitcher';

const switcherContainer = css`
	height: 28px;
	border-left: 1px solid ${palette.brand[600]};
	padding: ${space[2]}px 0 0 ${space[3]}px;
	margin-bottom: ${space[3]}px;
`;
interface NavProps {
	supportRegionIds: SupportRegionId[];
	selectedSupportRegion: SupportRegionId;
	subPath: string;
	countryIsAffectedByVATStatus?: boolean;
}

function Nav({
	supportRegionIds,
	selectedSupportRegion,
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
								<SupportRegionSwitcher
									supportRegionIds={supportRegionIds}
									selectedSupportRegion={selectedSupportRegion}
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
