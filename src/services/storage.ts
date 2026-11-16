import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Contrato minimo de driver chave-valor (DIP/ISP), permitindo substituir
 * AsyncStorage por um driver em memoria durante testes unitarios.
 */
export interface StorageDriver {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Interface publica do wrapper tipado (Aula 10 - Slide 9).
 */
export interface TypedStorage {
  get<T>(chave: string, padrao: T): Promise<T>;
  set<T>(chave: string, valor: T): Promise<void>;
  remove(chave: string): Promise<void>;
}

export function createStorage(driver: StorageDriver): TypedStorage {
  return {
    async get<T>(chave: string, padrao: T): Promise<T> {
      try {
        const bruto = await driver.getItem(chave);
        return bruto ? (JSON.parse(bruto) as T) : padrao;
      } catch {
        return padrao;
      }
    },
    async set<T>(chave: string, valor: T): Promise<void> {
      await driver.setItem(chave, JSON.stringify(valor));
    },
    async remove(chave: string): Promise<void> {
      await driver.removeItem(chave);
    },
  };
}

export const storage = createStorage(AsyncStorage);
