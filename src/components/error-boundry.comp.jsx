import React from 'react';

export default class ErrorBoundry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI.
    console.log({ error });
    return { error };
  }

  componentDidCatch() {
    this.setState({ hasError: true });

    // Log the error to an error reporting service
    // logErrorToExampleService(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <h1 className="red">Something broke!..</h1>;
    }
    return children;
  }
}
