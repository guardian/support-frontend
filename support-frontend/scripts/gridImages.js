const { fileSearch } = require('search-in-file');
const fs = require('fs');
const imageCatalogue = require('../assets/helpers/images/imageCatalogue.json');

const imageNames = Object.keys(imageCatalogue).map(async (fileName) => ({
	fileName,
	presentIn: await fileSearch(['./assets'], fileName, {
		recursive: true,
		fileMask: 'tsx',
	}),
}));

(async () => {
	try {
		const images = await Promise.all(imageNames);
		const keysToRetain = images
			.filter((image) => image.presentIn.length > 0)
			.map(({ fileName }) => fileName)
			.sort();

		console.log('Retaining the following keys:\n', keysToRetain.join('\n'));

		const newCatalogue = {};

		keysToRetain.forEach((key) => {
			newCatalogue[key] = imageCatalogue[key];
		});

		fs.writeFileSync(
			'./assets/helpers/images/imageCatalogue.json',
			`${JSON.stringify(newCatalogue, null, 2)}\n`,
		);
	} catch (error) {
		console.error(error);
	}
})();
