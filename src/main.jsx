import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import CookieConsent from "react-cookie-consent";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <CookieConsent
        // Mensaje visible en el banner
        buttonText="Aceptar y Continuar"
        cookieName="myAwesomeCookieConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e5030", fontSize: "13px" }}
        expires={150} // Los días que dura el consentimiento

        // Este es el punto clave: Aquí defines qué pasa al aceptar
        onAccept={(acceptedByScrolling) => {
          // Opcional: Ejecuta código de seguimiento o analítica aquí, 
          // después de que el usuario ha dado su permiso.
          // Por ejemplo: inicia Google Analytics
          console.log("El usuario aceptó las cookies.");
        }}
      >
        Este sitio web utiliza cookies para mejorar la experiencia del usuario.{" "}
        <a href="/cookies" style={{ color: "orange" }}>
          Lee nuestra política de cookies.
        </a>
      </CookieConsent>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
