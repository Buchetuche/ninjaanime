import ContentRow from "@/Components/home/ContentRow";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import animesData from "@/data/animes.json";
import userDataJson from "@/data/user.json";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Check, Clock, Play, Plus, Share2, Star, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AnimeDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('id');
  const [user, setUser] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUser(userDataJson);
      setIsInWatchlist(userDataJson.watchlist?.includes(animeId) || false);
    };
    loadUser();
  }, [animeId]);

  // Obtener anime por id
  const { data: anime, isLoading } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return animesData.find(a => a.id === animeId);
    },
    enabled: !!animeId,
  });

  // Simular episodios (por cada anime, solo 12)
  const { data: episodes } = useQuery({
    queryKey: ['episodes', animeId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return Array.from({ length: Math.min(anime?.episodes_count || 12, 12) }).map((_, i) => ({
        id: `${animeId}-ep${i+1}`,
        anime_id: animeId,
        episode_number: i + 1,
        title: `Episode ${i + 1}`,
        thumbnail: anime?.cover_image
      }));
    },
    enabled: !!anime,
    initialData: [],
  });

  // Animes relacionados (misma primera categoría)
  const { data: relatedAnimes } = useQuery({
    queryKey: ['relatedAnimes', anime?.genres],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (!anime?.genres?.[0]) return [];
      return animesData
        .filter(a => a.id !== animeId && a.genres?.includes(anime.genres[0]))
        .slice(0, 12);
    },
    enabled: !!anime?.genres?.[0],
    initialData: [],
  });

  const toggleWatchlist = () => {
    if (!user) return;
    const newWatchlist = isInWatchlist
      ? (user.watchlist || []).filter(id => id !== animeId)
      : [...(user.watchlist || []), animeId];

    setIsInWatchlist(!isInWatchlist);
    setUser({ ...user, watchlist: newWatchlist });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F]">
        <Skeleton className="w-full h-[60vh] bg-[#13131A]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-96 mb-6 bg-[#13131A]" />
          <Skeleton className="h-32 w-full bg-[#13131A]" />
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Anime no encontrado</h2>
          <Link to="/browse">
            <Button className="bg-[#FF6B35] hover:bg-[#E85A2A]">
              Explorar Anime
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        <img
          src={anime.banner_image || anime.cover_image}
          alt={anime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="hidden lg:block">
            <img
              src={anime.cover_image}
              alt={anime.title}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Title & Actions */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">{anime.title}</h1>
              {anime.title_japanese && (
                <p className="text-xl text-gray-400 mb-4">{anime.title_japanese}</p>
              )}
              
              <div className="flex flex-wrap gap-3 mt-6">
                <Link to={`/watch?anime=${anime.id}`}>
                  <Button size="lg" className="bg-[#FF6B35] hover:bg-[#E85A2A] gap-2 glow-orange-strong cursor-pointer">
                    <Play className="w-5 h-5 fill-current" />
                    Ver Ahora
                  </Button>
                </Link>
                
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 gap-2 cursor-pointer"
                  onClick={toggleWatchlist}
                >
                  {isInWatchlist ? (
                    <>
                      <Check className="w-5 h-5" />
                      En Mi Lista
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Mi Lista
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  className="hover:bg-white/10 gap-2 cursor-pointer"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#FF6B35] rounded flex items-center justify-center font-bold text-lg">
                  {anime.rating?.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
                    <span className="font-semibold">Rating</span>
                  </div>
                  <p className="text-xs text-gray-400">MAL Score</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
                <div>
                  <p className="font-semibold">#{Math.floor(anime.popularity_score || 100)}</p>
                  <p className="text-xs text-gray-400">Popularidad</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#FF6B35]" />
                <div>
                  <p className="font-semibold">{anime.duration} min</p>
                  <p className="text-xs text-gray-400">Por episodio</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#FF6B35]" />
                <div>
                  <p className="font-semibold">{anime.season} {anime.year}</p>
                  <p className="text-xs text-gray-400">Estreno</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid sm:grid-cols-2 gap-4 p-6 bg-[#13131A] rounded-xl">
              <div>
                <p className="text-sm text-gray-400 mb-1">Tipo</p>
                <p className="font-semibold">{anime.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Episodios</p>
                <p className="font-semibold">{anime.episodes_count}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Estado</p>
                <p className="font-semibold">{anime.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Estudio</p>
                <p className="font-semibold">{anime.studio}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-400 mb-1">Demografía</p>
                <p className="font-semibold">{anime.demographics}</p>
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="font-semibold mb-3">Géneros</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres?.map((genre, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-[#13131A] border border-gray-700 rounded-full hover:border-[#FF6B35] transition-colors cursor-pointer"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h3 className="font-semibold mb-3 text-xl">Sinopsis</h3>
              <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
            </div>

            {/* Episodes */}
            {episodes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4 text-xl">Episodios ({episodes.length})</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {episodes.slice(0, 6).map((episode) => (
                    <Link
                      key={episode.id}
                      to={`/watch?anime=${animeId}&episode=${episode.id}`}
                      className="group"
                    >
                      <div className="bg-[#13131A] rounded-lg overflow-hidden hover:bg-[#1A1A24] transition-colors">
                        <div className="relative aspect-video">
                          <img
                            src={episode.thumbnail || anime.cover_image}
                            alt={episode.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-12 h-12 text-white fill-white" />
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-400 mb-1">Episodio {episode.episode_number}</p>
                          <h4 className="font-semibold line-clamp-1">{episode.title}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Anime */}
        {relatedAnimes.length > 0 && (
          <div className="mt-16 pb-16">
            <h2 className="text-2xl font-bold mb-6">Anime Similar</h2>
            <ContentRow animes={relatedAnimes} />
          </div>
        )}
      </div>
    </div>
  );
}