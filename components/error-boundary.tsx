"use client"

import React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Terminal crashed:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-[#2e3440] text-[#a3be8c] font-mono flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <p className="text-[#bf616a] text-lg mb-4">
              ⚠️ Kernel panic - not syncing: Fatal exception
            </p>
            <p className="text-[#eceff4] text-sm mb-6">
              Something went wrong while rendering the terminal.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              className="border border-[#a3be8c] text-[#a3be8c] px-4 py-2 rounded hover:bg-[#a3be8c] hover:text-[#2e3440] transition-colors"
            >
              $ sudo reboot
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
