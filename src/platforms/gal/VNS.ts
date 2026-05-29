import { fetchClient } from "../../utils/httpClient";
import type { Platform, PlatformSearchResult, SearchResultItem } from "../../types";

const DATA_URL = "https://gal.saop.cc/index.json";
const BASE_URL = "https://gal.saop.cc";

interface IndexItem {
  title: string;
  permalink: string;
}

let cachedItems: IndexItem[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 30;

async function loadItems(): Promise<IndexItem[]> {
  if (cachedItems && Date.now() - cacheTime < CACHE_TTL) {
    return cachedItems;
  }

  const response = await fetchClient(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${DATA_URL}`);
  }

  const data = (await response.json()) as IndexItem[];
  const items = data.filter((item) => item.permalink.startsWith(`${BASE_URL}/p/`));

  cachedItems = items;
  cacheTime = Date.now();
  return items;
}

async function searchVNS(game: string): Promise<PlatformSearchResult> {
  const searchResult: PlatformSearchResult = {
    count: 0,
    items: [],
  };

  try {
    const allItems = await loadItems();
    const query = game.toLowerCase();

    const items: SearchResultItem[] = allItems
      .filter((item) => item.title.toLowerCase().includes(query))
      .map((item) => ({
        name: item.title,
        url: item.permalink,
      }));

    searchResult.items = items;
    searchResult.count = items.length;
  } catch (error) {
    if (error instanceof Error) {
      searchResult.error = error.message;
    } else {
      searchResult.error = "An unknown error occurred";
    }
    searchResult.count = -1;
  }

  return searchResult;
}

const VNS: Platform = {
  name: "VNS",
  color: "lime",
  tags: ["NoReq"],
  magic: false,
  search: searchVNS,
};

export default VNS;
