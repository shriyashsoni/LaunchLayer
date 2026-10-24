import React from "react";
import ReactDOM from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App";
import "./index.css";

// Fallback to production convex cloud if VITE_CONVEX_URL is missing or misconfigured on Vercel
const rawConvexUrl = (import.meta.env.VITE_CONVEX_URL as string | undefined)?.trim();
const fallbackConvexUrl = "https://lovely-buffalo-252.convex.cloud";

const isProductionDomain =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

const convexUrl =
  rawConvexUrl && (!isProductionDomain || (!rawConvexUrl.includes("127.0.0.1") && !rawConvexUrl.includes("localhost")))
    ? rawConvexUrl
    : fallbackConvexUrl;

let convexClient: ConvexReactClient | null = null;
try {
  convexClient = new ConvexReactClient(convexUrl);
} catch (err) {
  console.error("Failed to initialize ConvexReactClient:", err);
}

// Error Boundary to prevent blank white screens
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Root ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050505",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
          textAlign: "center"
        }}>
          <div style={{
            maxWidth: "440px",
            width: "100%",
            backgroundColor: "#121214",
            border: "1px solid #27272a",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
              Something went wrong
            </h2>
            <p style={{ color: "#a1a1aa", fontSize: "14px", marginBottom: "24px", wordBreak: "break-word" }}>
              {this.state.error?.message || "An unexpected error occurred while loading the application."}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontWeight: "600",
                fontSize: "14px",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RootErrorBoundary>
        {convexClient ? (
          <ConvexProvider client={convexClient}>
            <App />
          </ConvexProvider>
        ) : (
          <App />
        )}
      </RootErrorBoundary>
    </React.StrictMode>,
  );
}

