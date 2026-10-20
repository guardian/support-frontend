import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react';

type PromoTermsContextValue = {
	promoTerms: string[];
	setPromoTerms: Dispatch<SetStateAction<string[]>>;
};

const PromoTermsContext = createContext<PromoTermsContextValue | undefined>(
	undefined,
);

export function PromoTermsProvider({ children }: { children: ReactNode }) {
	const [promoTerms, setPromoTerms] = useState<string[]>([]);

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
