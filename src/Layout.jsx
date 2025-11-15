import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import animesData from "@/data/animes.json";
import userDataJson from "@/data/user.json"; // <-- usuario local
import {
  Bell,
  BookOpen,
  Compass,
  Crown,
  Home,
  LogOut,
  Menu,
  Newspaper,
  Search,
  User,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "../src/Components/lib/utils";

export default function Layout({ children }) {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Simular carga de usuario desde JSON
    const loadUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUser(userDataJson);
    };
    loadUser();

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Inicio", path: createPageUrl("Home"), icon: Home },
    { name: "Explorar", path: "/browse", icon: Compass },
    { name: "Manga", path: "/manga", icon: BookOpen },
    { name: "Noticias", path: "#", icon: Newspaper }
  ];

  return (
    <div className="bg-[#0A0A0F] text-white">
      <style>{`
        :root {
          --color-primary: #FF6B35;
          --color-primary-dark: #E85A2A;
          --color-bg: #0A0A0F;
          --color-bg-secondary: #13131A;
          --color-bg-tertiary: #1A1A24;
        }
        
        .glow-orange {
          box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
        }
        
        .glow-orange-strong {
          box-shadow: 0 0 40px rgba(255, 107, 53, 0.5), 0 0 80px rgba(255, 107, 53, 0.2);
        }

        .nav-item-active {
          color: var(--color-primary);
          position: relative;
        }

        .nav-item-active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: var(--color-primary);
          border-radius: 50%;
        }

        .anime-card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .anime-card-hover:hover {
          transform: scale(1.05) translateY(-8px);
        }

        @media (max-width: 768px) {
          .anime-card-hover:hover {
            transform: scale(1.02);
          }
        }
      `}</style>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0F]/95 backdrop-blur-xl shadow-lg"
            : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className="relative">
                <img
                  src="/favicon.ico"
                  alt="AnimeNinja"
                  className="w-10 h-10 rounded-lg object-cover transform group-hover:scale-110 transition-transform glow-orange"
                />
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Anime<span className="text-[#FF6B35]">Ninja</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#FF6B35] ${
                    location.pathname === item.path ? "nav-item-active" : "text-gray-300"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search & User */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar anime..."
                  value={searchQuery}
                  onChange={(e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    if (q.length > 0) {
                      const matches = animesData.filter(a => {
                        const title = (a.title || "").toLowerCase();
                        const titleEng = (a.title_english || "").toLowerCase();
                        return title.includes(q.toLowerCase()) || titleEng.includes(q.toLowerCase());
                      }).slice(0, 6);
                      setSuggestions(matches);
                      setShowSuggestions(true);
                    } else {
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  className="w-64 pl-10 bg-[#13131A] border-gray-700 focus:border-[#FF6B35] rounded-full"
                />
                {/* Suggestions dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute mt-2 w-64 bg-[#0A0A0F] border border-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onMouseDown={(ev) => {
                          // use onMouseDown to avoid losing focus before click
                          ev.preventDefault();
                          navigate(`/anime-details?id=${s.id}`);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-[#13131A] flex items-center gap-3 cursor-pointer"
                      >
                        <img src={s.card_image || s.cover_image} alt={s.title} className="w-10 h-6 object-cover rounded" />
                        <div className="truncate">
                          <div className="text-sm font-medium">{s.title}</div>
                          {s.title_english && <div className="text-xs text-gray-400 truncate">{s.title_english}</div>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {user ? (
                <>
                  <Button variant="ghost" size="icon" className="hidden md:flex hover:text-[#FF6B35] cursor-pointer">
                    <Bell className="w-5 h-5" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full hover:text-[#FF6B35] cursor-pointer">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#13131A] border-gray-700">
                      <div className="px-3 py-2">
                        <p className="font-medium">{user.full_name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          Mi Perfil
                        </Link>
                      </DropdownMenuItem>
                      {!user.is_premium && (
                        <DropdownMenuItem className="text-[#FF6B35]">
                          <Crown className="w-4 h-4 mr-2" />
                          Hazte Premium
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem
                        onClick={() => setUser(null)}
                        className="cursor-pointer text-red-400"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  onClick={() => alert("Redirigir a login")}
                  className="bg-[#FF6B35] hover:bg-[#E85A2A] glow-orange"
                >
                  Iniciar Sesión
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-[#0A0A0F] border-t border-gray-800">
            <div className="px-4 py-4 space-y-3">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Buscar anime..."
                  className="w-full pl-10 bg-[#13131A] border-gray-700 rounded-full"
                />
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-3 py-2 text-gray-300 hover:text-[#FF6B35]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="pt-16 lg:pt-20">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0A0A0F] border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Navegar</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FF6B35]">Populares</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">Simulcasts</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">Calendario</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">Géneros</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Conectar</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FF6B35]">Aplicaciones</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">Manga</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">Juegos</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">Noticias</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FF6B35]">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">Contacto</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Premium</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FF6B35]">Sin Anuncios</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">Acceso Temprano</a></li>
                <li><a href="#" className="hover:text-[#FF6B35]">Calidad HD+</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2024 AnimeNinja. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
