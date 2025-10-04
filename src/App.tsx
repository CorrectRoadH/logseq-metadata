import React, { useEffect, useRef, useState, useTransition } from "react";
import { useAppVisible } from "./utils";

interface ExternalResource {
  url: string;
}

interface LocalizedText {
  lang: string;
  text: string;
}

type ItemType = 'book' | 'music' | 'tv' | 'movie' | 'other';

interface Item {
  id: string;
  type: ItemType;
  uuid: string;
  url: string;
  api_url: string;
  category: string;
  display_title: string;
  external_resources: ExternalResource[];
  title: string;
  description: string;
  localized_title: LocalizedText[];
  localized_description: LocalizedText[];
  cover_image_url: string;
  rating: number | null;
  rating_count: number;
  brief: string;
  subtitle: string | null;
  orig_title: string;
  author: string[];
  actor: string[];
  translator: string[];
  language: string[];
  pub_house: string;
  pub_year?: number;
  year?: number;
  pub_month: number;
  binding: string;
  price: string;
  pages: number;
  series: string | null;
  imprint: string | null;
  isbn: string;
}

// Utility function to sanitize user input
function sanitizeInput(input: string): string {
  return input.trim().slice(0, 200); // Limit length and trim whitespace
}

// Utility function to validate URL
function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function Item({ item }: { item: Item }) {
  const imageUrl = isValidImageUrl(item.cover_image_url) ? item.cover_image_url : '';

  return (
    <div className="item flex flex-row gap-4 p-4 border rounded-lg shadow-md bg-white">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={item.display_title}
          className="item-cover w-32 h-48 object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <div className="item-details flex flex-col justify-between flex-grow">
        <h2 className="text-xl font-bold">{item.display_title}</h2>
        <p className="text-lg">{item.localized_title?.find((t) => t.lang === 'zh-cn')?.text || item.title}</p>
        <p>Rating: <span className="font-semibold">{item.rating ?? 'N/A'}</span> ({item.rating_count} reviews)</p>
        <p>Year: {item.pub_year || item.year || 'N/A'}</p>
        <p>
          {item.author && item.author.length > 0 && (
            <>Author: {item.author.join(', ')}</>
          )}
          {item.actor && item.actor.length > 0 && (
            <>{item.author && item.author.length > 0 ? ' | ' : ''}Actor: {item.actor.join(', ')}</>
          )}
          {!item.author?.length && !item.actor?.length && 'Unknown'}
        </p>
        <p className="item-brief text-sm text-gray-600 mt-2">{item.brief}</p>
      </div>
      <div className="flex items-end ml-auto">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          aria-label={`Insert metadata for ${item.display_title}`}
          onClick={async () => {
            const template = logseq.settings?.metadata_template || '';
            console.log(logseq.settings);
            await logseq.Editor.insertAtEditingCursor(
              template
                .replace('$TYPE', item.category || '')
                .replace('$COVER', imageUrl || '')
                .replace('$AUTHOR', item.author?.map(a => `[[${a}]]`).join(', ') || '')
                .replace('$ACTOR', item.actor?.map(a => `[[${a}]]`).join(', ') || '')
                .replace('$YEAR', item.pub_year?.toString() || item.year?.toString() || '')
            );
          }}
        >
          Insert
        </button>
      </div>
    </div>
  );
}

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const visible = useAppVisible();
  const [input, setInput] = useState('');
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (visible) {
      logseq.Editor.getCurrentPage().then((page) => {
        if (page?.name) {
          setInput(page.name);
        }
      });
      // Focus input when dialog opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  useEffect(() => {
    const fetchItems = async () => {
      const sanitizedInput = sanitizeInput(input);
      if (!sanitizedInput) {
        setItem([]);
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await fetch(
          `https://neodb.social/api/catalog/search?query=${encodeURIComponent(sanitizedInput)}&page=1`,
          {
            signal: AbortSignal.timeout(10000), // 10 second timeout
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        startTransition(() => {
          setItem(data.data || []);
          setLoading(false);
        });
      } catch (error) {
        console.error('Error fetching data from neodb:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
        setItem([]);
        setLoading(false);
      }
    };

    if (input) {
      setLoading(true);
      // Debounce: delay API call by 500ms
      const timeoutId = setTimeout(() => {
        fetchItems();
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setItem([]);
      setError(null);
    }
  }, [input]);

  if (visible) {
    return (
      <main
        className="backdrop-filter backdrop-blur-md fixed inset-0 flex flex-col items-center"
        onClick={(e) => {
          if (!innerRef.current?.contains(e.target as Node)) {
            window.logseq.hideMainUI();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            window.logseq.hideMainUI();
          }
        }}
        tabIndex={-1}
        role="dialog"
        aria-label="Search metadata"
      >
        <div ref={innerRef} className="text-size-2em fixed top-0 left-1/2 transform -translate-x-1/2 mt-4">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for books, movies, music..."
            aria-label="Search query"
            className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-4 max-h-[calc(100vh-80px)] overflow-y-auto p-4 mt-16">
          {error ? (
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error: {error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setInput(input + ' '); // Trigger re-fetch
                  setTimeout(() => setInput(input.trim()), 0);
                }}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                aria-label="Retry search"
              >
                Retry
              </button>
            </div>
          ) : loading || isPending ? (
            <div className="text-center">
              <p className="animate-pulse">Loading...</p>
            </div>
          ) : item.length > 0 ? (
            item.map((item: Item) => (
              <Item key={item.id} item={item} />
            ))
          ) : input ? (
            <div className="text-center">
              <p>No results found</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>Enter a search query to get started</p>
            </div>
          )}
        </div>
      </main>
    );
  }
  return null;
}

export default App;