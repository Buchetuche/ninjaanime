import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet";
import { Skeleton } from "@/Components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AnimeCard from "../Components/home/AnimeCard";
import Anime from "../Entities/Anime";

const GENRES = [
  "Acción", "Aventura", "Comedia", "Drama", "Fantasía", "Horror",
  "Misterio", "Romance", "Sci-Fi", "Slice of Life", "Deportes",
  "Sobrenatural", "Thriller", "Mecha", "Música"
];

const DEMOGRAPHICS = ["Shounen", "Shoujo", "Seinen", "Josei", "Kodomo"];

const TYPES = ["TV", "Movie", "OVA", "ONA", "Special"];

const STATUS_OPTIONS = ["En emisión", "Finalizado", "Próximamente"];

export default function BrowsePage() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialQ = urlParams.get('q') || "";
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDemographic, setSelectedDemographic] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const { data: animes, isLoading } = useQuery({
    queryKey: ['animes'],
    queryFn: () => Anime.list('-popularity_score'),
    initialData: [],
  });

  const filteredAndSortedAnimes = useMemo(() => {
    let filtered = [...animes];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(anime =>
        anime.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        anime.title_english?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(anime =>
        selectedGenres.every(genre => anime.genres?.includes(genre))
      );
    }

    // Demographic
    if (selectedDemographic !== "all") {
      filtered = filtered.filter(anime => anime.demographics === selectedDemographic);
    }

    // Type
    if (selectedType !== "all") {
      filtered = filtered.filter(anime => anime.type === selectedType);
    }

    // Status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(anime => anime.status === selectedStatus);
    }

    // Year
    if (yearFilter !== "all") {
      const currentYear = new Date().getFullYear();
      if (yearFilter === "2024") {
        filtered = filtered.filter(anime => anime.year === currentYear);
      } else if (yearFilter === "2023") {
        filtered = filtered.filter(anime => anime.year === currentYear - 1);
      } else if (yearFilter === "old") {
        filtered = filtered.filter(anime => anime.year < currentYear - 1);
      }
    }

    // Sort
    switch (sortBy) {
      case "popularity":
        filtered.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "year":
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [animes, searchQuery, selectedGenres, selectedDemographic, selectedType, selectedStatus, yearFilter, sortBy]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedDemographic("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setYearFilter("all");
  };

  const hasActiveFilters = searchQuery || selectedGenres.length > 0 || 
    selectedDemographic !== "all" || selectedType !== "all" || 
    selectedStatus !== "all" || yearFilter !== "all";

  const FilterContent = () => (
    <div className="space-y-6 text-white">
      {/* Genres */}
      <div>
        <h3 className="font-semibold mb-3">Géneros</h3>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenres.includes(genre) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleGenre(genre)}
              className={selectedGenres.includes(genre) ? "bg-[#FF6B35] hover:bg-[#E85A2A]" : "cursor-pointer hover:bg-[#E85A2A]"}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      {/* Demographic */}
      <div>
        <h3 className="font-semibold mb-3">Demografía</h3>
        <Select value={selectedDemographic} onValueChange={setSelectedDemographic}>
          <SelectTrigger className="bg-[#13131A] border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#13131A] border-gray-700 text-white">
            <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" value="all">Todas</SelectItem>
            {DEMOGRAPHICS.map(demo => (
              <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" key={demo} value={demo}>{demo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type */}
      <div>
        <h3 className="font-semibold mb-3">Tipo</h3>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="bg-[#13131A] border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#13131A] border-gray-700 text-white">
            <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" value="all">Todos</SelectItem>
            {TYPES.map(type => (
              <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div>
        <h3 className="font-semibold mb-3">Estado</h3>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="bg-[#13131A] border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#13131A] border-gray-700 text-white">
            <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" value="all">Todos</SelectItem>
            {STATUS_OPTIONS.map(status => (
              <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div>
        <h3 className="font-semibold mb-3">Año</h3>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="bg-[#13131A] border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#13131A] border-gray-700 text-white">
            <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" value="all">Todos</SelectItem>
            <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" value="2024">2024</SelectItem>
            <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" value="2023">2023</SelectItem>
            <SelectItem className="cursor-pointer hover:bg-[#FF6B35]" value="old">Anteriores</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Explorar Anime</h1>
          <p className="text-gray-400">Descubre tu próxima serie favorita</p>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar anime por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#13131A] border-gray-700 focus:border-[#FF6B35] h-12"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-[#13131A] border-gray-700 h-12">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-[#13131A] border-gray-700 text-white">
                <SelectItem value="popularity">Popularidad</SelectItem>
                <SelectItem value="rating">Calificación</SelectItem>
                <SelectItem value="year">Año</SelectItem>
                <SelectItem value="title">Título</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 border-gray-700 h-12">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-[#FF6B35] rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#0A0A0F] border-gray-800 overflow-y-auto text-white">
                <SheetHeader>
                  <SheetTitle>Filtros Avanzados</SheetTitle>
                  <SheetDescription>
                    Personaliza tu búsqueda de anime
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-400">Filtros activos:</span>
            {selectedGenres.map(genre => (
              <Button
                key={genre}
                variant="secondary"
                size="sm"
                onClick={() => toggleGenre(genre)}
                className="gap-1 cursor-pointer hover:bg-[#E85A2A]"
              >
                {genre}
                <X className="w-3 h-3" />
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-[#FF6B35] cursor-pointer"
            >
              Limpiar todo
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {filteredAndSortedAnimes.length} resultados encontrados
          </p>
        </div>

        {/* Anime Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(18)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg bg-[#13131A]" />
            ))}
          </div>
        ) : filteredAndSortedAnimes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredAndSortedAnimes.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#13131A] rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-400 mb-4">Intenta ajustar tus filtros de búsqueda</p>
            <Button onClick={clearFilters} className="bg-[#FF6B35] hover:bg-[#E85A2A]">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}