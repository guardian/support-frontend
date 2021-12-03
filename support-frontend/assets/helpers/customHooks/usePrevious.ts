import { useEffect, useRef } from 'react';

// Used to monitor the previous value of a prop of generic type T
export function usePrevious<T>(value: T): T | undefined {
	const ref = useRef<T>();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}
