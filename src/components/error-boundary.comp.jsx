import React from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI.
    // console.log({ errFallBack: error });
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // this.setState({ hasError: true });

    console.error('Error caught:', error, errorInfo);
    // Log the error to an error reporting service
    // logErrorToExampleService(error, info);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div>
          <h1>Something broke!..</h1>
          <p>{error.message}</p>
        </div>
      );
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};
