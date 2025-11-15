import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import mangasData from "../data/mangas.json";

const GENRES = [
  "Acción", "Aventura", "Comedia", "Drama", "Fantasía", "Horror",
  "Misterio", "Romance", "Sci-Fi", "Slice of Life", "Deportes",
  "Sobrenatural", "Thriller", "Mecha", "Música"
];

const DEMOGRAPHICS = ["Shounen", "Shoujo", "Seinen", "Josei", "Kodomo"];

const STATUS_OPTIONS = ["En publicación", "Finalizado", "En pausa"];

export default function MangaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedDemographic, setSelectedDemographic] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const { data: mangas, isLoading } = useQuery({
    queryKey: ['mangas'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mangasData;
    },
    initialData: [],
  });

  const filteredAndSortedMangas = useMemo(() => {
    let filtered = [...mangas];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(manga =>
        manga.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        manga.title_english?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(manga =>
        selectedGenres.every(genre => manga.genres?.includes(genre))
      );
    }

    // Demographic
    if (selectedDemographic !== "all") {
      filtered = filtered.filter(manga => manga.demographics === selectedDemographic);
    }

    // Status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(manga => manga.status === selectedStatus);
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
  }, [mangas, searchQuery, selectedGenres, selectedDemographic, selectedStatus, sortBy]);

  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedDemographic("all");
    setSelectedStatus("all");
  };

  const hasActiveFilters = searchQuery || selectedGenres.length > 0 || 
    selectedDemographic !== "all" || selectedStatus !== "all";

  const FilterContent = () => (
    <div className="space-y-6">
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
              className={selectedGenres.includes(genre) ? "bg-[#FF6B35] hover:bg-[#E85A2A]" : ""}
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
          <SelectContent className="bg-[#13131A] border-gray-700">
            <SelectItem value="all">Todas</SelectItem>
            {DEMOGRAPHICS.map(demo => (
              <SelectItem key={demo} value={demo}>{demo}</SelectItem>
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
          <SelectContent className="bg-[#13131A] border-gray-700">
            <SelectItem value="all">Todos</SelectItem>
            {STATUS_OPTIONS.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
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
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-[#FF6B35]" />
            <h1 className="text-3xl lg:text-4xl font-bold">Biblioteca de Manga</h1>
          </div>
          <p className="text-gray-400">Lee los mejores mangas en línea</p>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar manga por título..."
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
              <SelectContent className="bg-[#13131A] border-gray-700">
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
              <SheetContent className="bg-[#0A0A0F] border-gray-800 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros Avanzados</SheetTitle>
                  <SheetDescription>
                    Personaliza tu búsqueda de manga
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
                className="gap-1"
              >
                {genre}
                <X className="w-3 h-3" />
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-[#FF6B35]"
            >
              Limpiar todo
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {filteredAndSortedMangas.length} resultados encontrados
          </p>
        </div>

        {/* Manga Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(18)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg bg-[#13131A]" />
            ))}
          </div>
        ) : filteredAndSortedMangas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredAndSortedMangas.map((manga) => (
              <div
                key={manga.id}
                className="relative group anime-card-hover cursor-pointer"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#13131A]">
                  <img
                    src={manga.card_image}
                    alt={manga.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Rating Badge */}
                  {manga.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full">
                      <Star className="w-3 h-3 fill-[#FF6B35] text-[#FF6B35]" />
                      <span className="text-xs font-semibold">{manga.rating.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Premium Badge */}
                  {manga.is_premium && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold rounded">
                      PREMIUM
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button className="bg-[#FF6B35] hover:bg-[#E85A2A] glow-orange gap-2 cursor-pointer">
                      <BookOpen className="w-4 h-4" />
                      Leer Ahora
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 space-y-1">
                  <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-[#FF6B35] transition-colors">
                    {manga.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {manga.chapters_count && (
                      <>
                        <span>{manga.chapters_count} caps</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{manga.year}</span>
                    {manga.status && (
                      <>
                        <span>•</span>
                        <span>{manga.status}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-[#13131A] rounded-full flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-gray-600" />
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