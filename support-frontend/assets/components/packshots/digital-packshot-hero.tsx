import GridImage from 'components/gridImage/gridImage';

function DigitalPackshotHero() {
	return (
		<div className="subscriptions-feature-packshot">
			<GridImage
				classModifiers={['']}
				gridId={'editionsPackshotShort'}
				srcSizes={[1000, 500]}
				sizes="(max-width: 480px) 100px,
            (max-width: 740px) 100%,
            (max-width: 1067px) 150%,
            800px"
				imgType="png"
			/>
		</div>
	);
}

export default DigitalPackshotHero;
