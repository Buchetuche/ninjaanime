import { Button } from "@/Components/ui/button";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold">Política de Privacidad</h1>
          <p className="text-gray-400 mt-2">Cómo recopilamos, usamos y protegemos tu información personal.</p>
          <p className="text-gray-500 text-sm mt-4">Última actualización: Noviembre 2025</p>
        </header>

        <section className="space-y-6">
          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">1. Introducción</h2>
            <p className="text-gray-300 leading-relaxed">
              AnimeNinja ("nosotros", "nos", "nuestro") valora tu privacidad. Esta Política de Privacidad 
              explica cómo recopilamos, usamos, divulgamos y mantenemos segura tu información cuando visitas nuestro sitio web.
            </p>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">2. Información que recopilamos</h2>
            <h3 className="text-lg font-medium text-[#FF6B35] mb-3">Información que nos proporcionas directamente:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
              <li>Nombre, email y contraseña al crear una cuenta.</li>
              <li>Información de perfil (foto, bio, preferencias de géneros).</li>
              <li>Datos de pago si adquieres una suscripción premium.</li>
              <li>Mensajes de contacto o comentarios que envíes.</li>
            </ul>
            <h3 className="text-lg font-medium text-[#FF6B35] mb-3">Información recopilada automáticamente:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Dirección IP, tipo de navegador, sistema operativo.</li>
              <li>Páginas visitadas, duración de la sesión, enlaces donde hiciste clic.</li>
              <li>Datos de localización aproximada (según permisos).</li>
              <li>Información a través de cookies y tecnologías similares.</li>
            </ul>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">3. Cómo usamos tu información</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Proporcionar, mantener y mejorar nuestros servicios.</li>
              <li>Autenticar tu cuenta y procesar transacciones.</li>
              <li>Personalizar tu experiencia y recomendaciones de anime.</li>
              <li>Enviar notificaciones sobre actualizaciones, nuevos episodios o promociones.</li>
              <li>Analizar uso del sitio para mejorar funcionalidades.</li>
              <li>Prevenir fraude y cumplir con obligaciones legales.</li>
              <li>Mostrar anuncios personalizados a través de Google AdSense y otros servicios.</li>
            </ul>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">4. Compartir información con terceros</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              No vendemos tu información personal. Sin embargo, compartimos datos con:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Proveedores de servicios:</strong> procesamiento de pagos, hosting, análisis (Google Analytics).</li>
              <li><strong>Google AdSense:</strong> para mostrar anuncios personalizados según tu navegación.</li>
              <li><strong>Cumplimiento legal:</strong> si lo requiere la ley o orden judicial.</li>
              <li><strong>Redes sociales:</strong> si decides compartir contenido desde AnimeNinja.</li>
            </ul>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">5. Seguridad de datos</h2>
            <p className="text-gray-300 leading-relaxed">
              Implementamos medidas de seguridad técnicas y administrativas para proteger tu información (encriptación SSL, firewalls, acceso restringido).
              Sin embargo, ningún sistema es 100% seguro. Si experimentas una brecha de seguridad, te lo notificaremos según la ley.
            </p>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">6. Retención de datos</h2>
            <p className="text-gray-300 leading-relaxed">
              Mantenemos tu información mientras tu cuenta esté activa o mientras sea necesario para proporcionar servicios.
              Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento contactándonos.
            </p>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">7. Tus derechos</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Derecho de acceso:</strong> puedes solicitar ver qué datos tenemos sobre ti.</li>
              <li><strong>Derecho de rectificación:</strong> puedes corregir información inexacta.</li>
              <li><strong>Derecho de eliminación:</strong> puedes pedir que borremos tus datos ("derecho al olvido").</li>
              <li><strong>Derecho de portabilidad:</strong> puedes obtener tus datos en formato transferible.</li>
              <li><strong>Derecho a oponerme:</strong> puedes rechazar publicidad personalizada.</li>
            </ul>
            <p className="text-gray-400 text-sm mt-4">
              Para ejercer estos derechos, contacta a <a href="mailto:privacy@animeninja.local" className="text-[#FF6B35]">privacy@animeninja.local</a>.
            </p>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">8. Cookies y tecnologías similares</h2>
            <p className="text-gray-300 leading-relaxed">
              Usamos cookies para recordar preferencias, analizar uso y mostrar anuncios relevantes.
              Para más detalles sobre cookies, consulta nuestra <Link to="/cookies-policy" className="text-[#FF6B35] hover:underline">Política de Cookies</Link>.
            </p>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">9. Menores de edad</h2>
            <p className="text-gray-300 leading-relaxed">
              AnimeNinja no está destinado a personas menores de 13 años. No recopilamos información personal de menores de 13 años.
              Si descubrimos que hemos recopilado datos de un menor, eliminaremos esa información inmediatamente.
            </p>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">10. Cambios en esta política</h2>
            <p className="text-gray-300 leading-relaxed">
              Podemos actualizar esta Política de Privacidad en cualquier momento. Te notificaremos cambios significativos por email o publicándolo en el sitio.
            </p>
          </div>

          <div className="p-6 bg-[#13131A] border border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">11. Contacto</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Si tienes preguntas sobre esta Política de Privacidad, contacta a:
            </p>
            <div className="text-gray-400 text-sm space-y-1 mb-4">
              <p><strong>Email:</strong> <a href="mailto:privacy@animeninja.local" className="text-[#FF6B35]">privacy@animeninja.local</a></p>
              <p><strong>Sitio web:</strong> www.animeninja.local</p>
            </div>
            <div className="flex gap-3">
              <Link to="/">
                <Button className="bg-[#FF6B35] hover:bg-[#E85A2A] cursor-pointer">Volver al inicio</Button>
              </Link>
              <Link to="/cookies-policy">
                <Button variant="outline" className="border-gray-700 cursor-pointer">Política de Cookies</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
