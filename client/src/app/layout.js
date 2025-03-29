import LoaderWithMessage from "@/components/layout/conponent_message";
import "@styles/globals.css";
export const metadata = {
  icon: "/favicon.ico",
  title: "Cooperativa de Caficultores de Salgar-CoopFinanzas",
  description: "Sistema de gestion de facturas.",
};

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();
  return (
    <html lang="es" className="h-full bg-white">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full">
        <LoaderWithMessage/>
        {children}
        <footer>
          <h4>
            <img src="/images/Drau.png" alt="imgautor" className="imgautors" />
            Todos los derechos reservados de coocafisa {currentYear}
          </h4>
          <h5>Servicio tecnico: contacto@coocafisa.com</h5>
        </footer>
      </body>
    </html>
  );
}
