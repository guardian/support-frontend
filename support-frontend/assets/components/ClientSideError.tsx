import type { ReactNode } from 'react';
import { Component } from 'react';
import ErrorPage from 'pages/error/components/errorPage';

type ClientSideErrorHandlerProps = {
	children: ReactNode;
};

type ClientSideErrorHandlerState = {
	hasError: boolean;
};

export function ClientSideErrorPage() {
	return (
		<ErrorPage
			headings={[
				'Sorry - we seem',
				'to be having a',
				'problem completing',
				'your request',
			]}
			copy="Please try again. If the problem persists, "
			reportLink={true}
		/>
	);
}

export class ClientSideErrorHandler extends Component<
	ClientSideErrorHandlerProps,
	ClientSideErrorHandlerState
> {
	state: ClientSideErrorHandlerState = {
		hasError: false,
	};

	static getDerivedStateFromError(): ClientSideErrorHandlerState {
		return { hasError: true };
	}

	// componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
	//   // Optional: send error to monitoring service
	//   // eslint-disable-next-line no-console
	//   console.error('PageErrorHandler caught an error:', error, errorInfo);
	// }

	render() {
		if (this.state.hasError) {
			return <ClientSideErrorPage />;
		}

		return this.props.children;
	}
}
