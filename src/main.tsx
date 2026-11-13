import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-activity-calendar/tooltips.css";
import App from "./App.tsx";
import { ThemeProvider } from "./providers/theme-provider.tsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/helpers/ScrollToTop.tsx";
import Footer from "./components/Footer.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Bend } from "./components/canvasui/Bend.tsx";
import { ProjectRedirect } from "./pages/ProjectRedirect.tsx";
import { HashRedirect } from "./pages/HashRedirect.tsx";
import { OutboundGuard } from "./components/helpers/OutboundGuard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={200}>
        <OutboundGuard />
        <Bend
          className="h-dvh w-full overflow-hidden"
          tilt={0.5}
          tumble={0.5}
          angle={80}
          zone={100}
        >
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
            <ScrollToTop />
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<App />} />
                  <Route
                    path="/blogs"
                    element={<Navigate to="/#blogs" replace />}
                  />
                  <Route
                    path="/blogs/:slug"
                    element={
                      <HashRedirect prefix="blog" fallback="/#blogs" />
                    }
                  />
                  <Route
                    path="/projects"
                    element={<Navigate to="/#projects" replace />}
                  />
                  <Route
                    path="/projects/:slug"
                    element={<ProjectRedirect />}
                  />
                  <Route
                    path="/opensource"
                    element={<Navigate to="/#opensource" replace />}
                  />
                  <Route
                    path="/opensource/:slug"
                    element={
                      <HashRedirect
                        prefix="opensource"
                        fallback="/#opensource"
                      />
                    }
                  />
                  <Route
                    path="/uses"
                    element={<Navigate to="/#uses" replace />}
                  />
                  <Route
                    path="/contact"
                    element={<Navigate to="/#contact" replace />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </Bend>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
