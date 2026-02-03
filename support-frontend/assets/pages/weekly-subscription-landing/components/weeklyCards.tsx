type WeeklyCardsPropTypes = {
	test?: boolean;
};

export function WeeklyCards({ test }: WeeklyCardsPropTypes): JSX.Element {
	return <>{test}</>;
}
