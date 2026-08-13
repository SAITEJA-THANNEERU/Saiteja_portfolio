import { PropsWithChildren, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { LoadingContext } from "./LoadingContext";

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(() => {
    // Skip loading on mobile
    if (window.innerWidth <= 768) return false;
    return true;
  });
  const [loading, setLoading] = useState(0);

  const value = {
    isLoading,
    setIsLoading,
    setLoading,
  };
  useEffect(() => {
    if (window.innerWidth > 768) return;

    let cancelled = false;
    let timer: number | undefined;

    import("../components/utils/initialFX").then((module) => {
      if (cancelled || !module.initialFX) return;

      timer = window.setTimeout(() => {
        if (!cancelled) {
          module.initialFX();
        }
      }, 100);
    });

    return () => {
      cancelled = true;
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, []);


  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};
