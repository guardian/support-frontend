import React from 'react'; // The AmazonPay logo used on checkouts.

export default function SvgAmazonPayLogoDs(): JSX.Element {
	return (
		<svg
			width="30"
			height="20"
			viewBox="0 0 30 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="svg-amazon-pay"
			preserveAspectRatio="xMinYMid"
			aria-hidden="true"
			focusable="false"
			aria-labelledby="svgDescription"
			role="img"
		>
			<desc id="svgDescription">Amazon Pay badge</desc>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M25.28 4.75L23.5066 3H5.77333L4 4.75V6.36H25.28V4.75ZM25.28 8.32H4L4 15.25L5.74377 17H23.5066L25.28 15.25L25.28 8.32ZM8.48 13.64H10.6958V12.52H8.48V13.64ZM14.0639 13.64H11.8481V12.52H14.0639V13.64ZM15.2161 13.64H17.4319V12.52H15.2161V13.64ZM20.8 13.64H18.5842V12.52H20.8V13.64Z"
				fill="#052962"
			/>
			<rect x="4" y="3" width="22" height="14" fill="url(#pattern0)" />
			<defs>
				<pattern
					id="pattern0"
					patternContentUnits="objectBoundingBox"
					width="1"
					height="1"
				>
					<use
						xlinkHref="#image0"
						transform="translate(-0.0118577) scale(0.013834 0.0217391)"
					/>
				</pattern>
				<image
					id="image0"
					width="74"
					height="46"
					xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAuCAMAAAC4a38PAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACo1BMVEUzPkhPWGG/wsaRl51JUluqr7Pp6+z////y8/S0uLxIUltFT1ido6fU1tj09PXh4+SUmp81QEp9hIvAw8aWnKE1QEmvs7dZYmpmbnb+/v7l5ufp6utETleMkpj9/f3b3d/x8fKdoqdxeH/9/f5pcXj5+vpBS1Slqa5GUFlnb3f19fatsrZSXGQ8RlDs7e6PlZuwtLi4vL+TmZ729/c2QUtbZGyZn6TZ2905Q03x8vNocHdVX2dYYWlNVl9VXmbj5eY0P0lASlN7gonQ0tX19vbIy82fpKm5vMCVmqBlbXSXnaLN0NO1ub3g4eNudn3n6Ok7Rk9HUVpNV2A/SVP7+/uBiI7m6OllbnV5gYfBxMfo6epaY2uus7e5vcF3foX4+PlMVV58g4n8/Pzz9PT6+vvr7O339/jLztA3QkzHys3V2Nrc3t+9wcStsbWSmJ2xtrmYnaI+SVK6vsFtdHxOWGCGjZPKzdB5gIaytrpqcno+Q0RMST9ARENyeoFrc3p/hoykqa2ZnqNWX2g2P0d7Xi/EfxXxkwX/mQD0lAStdR3mjgm8exhRSz5ERULeigz2lQPpjwjrkAf5lgJLSUDbiQ39mAGtdB1PSj45QUY1P0elcSD1lQM9QkW6ehj+mQC9fBdlVDY0Pkh9Xy5eUTmEYivRhBB/YC3ijAqWaiVOSj5kVDeudR2sdB2qcx6XayXGgBSdbSNiUzc4QEY/Q0R1WzH6lwKVaiXgiwttWDPdigz5lwLOgxGhbyF+YC1bUDpgUjjaiQ3FfxRVTTxXTju2eRrZiA3vkgazdxu5ehnJgRPzlATKgRNmVTajcCBoVjW9exfukgbZiA5fUjh5XS/tkQbfiwupcx5tWDQ3QEdQSz6ebiL1lATnjgi4eRlwWTNGR0EAAAD/9Sp1AAAAAWJLR0TgKA//MAAAAAlwSFlzAAALEgAACxIB0t1+/AAAAmRJREFUSMft1uk3VHEYB/Bvka+0SNPQUGQpWrSRDJW00aJVtCfa933fVQ9JWYaIUkKEtO+rCmnVvvev9MJM53QaY64zrzq+r+75Pc/53Of+7u+ce4HmNKc5lkmLllbWrWxo29oOQJu27dqT9h0c0FHVCQCgdlQ5mUt1pq2txtmGdOkCdKWri1s30h0e9LQDAC9272E+RW8foGcv9gb6ePkCam/2hYML+wFAfw6AAgoAMJB+/vqlQSQQwMEAArUMUkwFk0P0S0NJwNqVwwAPhgxXTIWSQcCIkdpR9qNJACqOAcIYjqZQYzGOmvETWkaQACZyknqyn+sU5ZQTOXVaJKcbHhDqKEbP4EwopwI4C7NJnz8UwjlHRQ9l1NxgqOfNpxViyAVATFg95RMbt3CRgzJKy7jF5JKlwDJqlq/QROkHXUm6QxkVs8o5zm11IIDQNdrYiLXrHNcDADZQsxFN2Csj2cTNsAylduMWi1DRQVsZ4m8RypOM3Ka/3r5jpynCUPTdtdtofc/effsBIP7AwUMikpDYMHU46Yg5QycflWMpqWki0nBPui4j0wws/ngWgOwTkmOiKfeknMo7faZxLTf/LAqk0GRPUYLIueISkz3Z50tzpAzlcsH0/dIrRER0Fy9dNl6/cjUxVeTa9XjcyChpbPibt0RE5Padu/fuZ/31gh8UlD3MEBF5VAk8lidmbGv+UzGkSleRV12aWV3zTFdrWHv+AgBeViWbdUhfvU4T43lTXlnfUvfW3BOf+67m/T/Oh4+fPjftK/2l6GtSXUqtiHz7Xvij+Oev5h+X/ztisViQ+g0WCgdRdJmBewAAAABJRU5ErkJggg=="
				/>
			</defs>
		</svg>
	);
}
