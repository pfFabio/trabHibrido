import { storage, type TypedStorage } from './storage';

const STORAGE_KEY = '@playlivros:historico-busca';
const MAX_HISTORY_ITEMS = 8;

/**
 * Gerencia o historico recente de termos buscados na Play Livros (SRP + DIP).
 */
export async function getSearchHistory(store: TypedStorage = storage): Promise<string[]> {
  return store.get<string[]>(STORAGE_KEY, []);
}

export async function addSearchTerm(
  term: string,
  store: TypedStorage = storage,
): Promise<string[]> {
  const normalized = term.trim();
  if (normalized.length < 2) {
    return getSearchHistory(store);
  }

  const current = await getSearchHistory(store);
  const filtered = current.filter(
    (item) => item.toLowerCase() !== normalized.toLowerCase(),
  );
  const updated = [normalized, ...filtered].slice(0, MAX_HISTORY_ITEMS);
  await store.set(STORAGE_KEY, updated);
  return updated;
}

export async function removeSearchTerm(
  term: string,
  store: TypedStorage = storage,
): Promise<string[]> {
  const current = await getSearchHistory(store);
  const updated = current.filter((item) => item.toLowerCase() !== term.toLowerCase());
  await store.set(STORAGE_KEY, updated);
  return updated;
}

export async function clearSearchHistory(store: TypedStorage = storage): Promise<void> {
  await store.remove(STORAGE_KEY);
}
