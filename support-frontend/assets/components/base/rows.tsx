import type { ReactNode } from 'react';
import { classNameWithModifiers } from 'helpers/utilities/utilities';
import './rows.scss';

type RowProps = {
	gap?: 'small' | 'normal' | 'large';
	className?: string | null;
	children: ReactNode;
};

export default function Rows({
	children,
	className = null,
	gap = 'normal',
}: RowProps): JSX.Element {
	return (
		<div
			className={[
				className,
				classNameWithModifiers('component-base-rows', [gap]),
			].join(' ')}
		>
			{children}
		</div>
	);
}
