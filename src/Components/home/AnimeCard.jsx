import { Button } from "@/Components/ui/button";
import { Play, Plus, Star } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AnimeCard({ anime, showProgress = false, progress = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/anime-details?id=${anime.id}`}>
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#13131A]">
          <img
            src={anime.card_image}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating Badge */}
          {anime.rating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
              <Star className="w-3 h-3 fill-[#FF6B35] text-[#FF6B35]" />
              <span className="text-xs font-semibold">{anime.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Premium Badge */}
          {anime.is_premium && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold rounded">
              PREMIUM
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <Button
                size="icon"
                className="w-12 h-12 rounded-full bg-[#FF6B35] hover:bg-[#E85A2A] glow-orange"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/watch?anime=${anime.id}`);
                }}
              >
                <Play className="w-5 h-5 fill-current" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="w-12 h-12 rounded-full border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
              <div
                className="h-full bg-[#FF6B35]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
            {anime.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            {anime.episodes_count && (
              <>
                <span>{anime.episodes_count} eps</span>
                <span>•</span>
              </>
            )}
            <span>{anime.year}</span>
            {anime.type && (
              <>
                <span>•</span>
                <span>{anime.type}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}