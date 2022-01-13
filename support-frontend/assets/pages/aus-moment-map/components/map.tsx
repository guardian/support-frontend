// ----- Imports ----- //
import * as React from 'preact/compat';
import type { ReactNode } from 'react';
import { useWindowWidth } from '../hooks/useWindowWidth';
import ActSvg from './territories/actSvg';
import NewSouthWalesSvg from './territories/newSouthWalesSvg';
import NorthernTerritorySvg from './territories/northernTerritorySvg';
import QueenslandSvg from './territories/queenslandSvg';
import SouthAustraliaSvg from './territories/southAustraliaSvg';
import TasmaniaSvg from './territories/tasmaniaSvg';
import VictoriaSvg from './territories/victoriaSvg';
import WesternAustraliaSvg from './territories/westernAustraliaSvg';

type TerritorySvgContainerProps = {
	onClick: () => void;
	isSelected: boolean;
	children: ReactNode;
};

function TerritorySvgContainer(props: TerritorySvgContainerProps) {
	const { windowWidthIsGreaterThan } = useWindowWidth();

	const handleClick = () => {
		windowWidthIsGreaterThan('desktop') && props.onClick;
	};

	return (
		<g
			className={`territory ${props.isSelected ? 'territory-selected' : ''}`}
			onClick={handleClick}
		>
			{props.children}
		</g>
	);
}

type MapProps = {
	selectedTerritory: string | null;
	setSelectedTerritory: (arg0: string) => void;
};

export const Map = React.forwardRef(
	(props: MapProps, ref: React.Ref<HTMLDivElement>) => (
		<div className="map" ref={ref}>
			<div className="map-background" />
			<div className="svg-wrapper">
				<svg
					className="svg-content"
					viewBox="0 0 694 645"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<TerritorySvgContainer
						onClick={() => props.setSelectedTerritory('ACT')}
						isSelected={props.selectedTerritory === 'ACT'}
					>
						<ActSvg />
					</TerritorySvgContainer>

					<TerritorySvgContainer
						onClick={() => props.setSelectedTerritory('VIC')}
						isSelected={props.selectedTerritory === 'VIC'}
					>
						<VictoriaSvg />
					</TerritorySvgContainer>

					<TerritorySvgContainer
						onClick={() => props.setSelectedTerritory('NSW')}
						isSelected={props.selectedTerritory === 'NSW'}
					>
						<NewSouthWalesSvg />
					</TerritorySvgContainer>

					<TerritorySvgContainer
						onClick={() => props.setSelectedTerritory('QLD')}
						isSelected={props.selectedTerritory === 'QLD'}
					>
						<QueenslandSvg />
					</TerritorySvgContainer>

					<TerritorySvgContainer
						onClick={() => props.setSelectedTerritory('SA')}
						isSelected={props.selectedTerritory === 'SA'}
					>
						<SouthAustraliaSvg />
					</TerritorySvgContainer>

					<TerritorySvgContainer
						onClick={() => props.setSelectedTerritory('WA')}
						isSelected={props.selectedTerritory === 'WA'}
					>
						<WesternAustraliaSvg />
					</TerritorySvgContainer>

					<TerritorySvgContainer
						onClick={() => props.setSelectedTerritory('TAS')}
						isSelected={props.selectedTerritory === 'TAS'}
					>
						<TasmaniaSvg />
					</TerritorySvgContainer>

					<TerritorySvgContainer
						onClick={() => props.setSelectedTerritory('NT')}
						isSelected={props.selectedTerritory === 'NT'}
					>
						<NorthernTerritorySvg />
					</TerritorySvgContainer>
				</svg>
			</div>
		</div>
	),
);
