import { Container } from 'components/layout/container';
import { container } from './studentTsAndCsStyles';

export type StudentTsAndCsProps = {
	tsAndCsItem: JSX.Element;
};
export function StudentTsAndCs({
	tsAndCsItem,
}: StudentTsAndCsProps): JSX.Element {
	return (
		<Container sideBorders cssOverrides={container}>
			{tsAndCsItem}
		</Container>
	);
}
