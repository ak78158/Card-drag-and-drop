import "./App.css";
import Home from "./pages/home/home";

if (process.env.NODE_ENV === "development") {
  const { isMockServiceEnabled } = await import("./mocks/browser");
  await isMockServiceEnabled();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./mocks/browser")
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  });
}

function App() {
  return <Home />;
}

export default App;
