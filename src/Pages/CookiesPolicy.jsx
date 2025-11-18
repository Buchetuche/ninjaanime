import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold">Política de Cookies</h1>
          <p className="text-gray-400 mt-2">Cómo usamos cookies en AnimeNinja y cómo puedes gestionarlas.</p>
        </header>

        <section className="space-y-6">
          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">¿Qué son las cookies?</h2>
            <p className="text-gray-300 leading-relaxed">
              Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo para
              almacenar preferencias, estadísticas de uso y ayudar a que la experiencia sea más personalizada.
              Algunas cookies son necesarias para el funcionamiento básico del sitio; otras facilitan funcionalidades avanzadas.
            </p>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Tipos de cookies que usamos</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Cookies estrictamente necesarias:</strong> permiten navegar y usar funciones básicas (por ejemplo, autenticación, navegación segura).
              </li>
              <li>
                <strong>Cookies de rendimiento:</strong> recogen información anónima sobre cómo los visitantes usan el sitio (páginas visitadas, errores).
              </li>
              <li>
                <strong>Cookies funcionales:</strong> recuerdan elecciones hechas en el sitio (idioma, preferencias de reproducción).
              </li>
              <li>
                <strong>Cookies de marketing/segmentación:</strong> se usan para mostrar contenido relevante y analizar la efectividad de campañas.
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">¿Por cuánto tiempo permanecen las cookies?</h2>
            <p className="text-gray-300 leading-relaxed">Algunas cookies expiran al cerrar el navegador (cookies de sesión) y otras permanecen hasta su fecha de caducidad (cookies persistentes).</p>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Cómo gestionar o desactivar cookies</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Puedes configurar o desactivar las cookies desde las opciones de tu navegador. Ten en cuenta que al desactivar ciertas cookies, algunas funciones del sitio pueden dejar de estar disponibles.
            </p>
            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
              <li>Chrome: <span className="text-gray-300">Menú &gt; Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios</span></li>
              <li>Firefox: <span className="text-gray-300">Opciones &gt; Privacidad & Seguridad &gt; Cookies y datos del sitio</span></li>
              <li>Edge: <span className="text-gray-300">Configuración &gt; Cookies y permisos de sitio</span></li>
            </ul>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Cookies de terceros</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Podemos permitir que servicios externos (por ejemplo, plataformas de análisis, redes sociales o proveedores de vídeos) coloquen cookies en tu dispositivo. Estos terceros tienen sus propias políticas de privacidad y cookies.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <strong>Google Analytics:</strong> nos ayuda a entender cómo los visitantes interactúan con el sitio (páginas vistas, duración de sesión, etc.).
              </li>
              <li>
                <strong>Google AdSense:</strong> muestra anuncios personalizados basados en tu historial de navegación. Google puede usar cookies para recopilar información sobre tu actividad en línea para personalizar anuncios.
              </li>
              <li>
                <strong>Redes sociales:</strong> si compartes contenido en redes sociales, sus cookies se pueden usar para rastrear tu actividad.
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Gestión de anuncios personalizados</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Si prefieres no recibir anuncios personalizados de Google AdSense, puedes:
            </p>
            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1 mb-4">
              <li>Visitar <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35]">Google Ad Settings</a> para controlar tus preferencias.</li>
              <li>Usar <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#FF6B35]">Digital Advertising Alliance</a> para excluirte de anuncios dirigidos.</li>
              <li>Instalar una extensión de navegador bloqueadora de publicidad (ten en cuenta que esto puede afectar tu experiencia en el sitio).</li>
            </ul>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Contacto</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Si tienes preguntas sobre nuestra política de cookies, puedes contactarnos en <a href="mailto:privacy@animeninja.local" className="text-[#FF6B35]">privacy@animeninja.local</a>.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/">
                <Button className="bg-[#FF6B35] hover:bg-[#E85A2A] cursor-pointer">Volver al inicio</Button>
              </Link>
              <Link to="/privacy">
                <Button variant="outline" className="border-gray-700 cursor-pointer">Política de Privacidad</Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" className="border-gray-700 cursor-pointer">Explorar anime</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
