import {
	type ActiveProductKey,
	productCatalogDescription,
} from 'helpers/productCatalog';

interface ProductCatalogMessage {
	productKey: ActiveProductKey;
}

export default function ProductCatalogMessage({
	productKey,
}: ProductCatalogMessage) {
	const { thankyouMessage } = productCatalogDescription[productKey];
	if (!thankyouMessage) {
		return null;
	}
	return <p>{thankyouMessage}</p>;
}
