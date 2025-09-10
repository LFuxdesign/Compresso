import "./app.css";
import { useEffect } from "react";
import { Route, BrowserRouter, Routes, useLocation, Navigate, HashRouter } from "react-router-dom";
import Header from "./components/header/header";
// import Auth from "./pages/auth/auth";
import Home from "./pages/home/home/home";
import CompressInputUI from "./components/compressInputUi/compressInput";
// import Logout from "./pages/logout/logout";
import axios from "axios";

export default function App() {
  axios.defaults.withCredentials = true;
  return (
    <HashRouter>
        <AppContent />
    </HashRouter>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const counter = setTimeout(() => {
      try {
        document.querySelectorAll(".entryAnimation").forEach((e) => {
          e.classList.remove("entryAnimation");
          e.style.animation = "";
        });
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        console.error(
          "erro ao limpar delay da animação de entrada dos elementos"
        );
      }
    }, 2000);

    // getUserData();
    return () => clearTimeout(counter);

  }, [location]);


  return (
    <>
      <Header />
      <div id="main">
        <Routes>
          <Route path="/" element={ <Home />} />
          <Route path="/comprimir" element={ <><Home /> <CompressInputUI /></>} />
          {/* <Route path="/login" element={<Auth />} />
          <Route path="/cadastro" element={<Auth registerMode={true} />} /> */}
          {/* <Route path="/erro" element={<Home />} />
          <Route path="/logout" element={<Logout />} /> */}
          <Route path="/refresh" element={<><Home /><Navigate to="/" replace /></>} />
        </Routes>
      </div>
    </>
  );
}

