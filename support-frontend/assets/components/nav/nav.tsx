import { css } from '@emotion/react';
import { between, brand, from, neutral } from '@guardian/source-foundations';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

const container = css`
	display: none;

	${from.desktop} {
		display: flex;
		min-width: 100%;
		min-height: 41px;
		background-color: ${brand[400]};
		color: ${neutral[97]};
	}
`;

const gutter = (direction: string) => css`
  border-${direction}: 1px solid ${brand[600]};

  ${from.desktop} {
    width: 60px;
  }

  ${from.leftCol} {
    width: 30px;
  }

  ${from.wide} {
    width: 70px;
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

const countrySwitcher = css`
	flex-grow: 1;
	margin: auto 0;
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
			<span css={gutter('right')} />
			<span css={divider} />
			<div css={countrySwitcher}>
				<CountryGroupSwitcher
					countryGroupIds={countryGroupIds}
					selectedCountryGroup={selectedCountryGroup}
					subPath={subPath}
				/>
			</div>
			<span css={gutter('left')} />
		</nav>
	);
}

export default Nav;
