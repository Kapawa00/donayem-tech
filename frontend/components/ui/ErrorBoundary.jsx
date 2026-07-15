'use client';

import { Component } from 'react';
import ErrorState from './ErrorState';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary a intercepté une erreur :', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { hasError } = this.state;
    const { fallback, message, children } = this.props;

    if (hasError) {
      return fallback ?? <ErrorState message={message} onRetry={this.handleRetry} />;
    }

    return children;
  }
}
