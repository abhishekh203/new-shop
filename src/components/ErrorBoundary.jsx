import React from 'react';
import PropTypes from 'prop-types';
import logger from '../utils/logger';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console and any error reporting service
        logger.error('Error caught by boundary', { 
            error: error.message || error.toString(), 
            errorInfo: errorInfo 
        });
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
                return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements - Same as Hero Section */}
            <div className="absolute inset-0">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                </div>
                
                {/* Floating Orbs */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>
                    <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6 text-center">
                        <div className="mb-4">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-300 mb-6">
                                We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                Refresh Page
                            </button>
                            
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                Go to Home
                            </button>
                        </div>

                        {typeof globalThis !== 'undefined' && globalThis.process?.env?.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                                    Error Details (Development)
                                </summary>
                                <div className="mt-2 p-3 bg-gray-900 rounded text-xs text-red-400 overflow-auto max-h-40">
                                    <div className="mb-2">
                                        <strong>Error:</strong>
                                        <pre className="whitespace-pre-wrap">{this.state.error.toString()}</pre>
                                    </div>
                                    {this.state.errorInfo && (
                                        <div>
                                            <strong>Component Stack:</strong>
                                            <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node
};

export default ErrorBoundary; 