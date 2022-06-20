import { useState } from 'react';
import type { CardFieldName } from './fields';

// ---- Types ---- //

interface SelectedField {
	selectedField?: CardFieldName;
	selectField: (fieldName: CardFieldName) => () => void;
	clearSelectedField: () => void;
}

// ---- Hook ---- //

export function useSelectedField(): SelectedField {
	const [selectedField, setSelectedField] = useState<CardFieldName | undefined>(
		undefined,
	);

	const selectField = (fieldName: CardFieldName) => () => {
		setSelectedField(fieldName);
	};

	const clearSelectedField = () => {
		setSelectedField(undefined);
	};

	return {
		selectedField,
		selectField,
		clearSelectedField,
	};
}
