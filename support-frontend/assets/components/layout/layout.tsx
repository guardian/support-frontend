import type { ReactNode } from 'react';

function assets(path: string) {
	return path;
}

type Props = {
	children?: ReactNode;
	id: string;
	config: unknown;
};

export function Layout({ children, id, config }: Props) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="google-site-verification"
					content="nFrhJ3suC2OpKRasEkZyH1KZKpSZc-ofno_uunJgfvg"
				/>
				<meta property="og:type" content="website" />
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="fb:app_id" content="180444840287" />

				<title>@title</title>
				<meta property="og:title" content="@title" />
				<link rel="shortcut icon" type="image/png" href="favicon.ico" />
				<link
					rel="apple-touch-icon"
					sizes="152x152"
					href={`${assets('images/favicons/152x152.png')}`}
				/>
				<link
					rel="apple-touch-icon"
					sizes="144x144"
					href={`${assets('images/favicons/144x144.png')}`}
				/>
				<link
					rel="apple-touch-icon"
					sizes="120x120"
					href={`${assets('images/favicons/120x120.png')}`}
				/>
				<link
					rel="apple-touch-icon"
					sizes="114x114"
					href={`${assets('images/favicons/114x114.png')}`}
				/>
				<link
					rel="apple-touch-icon"
					sizes="72x72"
					href={`${assets('images/favicons/72x72.png')}`}
				/>
				<link
					rel="apple-touch-icon-precomposed"
					href={`${assets('images/favicons/57x57.png')}`}
				/>
				<script src="https://assets.guim.co.uk/polyfill.io/v3/polyfill.min.js?rum=0&features=es6,es7,es2017,es2018,es2019,default-3.6,HTMLPictureElement,IntersectionObserver,IntersectionObserverEntry,fetch,NodeList.prototype.forEach,ResizeObserver&flags=gated&unknown=polyfill&cacheClear=1"></script>
				<script
					async
					src={`http://localhost:9211/assets/javascripts/${id}.js`}
				></script>
				<link
					rel="stylesheet"
					href={`http://localhost:9211/assets/stylesheets/${id}.css`}
				></link>
				<script
					id="guardian-config"
					type="application/json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(config) }}
				></script>
				<script type="text/javascript">
					var configEl = document.getElementById('guardian-config'); var
					configString = configEl.innerHTML; var configJson =
					JSON.parse(configString); window.guardian = configJson;
				</script>
			</head>

			<body class="header-tweaks">
				<div class="gu-render-to" data-not-hydrated="true"></div>
				{children}
			</body>
		</html>
	);
}
