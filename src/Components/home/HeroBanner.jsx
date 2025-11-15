import { Button } from "@/Components/ui/button";
import { Info, Play, Plus, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Slide({ anime, offset, transitionMs, onImageLoad }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  if (!anime) return null;

  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `translateX(${offset}%)`,
        transition: `transform ${transitionMs}ms ease-out`,
      }}
    >
      <img
        src={anime.banner_image}
        alt={anime.title}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => {
          setImageLoaded(true);
          onImageLoad && onImageLoad();
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />

      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            {anime.is_simulcast && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B35]/20 border border-[#FF6B35] rounded-full backdrop-blur-sm glow-orange">
                <span className="w-2 h-2 bg-[#FF6B35] rounded-full animate-pulse" />
                <span className="text-sm font-medium text-[#FF6B35]">SIMULCAST</span>
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                {anime.title}
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FF6B35] rounded flex items-center justify-center font-bold">
                  {anime.rating?.toFixed(1)}
                </div>
                <span>Rating</span>
              </div>
              <span className="text-gray-500">•</span>
              <span>{anime.year}</span>
              <span className="text-gray-500">•</span>
              <span>{anime.episodes_count} episodios</span>
              <span className="text-gray-500">•</span>
              <span className="px-2 py-1 bg-white/10 rounded text-xs">{anime.demographics}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {anime.genres?.slice(0, 4).map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs text-white"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-base lg:text-lg leading-relaxed line-clamp-3 max-w-xl">
              {anime.synopsis}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to={`/watch?anime=${anime.id}`}>
                <Button
                  size="lg"
                  className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white px-8 gap-2 glow-orange-strong text-base font-semibold cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Ver Ahora
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 gap-2 text-white cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                Mi Lista
              </Button>

              <Link to={`/anime-details?id=${anime.id}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 gap-2 text-white cursor-pointer"
                >
                  <Info className="w-5 h-5" />
                  Más Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroBanner({ currentAnime, incomingAnime = null, currentOffset = 0, incomingOffset = 100, transitionMs = 700 }) {
  const [muted, setMuted] = useState(true);

  if (!currentAnime) return null;

  return (
    <div className="relative w-full h-[85vh] lg:h-[90vh] overflow-hidden">
      <Slide anime={currentAnime} offset={currentOffset} transitionMs={transitionMs} />
      {incomingAnime && <Slide anime={incomingAnime} offset={incomingOffset} transitionMs={transitionMs} />}

      {currentAnime.is_premium && (
        <div className="absolute top-24 right-4 lg:right-8 z-20 bg-gradient-to-br from-amber-400 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
          <span className="text-lg">👑</span>
          PREMIUM
        </div>
      )}

      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-8 right-4 lg:right-8 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}