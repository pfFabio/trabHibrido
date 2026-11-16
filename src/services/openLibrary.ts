// Camada de Dados: consumo da Open Library API (pública, sem chave)
// Documentação: https://openlibrary.org/developers/api
import { comCache } from './cache';

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';

export interface BookSearchResult {
  id: string; // ex.: "OL82563W"
  title: string;
  author: string;
  year?: number;
  pages?: number;
  rating?: number;
  coverUrl?: string;
}

// Autor, ano e nota vêm da busca; aqui ficam só os dados extras da obra
export interface BookDetails {
  id: string;
  title: string;
  description?: string;
  subjects: string[];
  coverUrl?: string;
}

interface SearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  number_of_pages_median?: number;
  ratings_average?: number;
}

export function getCoverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M') {
  return coverId ? `${COVERS_URL}/${coverId}-${size}.jpg` : undefined;
}

function mapDoc(doc: SearchDoc): BookSearchResult {
  return {
    id: doc.key.replace('/works/', ''),
    title: doc.title,
    author: doc.author_name?.[0] ?? 'Autor desconhecido',
    year: doc.first_publish_year,
    pages: doc.number_of_pages_median,
    rating: doc.ratings_average ? Math.round(doc.ratings_average * 10) / 10 : undefined,
    coverUrl: getCoverUrl(doc.cover_i),
  };
}

const SEARCH_FIELDS =
  'key,title,author_name,cover_i,first_publish_year,number_of_pages_median,ratings_average';

async function fetchSearchDocs(url: string, signal?: AbortSignal): Promise<BookSearchResult[]> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Erro ao buscar livros (${response.status})`);
  }

  const data: { docs: SearchDoc[] } = await response.json();
  return data.docs.map(mapDoc);
}

// Pesquisa livros por título, autor ou assunto
export async function searchBooks(
  query: string,
  signal?: AbortSignal,
): Promise<BookSearchResult[]> {
  const termo = query.trim();
  if (!termo) return [];

  const url = `${BASE_URL}/search.json?q=${encodeURIComponent(termo)}&limit=20&fields=${SEARCH_FIELDS}`;
  return fetchSearchDocs(url, signal);
}

// Pesquisa livros por gênero/assunto com cache TTL e fallback offline
export async function searchBooksBySubject(
  subject: string,
  signal?: AbortSignal,
): Promise<BookSearchResult[]> {
  const termo = subject.trim().toLowerCase();
  if (!termo) return [];

  const cacheKey = `@playlivros:cache:subject:${termo}`;
  const url = `${BASE_URL}/search.json?subject=${encodeURIComponent(termo)}&limit=15&fields=${SEARCH_FIELDS}`;
  return comCache(cacheKey, () => fetchSearchDocs(url, signal));
}

// Busca os detalhes de um livro pelo id (ex.: "OL82563W")
export async function getBookDetails(id: string, signal?: AbortSignal): Promise<BookDetails> {
  const response = await fetch(`${BASE_URL}/works/${id}.json`, { signal });
  if (!response.ok) {
    throw new Error(`Erro ao carregar o livro (${response.status})`);
  }

  const work = await response.json();
  const description =
    typeof work.description === 'string' ? work.description : work.description?.value;

  return {
    id,
    title: work.title,
    description,
    subjects: (work.subjects ?? []).slice(0, 8),
    coverUrl: getCoverUrl(work.covers?.[0], 'L'),
  };
}
