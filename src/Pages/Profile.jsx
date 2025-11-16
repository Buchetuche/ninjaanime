import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Clock, Crown, Heart, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import AnimeCard from "../Components/home/AnimeCard";
import WatchHistory from "../Entities/WatchHistory";

const GENRES = [
  "Acción", "Aventura", "Comedia", "Drama", "Fantasía", "Horror",
  "Misterio", "Romance", "Sci-Fi", "Slice of Life", "Deportes",
  "Sobrenatural", "Thriller", "Mecha", "Música"
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    favorite_genres: [],
    preferred_language: 'Sub',
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
        setFormData({
          full_name: userData.full_name || '',
          favorite_genres: userData.favorite_genres || [],
          preferred_language: userData.preferred_language || 'Sub',
        });
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: animes } = useQuery({
    queryKey: ['animes'],
    queryFn: () => base44.entities.Anime.list(),
    initialData: [],
  });

  const { data: watchHistory } = useQuery({
    queryKey: ['watchHistory', user?.email],
    queryFn: () => user ? WatchHistory.filter({ user_email: user.email }, '-last_watched') : [],
    enabled: !!user,
    initialData: [],
  });

  const favoriteAnimes = user?.favorite_anime
    ?.map(id => animes.find(a => a.id === id))
    .filter(Boolean) || [];

  const watchlistAnimes = user?.watchlist
    ?.map(id => animes.find(a => a.id === id))
    .filter(Boolean) || [];

  const continueWatchingIds = [...new Set(watchHistory?.map(h => h.anime_id))];
  const continueWatchingAnimes = continueWatchingIds
    .map(id => animes.find(a => a.id === id))
    .filter(Boolean)
    .slice(0, 12);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await base44.auth.updateMe(formData);
    setUser({ ...user, ...formData });
    setIsEditing(false);
  };

  const toggleGenre = (genre) => {
    setFormData(prev => ({
      ...prev,
      favorite_genres: prev.favorite_genres.includes(genre)
        ? prev.favorite_genres.filter(g => g !== genre)
        : [...prev.favorite_genres, genre]
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Cargando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#13131A] to-[#1A1A24] rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] flex items-center justify-center text-3xl font-bold">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{user.full_name}</h1>
                {user.is_premium && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black rounded-full text-sm font-bold">
                    <Crown className="w-4 h-4" />
                    Premium
                  </div>
                )}
              </div>
              <p className="text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#FF6B35]" />
                  <span>{user.favorite_anime?.length || 0} Favoritos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF6B35]" />
                  <span>{watchHistory?.length || 0} Vistas</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-[#13131A] rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Editar Perfil</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="full_name">Nombre</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="bg-[#1A1A24] border-gray-700 mt-2"
                />
              </div>

              <div>
                <Label>Géneros Favoritos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {GENRES.map((genre) => (
                    <Button
                      key={genre}
                      type="button"
                      variant={formData.favorite_genres.includes(genre) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleGenre(genre)}
                      className={formData.favorite_genres.includes(genre) ? "bg-[#FF6B35] hover:bg-[#E85A2A]" : ""}
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferencia de Idioma</Label>
                <div className="flex gap-2 mt-2">
                  {['Sub', 'Dub', 'Ambos'].map((lang) => (
                    <Button
                      key={lang}
                      type="button"
                      variant={formData.preferred_language === lang ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, preferred_language: lang })}
                      className={formData.preferred_language === lang ? "bg-[#FF6B35] hover:bg-[#E85A2A]" : ""}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E85A2A]">
                Guardar Cambios
              </Button>
            </form>
          </div>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue="continue" className="space-y-6">
          <TabsList className="bg-[#13131A]">
            <TabsTrigger value="continue">Continuar Viendo</TabsTrigger>
            <TabsTrigger value="watchlist">Mi Lista</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          </TabsList>

          <TabsContent value="continue" className="space-y-4">
            {continueWatchingAnimes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {continueWatchingAnimes.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} showProgress={true} progress={65} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#13131A] rounded-xl">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No hay anime en progreso</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-4">
            {watchlistAnimes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {watchlistAnimes.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#13131A] rounded-xl">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">Tu lista está vacía</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            {favoriteAnimes.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {favoriteAnimes.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#13131A] rounded-xl">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No tienes favoritos aún</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Premium Upgrade */}
        {!user.is_premium && (
          <div className="mt-12 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-10 h-10 text-amber-400" />
                  <h2 className="text-3xl font-bold">Hazte Premium</h2>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF6B35] rounded-full" />
                    <span>Mira sin anuncios</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF6B35] rounded-full" />
                    <span>Calidad HD+ y 4K</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF6B35] rounded-full" />
                    <span>Acceso temprano a simulcasts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#FF6B35] rounded-full" />
                    <span>Descargas offline</span>
                  </li>
                </ul>
                <Button size="lg" className="bg-[#FF6B35] hover:bg-[#E85A2A]">
                  Actualizar Ahora
                </Button>
              </div>
              <div className="text-6xl">🎬</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}