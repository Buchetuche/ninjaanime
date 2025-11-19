import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import animesData from "@/data/animes.json";
import userDataJson from "@/data/user.json";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronLeft,
  Maximize,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Volume2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "@/Components/lib/ScrollToTop";

export default function WatchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const animeId = urlParams.get('anime');
  const episodeId = urlParams.get('episode');
  
  const [user, setUser] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [showEpisodeList, setShowEpisodeList] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      try {
        setUser(userDataJson);
      } catch (err) {
        console.log("No se pudo cargar usuario local", err);
      }
    };
    loadUser();
  }, []);

  const { data: anime } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return animesData.find(a => a.id === animeId);
    },
    enabled: !!animeId,
  });

  const { data: episodes } = useQuery({
    queryKey: ['episodes', animeId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const anime = animesData.find(a => a.id === animeId);
      if (!anime) return [];
      return Array.from({ length: anime.episodes_count || 12 }).map((_, i) => ({
        id: `${animeId}-ep${i + 1}`,
        anime_id: animeId,
        episode_number: i + 1,
        title: `Episodio ${i + 1}`,
        thumbnail: anime.card_image,
        synopsis: anime.synopsis,
      }));
    },
    enabled: !!animeId,
    initialData: [],
  });

  useEffect(() => {
    if (episodes.length > 0) {
      if (episodeId) {
        const ep = episodes.find(e => e.id === episodeId);
        setCurrentEpisode(ep || episodes[0]);
      } else {
        setCurrentEpisode(episodes[0]);
      }
    }
  }, [episodes, episodeId]);

  const handleEpisodeChange = (episode) => {
    setCurrentEpisode(episode);
    window.history.pushState({}, '', `/watch?anime=${animeId}&episode=${episode.id}`);
  };

  const goToNextEpisode = () => {
    const currentIndex = episodes.findIndex(e => e.id === currentEpisode.id);
    if (currentIndex < episodes.length - 1) {
      handleEpisodeChange(episodes[currentIndex + 1]);
    }
  };

  const goToPreviousEpisode = () => {
    const currentIndex = episodes.findIndex(e => e.id === currentEpisode.id);
    if (currentIndex > 0) {
      handleEpisodeChange(episodes[currentIndex - 1]);
    }
  };

  if (!anime || !currentEpisode) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Skeleton className="w-full h-[60vh] bg-[#13131A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <ScrollToTop duration={700} />
      <div className="max-w-[1920px] mx-auto">
        {/* Video Player */}
        <div className="relative bg-black aspect-video">
          {/* Placeholder Video Player */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <img
              src={currentEpisode.thumbnail || anime.card_image}
              alt={currentEpisode.title}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Play className="w-20 h-20 text-white mb-4 opacity-70" />
              <p className="text-white text-lg opacity-70">Video Player - Episodio {currentEpisode.episode_number}</p>
            </div>
          </div>

          {/* Player Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button size="icon" variant="ghost" className="text-white">
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button size="icon" className="bg-[#FF6B35] hover:bg-[#E85A2A] w-12 h-12">
                  <Play className="w-6 h-6 fill-current" />
                </Button>
                <Button size="icon" variant="ghost" className="text-white">
                  <SkipForward className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-white">
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button size="icon" variant="ghost" className="text-white">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-white">
                  <Maximize className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-[#FF6B35]" />
            </div>
          </div>

          {/* Back Button */}
          <Link to={`/anime-details?id=${animeId}`}>
            <Button
              variant="ghost"
              className="absolute top-4 left-4 text-white gap-2 bg-black/50 backdrop-blur-sm hover:bg-black/70 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              Volver
            </Button>
          </Link>
        </div>

        {/* Content Below Player */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Episode Info */}
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {anime.title} - Episodio {currentEpisode.episode_number}
                </h1>
                <h2 className="text-xl text-gray-400 mb-4">{currentEpisode.title}</h2>
                <p className="text-gray-300 leading-relaxed">
                  {currentEpisode.synopsis || anime.synopsis}
                </p>
              </div>

              {/* Episode Navigation */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousEpisode}
                  disabled={episodes[0]?.id === currentEpisode.id}
                  className="flex-1"
                >
                  <SkipBack className="w-4 h-4 mr-2 cursor-pointer" />
                  Episodio Anterior
                </Button>
                <Button
                  onClick={goToNextEpisode}
                  disabled={episodes[episodes.length - 1]?.id === currentEpisode.id}
                  className="flex-1 bg-[#FF6B35] hover:bg-[#E85A2A] cursor-pointer"
                >
                  Siguiente Episodio
                  <SkipForward className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Premium Upsell */}
              {!user?.is_premium && (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">👑</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">Mejora tu experiencia</h3>
                      <p className="text-gray-300 mb-4">
                        Disfruta sin anuncios, calidad HD+ y acceso temprano a simulcasts
                      </p>
                      <Button className="bg-[#FF6B35] hover:bg-[#E85A2A]">
                        Hazte Premium
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Episode List Sidebar */}
            <div className="bg-[#13131A] rounded-xl p-4">
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowEpisodeList(!showEpisodeList)}
              >
                <h3 className="font-semibold">Episodios ({episodes.length})</h3>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    showEpisodeList ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {showEpisodeList && (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {episodes.map((episode) => (
                    <button
                      key={episode.id}
                      onClick={() => handleEpisodeChange(episode)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        episode.id === currentEpisode.id
                          ? 'bg-[#FF6B35] text-white'
                          : 'bg-[#1A1A24] hover:bg-[#202030]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-10 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={episode.thumbnail || anime.card_image}
                            alt={episode.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold line-clamp-1">
                            Ep {episode.episode_number}
                          </p>
                          <p className="text-xs opacity-70 line-clamp-1">
                            {episode.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}