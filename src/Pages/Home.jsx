import { Skeleton } from "@/Components/ui/skeleton";
import animesData from "@/data/animes.json";
import userDataJson from "@/data/user.json";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Crown, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ContentRow from "../Components/home/ContentRow";
import HeroBanner from "../Components/home/HeroBanner";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(1);
  const featuredRef = useRef(featuredIndex);

  const [transitionMs, setTransitionMs] = useState(700);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [incomingOffset, setIncomingOffset] = useState(100);
  const [nextIndex, setNextIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Simular carga de usuario
  useEffect(() => {
    const loadUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUser(userDataJson);
    };
    loadUser();
  }, []);

  // Cargar animes
  const { data: animes, isLoading } = useQuery({
    queryKey: ['animes'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return [...animesData].sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
    },
    initialData: [],
  });

  // Auto-rotar destacados
  useEffect(() => {
    featuredRef.current = featuredIndex;
  }, [featuredIndex]);

  useEffect(() => {
    if (!animes || animes.length === 0) return;

    const startTransition = () => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      const current = featuredRef.current;
      const next = (current + 1) % animes.length;
      setNextIndex(next);

      // Prepare positions
      setTransitionMs(700);
      setCurrentOffset(0);
      setIncomingOffset(100);

      // Allow paint then animate both simultaneously
      const kick = setTimeout(() => {
        setCurrentOffset(-100);
        setIncomingOffset(0);
      }, 50);

      // After animation completes, finalize state
      const finish = setTimeout(() => {
        setFeaturedIndex(next);
        setCurrentOffset(0);
        setIncomingOffset(100);
        setNextIndex(null);
        setIsTransitioning(false);
        setTransitionMs(0);
      }, 50 + 700 + 30);

      return () => {
        clearTimeout(kick);
        clearTimeout(finish);
      };
    };

    const interval = setInterval(startTransition, 10000);
    return () => clearInterval(interval);
  }, [animes, isTransitioning]);


  

  // Historial de usuario
  const { data: watchHistory } = useQuery({
    queryKey: ['watchHistory', user?.email],
    queryFn: async () => {
      if (!user) return [];
      await new Promise(resolve => setTimeout(resolve, 200));
      return [...user.watchHistory].sort(
        (a, b) => new Date(b.last_watched) - new Date(a.last_watched)
      ).slice(0, 10);
    },
    enabled: !!user,
    initialData: [],
  });

  const continueWatchingIds = [...new Set(watchHistory?.map(h => h.anime_id))];
  const continueWatchingAnimes = continueWatchingIds
    .map(id => animes.find(a => a.id === id))
    .filter(Boolean)
    .slice(0, 10);

  const simulcastAnimes = animes.filter(a => a.is_simulcast).slice(0, 12);

  const recommendedAnimes = user?.favorite_genres?.length > 0
    ? animes.filter(a => a.genres?.some(g => user.favorite_genres.includes(g))).slice(0, 12)
    : animes.slice(0, 12);

  const trendingAnimes = animes.filter(a => a.rating >= 8).slice(0, 12);

  const currentYear = new Date().getFullYear();
  const newReleases = animes.filter(a => a.year >= currentYear - 1).slice(0, 12);

  const premiumAnimes = animes.filter(a => a.is_premium).slice(0, 12);

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F]">
        <Skeleton className="w-full h-[90vh] bg-[#13131A]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {[1, 2, 3].map(i => (
            <div key={i}>
              <Skeleton className="h-8 w-48 mb-4 bg-[#13131A]" />
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(j => (
                  <Skeleton key={j} className="w-[200px] h-[300px] bg-[#13131A]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <HeroBanner
        currentAnime={animes[featuredIndex]}
        incomingAnime={nextIndex != null ? animes[nextIndex] : null}
        currentOffset={currentOffset}
        incomingOffset={incomingOffset}
        transitionMs={transitionMs}
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="space-y-12 pb-20">

          {user && continueWatchingAnimes.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#FF6B35]" />
                <h2 className="text-2xl font-bold">Continuar Viendo</h2>
              </div>
              <ContentRow animes={continueWatchingAnimes} showProgress={true} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src={animes[1]?.card_image}
                alt={animes[1]?.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-[#FF6B35]" />
                  <span className="text-sm font-semibold text-[#FF6B35]">DESTACADO</span>
                </div>
                <h3 className="text-3xl font-bold mb-2 text-white">{animes[1]?.title}</h3>
                <p className="text-gray-300 line-clamp-2 mb-4">{animes[1]?.synopsis}</p>
                <div className="flex flex-wrap gap-2">
                  {animes[1]?.genres?.slice(0, 3).map((genre, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {animes.slice(2, 4).map((anime) => (
                <div key={anime.id} className="relative h-[191px] rounded-xl overflow-hidden group cursor-pointer">
                  <img
                    src={anime.card_image}
                    alt={anime.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="font-bold line-clamp-1 text-white">{anime.title}</h4>
                    <p className="text-xs text-gray-300 mt-1">{anime.episodes_count} episodios</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended For You */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-2xl font-bold">Recomendado para ti</h2>
            </div>
            <ContentRow animes={recommendedAnimes} />
          </div>

          {/* Simulcasts */}
          {simulcastAnimes.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-[#FF6B35]" />
                <h2 className="text-2xl font-bold">Simulcasts - Nuevos Episodios</h2>
              </div>
              <ContentRow animes={simulcastAnimes} />
            </div>
          )}

          {/* Trending Now */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-2xl font-bold">Tendencias Ahora</h2>
            </div>
            <ContentRow animes={trendingAnimes} />
          </div>

          {/* New Releases */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-2xl font-bold">Últimos Estrenos</h2>
            </div>
            <ContentRow animes={newReleases} />
          </div>

          {/* Premium Content */}
          {premiumAnimes.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/20">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-8 h-8 text-amber-400" />
                <div>
                  <h2 className="text-2xl font-bold">Contenido Premium</h2>
                  <p className="text-gray-400 text-sm">Mira sin anuncios en calidad HD+</p>
                </div>
              </div>
              <ContentRow animes={premiumAnimes} />
            </div>
          )}
      </div>
    </div>
  );
}
