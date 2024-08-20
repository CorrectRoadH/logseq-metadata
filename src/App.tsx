import React, { useEffect, useRef, useState } from "react";
import { useAppVisible } from "./utils";

function Item({ item }: { item: any }) {
  return (
    <div className="item flex flex-row gap-4 p-4 border rounded-lg shadow-md">
      <img 
        src={item.cover_image_url} 
        alt={item.display_title} 
        className="item-cover w-32 h-48 object-cover rounded"
      />
      <div className="item-details flex flex-col justify-between">
        <h2 className="text-xl font-bold">{item.display_title}</h2>
        <p className="text-lg">{item.localized_title?.find((t: { lang: string; }) => t.lang === 'zh-cn')?.text || item.title}</p>
        <p>评分: <span className="font-semibold">{item.rating}</span> ({item.rating_count} 评价)</p>
        <p>年份: {item.year}</p>
        <p>类型: {item.genre?.join(', ') || '未知'}</p>
        <p>导演: {item.director?.join(', ') || '未知'}</p>
        <p>主演: {item.actor?.slice(0, 5).join(', ') || '未知'}{item.actor && item.actor.length > 5 ? '...' : ''}</p>
        <p className="item-brief text-sm text-gray-600 mt-2">{item.brief}</p>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={async () => {
          await logseq.Editor.insertAtEditingCursor(
            `type:: ${item.category}
cover:: ${item.cover_image_url}
director:: ${item.director?.join(', ') || '未知'}
actor:: ${item.actor?.slice(0, 5).join(', ') || '未知'}
year:: ${item.year}
rating:: ${item.rating}
tags:: ${item.genre?.join(', ') || '未知'}
`
          );    
        }}
      >
        Insert Metadata
      </button>
    </div>
  );
}
function App() {
  const innerRef = useRef<HTMLDivElement>(null);
  const visible = useAppVisible();
  const [input, setInput] = useState(''); // Initialize with an empty string
  const [item, setItem] = useState([]);

  useEffect(() => {
    logseq.Editor.getCurrentPage().then((page) => {
      setInput(page?.name);
    });
  }, []);

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
      } catch (error) {
        console.error('从 neodb 获取数据时出错:', error);
      }
    };

    if (input) {
      fetchItems();
    }
  }, [input]);

  if (visible) {
    return (
      <main
        className="backdrop-filter backdrop-blur-md fixed inset-0 flex flex-col items-center justify-center"
        onClick={(e) => {
          if (!innerRef.current?.contains(e.target as any)) {
            window.logseq.hideMainUI();
          }
        }}
      >
        <div ref={innerRef} className="text-size-2em">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto p-4">
          {item.map((item: any) => (
            <Item key={item.id} item={item} />
          ))}
        </div>

      </main>
    );
  }
  return null;
}

export default App;