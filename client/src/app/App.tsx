import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import router from "../routes/index";
import useUIStore from "../store/uiStore";
import { useEffect, useMemo } from "react";

const App = () => {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toastOptions = useMemo(
    () => ({
      duration: 4000,
      style: {
        background: theme === "dark" ? "#1f2937" : "#ffffff",
        color: theme === "dark" ? "#f9fafb" : "#111827",
        borderRadius: "12px",
        border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
        fontSize: "14px",
        padding: "12px 16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      },
      success: {
        iconTheme: {
          primary: "#6366f1",
          secondary: "#ffffff",
        },
      },
      error: {
        iconTheme: {
          primary: "#f43f5e",
          secondary: "#ffffff",
        },
      },
    }),
    [theme]
  );

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" toastOptions={toastOptions} />
    </>
  );
};

export default App;
