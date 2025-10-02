import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <div className="text-center">
            <div className="mb-4">
              <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
            </div>

            <h2 className="mb-3">Oops! Something went wrong</h2>

            <Alert variant="danger" className="text-start mb-4">
              <Alert.Heading>Error Details</Alert.Heading>
              <p className="mb-0">
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}
              </p>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-2">
                  <summary>Stack Trace (Development Mode)</summary>
                  <pre className="mt-2 small">{this.state.errorInfo.componentStack}</pre>
                </details>
              )}
            </Alert>

            <div className="d-flex gap-2 justify-content-center">
              <Button 
                variant="primary" 
                className="btn-custom btn-primary-custom"
                onClick={this.handleReload}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reload Page
              </Button>

              <Button 
                variant="outline-secondary" 
                className="btn-custom"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Go Back
              </Button>
            </div>

            <div className="mt-4 text-muted">
              <p>If this problem persists, please contact support.</p>
            </div>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
