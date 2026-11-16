import { storage, type TypedStorage } from './storage';

export interface CacheEntry<T> {
  dados: T;
  salvoEm: number;
}

const DEFAULT_TTL_MS = 5 * 60_000;

/**
 * Cache generico com validade (TTL) e fallback offline (Aula 10 - Slide 21).
 * Segue OCP e DIP: funciona para qualquer tipo T e aceita armazenamento injetavel.
 */
export async function comCache<T>(
  chave: string,
  buscar: () => Promise<T>,
  ttlMs: number = DEFAULT_TTL_MS,
  store: TypedStorage = storage,
  now: () => number = Date.now,
): Promise<T> {
  const guardado = await store.get<CacheEntry<T> | null>(chave, null);
  const fresco = guardado !== null && now() - guardado.salvoEm < ttlMs;
  if (fresco) {
    return guardado.dados;
  }

  try {
    const dados = await buscar();
    await store.set<CacheEntry<T>>(chave, { dados, salvoEm: now() });
    return dados;
  } catch (error) {
    if (guardado !== null) {
      return guardado.dados;
    }
    throw error;
  }
}
