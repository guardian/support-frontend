import type { ProductKey } from '@modules/product-catalog/productCatalog';
import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';

type PromoTerm = {
	key: ProductKey | ActiveRatePlanKey;
	description: string;
};

type PromoTermsContextValue = {
	promoTerms: PromoTerm[];
	setPromoTerms: Dispatch<SetStateAction<PromoTerm[]>>;
};

const PromoTermsContext = createContext<PromoTermsContextValue | undefined>(
	undefined,
);

export function PromoTermsProvider({ children }: { children: ReactNode }) {
	const [promoTerms, setPromoTerms] = useState<PromoTerm[]>([]);

	const value = useMemo(() => ({ promoTerms, setPromoTerms }), [promoTerms]);

	return (
		<PromoTermsContext.Provider value={value}>
			{children}
		</PromoTermsContext.Provider>
	);
}

export function usePromoTerms() {
	const context = useContext(PromoTermsContext);

	if (!context) {
		throw new Error('usePromoTerms must be used within a PromoTermsProvider');
	}

	return context;
}
