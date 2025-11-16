import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import AnimeCard from "./AnimeCard";

export default function ContentRow({ title, animes, showProgress = false }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  if (!animes || animes.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl lg:text-2xl font-bold">{title}</h2>
        <button className="text-sm text-[#FF6B35] hover:underline">
          Ver todo
        </button>
      </div>

      <div className="relative group/row">
        {/* Scroll Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 backdrop-blur-sm hover:bg-black/90 opacity-0 group-hover/row:opacity-100 transition-opacity rounded-full cursor-pointer"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/70 backdrop-blur-sm hover:bg-black/90 opacity-0 group-hover/row:opacity-100 transition-opacity rounded-full cursor-pointer"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-14 h-14 text-white" />
        </Button>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {animes.map((anime) => (
            <div key={anime.id} className="flex-none w-[150px] sm:w-[180px] lg:w-[200px]">
              <AnimeCard anime={anime} showProgress={showProgress} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}