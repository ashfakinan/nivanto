import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#E5E1D8] rounded-[22px] p-8 text-center space-y-4">
            <h1 className="font-display font-extrabold text-2xl text-[#1C2440]">
              Something went wrong
            </h1>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              We encountered an application error while loading this view. Please refresh to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-[14px] bg-[#2B5FAA] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
