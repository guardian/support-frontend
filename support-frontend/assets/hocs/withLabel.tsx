// ----- Imports ----- //
import type { ComponentType } from 'react';
import type { PropsForHoc } from 'components/forms/label';
import { Label } from 'components/forms/label';
import 'helpers/types/option';

// ----- Types ----- //
type AugmentedProps<T> = T & PropsForHoc;
type ComponentToWrap<T> = ComponentType<T>;
type ComponentWithLabel<T> = ComponentType<AugmentedProps<T>>;

// ----- Component ----- //
function withLabel<Props>(
	Component: ComponentToWrap<Props>,
): ComponentWithLabel<Props> {
	return function (props: AugmentedProps<Props>) {
		return (
			<Label
				htmlFor={props.id}
				footer={props.footer}
				label={props.label}
				optional={props.optional}
			>
				<Component {...props} />
			</Label>
		);
	};
}

// ----- Exports ----- //
export { withLabel };
