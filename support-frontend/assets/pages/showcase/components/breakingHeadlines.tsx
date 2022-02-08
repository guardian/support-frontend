import Content from 'components/content/content';
import BreakingTheHeadlines from 'components/svgs/breakingTheHeadlines';
import Text from 'components/text/text';

export default function BreakingHeadlines() {
	return (
		<Content appearance="grey">
			<Text>
				<BreakingTheHeadlines />
				<p>
					We pride ourselves on our breaking news stories, in-depth analysis and
					thoughtful opinion pieces. But it&#39;s not just the news desk that
					works round the clock. Across the world, our sports writers, arts
					critics, interviewers and science reporters are dedicated to bringing
					you the quality coverage you have come to expect of the Guardian. Why
					settle for less?
				</p>
			</Text>
		</Content>
	);
}
