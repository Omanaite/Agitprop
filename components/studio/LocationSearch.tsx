"use client";

import { useEffect, useRef, useState } from "react";

type NominatimResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

type Props = {
  locationName: string;
  locationLink: string;
  onChange: (name: string, link: string) => void;
};

/**
 * LocationSearch — Nominatim geocoding input
 *
 * Reemplaza los dos inputs separados (location_link + location_name).
 * El artista escribe un lugar → dropdown con resultados → al seleccionar
 * guarda el nombre legible y el link a Google Maps.
 *
 * API: Nominatim (OpenStreetMap) — free, no API key.
 * Rate limit: 1 req/s — el debounce de 400ms lo respeta.
 */
export function LocationSearch({ locationName, locationLink, onChange }: Props) {
  const [query, setQuery] = useState(locationName);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincroniza si el padre resetea el valor (ej. al abrir un item diferente)
  useEffect(() => {
    setQuery(locationName);
  }, [locationName]);

  // Cierra el dropdown al click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    // Si el usuario borra el campo, limpia también los valores guardados
    if (!value.trim()) {
      onChange("", "");
      setResults([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (value.trim().length < 3) return;
      setLoading(true);
      setFetchError(false);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&addressdetails=0`,
          { headers: { "Accept-Language": "de,en" } }
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }, 400);
  }

  function handleSelect(result: NominatimResult) {
    // Nombre corto: primeras 2 partes del display_name (ciudad, país)
    const parts = result.display_name.split(", ");
    const shortName = parts.slice(0, 2).join(", ");
    const mapsLink = `https://www.google.com/maps?q=${result.lat},${result.lon}`;

    setQuery(shortName);
    setOpen(false);
    onChange(shortName, mapsLink);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setOpen(false);
    setFetchError(false);
    onChange("", "");
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          className="admin-input pr-8"
          placeholder="Location — type to search (optional)"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-40 hover:opacity-100"
            aria-label="Clear location"
          >
            ✕
          </button>
        )}
      </div>

      {fetchError && (
        <p className="mt-1 text-xs text-[var(--admin-error,#e53e3e)]">Could not reach location search. Try again.</p>
      )}

      {/* Indicador de link guardado */}
      {locationLink && !open && (
        <p className="mt-1 text-xs opacity-40 truncate">
          ↗{" "}
          <a href={locationLink} target="_blank" rel="noopener noreferrer" className="underline">
            {locationLink}
          </a>
        </p>
      )}

      {/* Dropdown */}
      {open && (
        <ul className="absolute z-50 w-full mt-1 border border-[var(--admin-border)] bg-[var(--admin-surface-strong)] text-[var(--admin-title)] text-xs shadow-[var(--admin-shadow)] max-h-48 overflow-y-auto">
          {loading && (
            <li className="px-3 py-2 opacity-40">Searching…</li>
          )}
          {!loading && results.map((r) => (
            <li key={r.place_id}>
              <button
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-[var(--admin-accent)] hover:text-white transition-colors truncate"
                onClick={() => handleSelect(r)}
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
