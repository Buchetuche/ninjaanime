import { useEffect, useState } from "react";

/**
 * Hook para precargar imágenes en paralelo
 * @param {string[]} urls - Array de URLs de imágenes a precargar
 * @returns {boolean} - true cuando todas las imágenes se han precargado
 */
export function usePreloadImages(urls = []) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!urls || urls.length === 0) {
      return;
    }

    let isCancelled = false;
    let loadedCount = 0;
    const total = urls.length;

    const images = urls.map((url) => {
      const img = new Image();

      const onLoad = () => {
        loadedCount++;
        if (!isCancelled && loadedCount === total) {
          setLoaded(true);
        }
      };

      const onError = () => {
        loadedCount++;
        if (!isCancelled && loadedCount === total) {
          setLoaded(true);
        }
      };

      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);

      img.src = url;

      return { img, onLoad, onError };
    });

    return () => {
      isCancelled = true;
      images.forEach(({ img, onLoad, onError }) => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      });
    };
  }, [urls]);

  return loaded;
}
