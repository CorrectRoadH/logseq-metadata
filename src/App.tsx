import React, { useEffect, useRef, useState } from "react";
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
  parent_uuid: string | null;
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

function Item({ item }: { item: Item }) {
  return (
    <div className="item flex flex-row gap-4 p-4 border rounded-lg shadow-md bg-white">
      <img 
        src={item.cover_image_url} 
        alt={item.display_title} 
        className="item-cover w-32 h-48 object-cover rounded"
      />
      <div className="item-details flex flex-col justify-between">
        <h2 className="text-xl font-bold">{item.display_title}</h2>
        <p className="text-lg">{item.localized_title?.find((t) => t.lang === 'zh-cn')?.text || item.title}</p>
        <p>Rating: <span className="font-semibold">{item.rating}</span> ({item.rating_count} reviews)</p>
        <p>Year: {item.pub_year||item.year}</p>
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
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={async () => {
          await logseq.Editor.insertAtEditingCursor(
            `type:: ${item.category}
cover:: ${item.cover_image_url}
${item.author?.length ? `author:: ${item.author.map(a => `[[${a}]]`).join(', ')}\n` : ''}${item.actor?.length ? `actor:: ${item.actor.map(a => `[[${a}]]`).join(', ')}\n` : ''}year:: [[${item.pub_year||item.year}]]
tags::
`
          );    
        }}
      >
        Insert
      </button>
    </div>
  );
}

function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();
  const [input, setInput] = useState(''); // Initialize with an empty string
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    logseq.Editor.getCurrentPage().then((page) => {
      setInput(page?.name);
    });
  }, [visible]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`https://neodb.social/api/catalog/search?query=${encodeURIComponent(input)}&page=1`);
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
        const data = await response.json();
        setItem(data.data || []);
        console.log(data.data);
        setLoading(false);
      } catch (error) {
        console.error('从 neodb 获取数据时出错:', error);
      }
    };

    if (input) {
      setLoading(true);
      fetchItems();
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
      >
        <div ref={innerRef} className="text-size-2em fixed top-0 left-1/2 transform -translate-x-1/2 mt-4">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-4 max-h-[calc(100vh-80px)] overflow-y-auto p-4 mt-16">
          {loading ? (
            <div className="text-center">
              <p className="animate-pulse">Loading...</p>
            </div>
          ) : item.length > 0 ? (
            item.map((item: Item) => (
              <Item key={item.id} item={item} />
            ))
          ) : (
            <div className="text-center">
              <p>没有找到相关项目</p>
            </div>
          )}
        </div>
      </main>
    );
  }
  return null;
}

export default App;