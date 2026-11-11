import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const MyWorks = lazy(() => import("./pages/MyWorks"));
const Play = lazy(() => import("./pages/Play"));
const ResumePreview = lazy(() => import("./pages/ResumePreview"));

import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LoadingProvider>
              <Suspense fallback={<div className="route-loading">Loading portfolio…</div>}>
                <MainContainer>
                  <Suspense fallback={null}>
                    <CharacterModel />
                  </Suspense>
                </MainContainer>
              </Suspense>
            </LoadingProvider>
          }
        />

        <Route
          path="/myworks"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <MyWorks />
            </Suspense>
          }
        />

        <Route
          path="/play"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Play />
            </Suspense>
          }
        />

        {/* Resume Preview Route */}
        <Route
          path="/resume-preview"
          element={
            <Suspense fallback={<div className="route-loading">Loading resume...</div>}>
              <ResumePreview />
            </Suspense>
          }
        />

        <Route path="*" element={<NavigateToHome />} />
      </Routes>
    </BrowserRouter>
  );
};

const NavigateToHome = () => <Navigate to="/" replace />;

export default App;