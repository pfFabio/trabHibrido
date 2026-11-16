import { storage, type TypedStorage } from './storage';

const STORAGE_KEY = '@playstore:apps-instalados';

export interface InstalledAppInput {
  id: string;
  name: string;
  developer: string;
  category: string;
  size: string;
  color: string;
  iconLabel: string;
}

export interface InstalledAppItem extends InstalledAppInput {
  installedAt: number;
}

/**
 * Gerencia aplicativos e jogos instalados localmente no AsyncStorage (SRP + DIP).
 */
export async function getInstalledApps(
  store: TypedStorage = storage,
): Promise<InstalledAppItem[]> {
  return store.get<InstalledAppItem[]>(STORAGE_KEY, []);
}

export async function isAppInstalled(
  id: string,
  store: TypedStorage = storage,
): Promise<boolean> {
  const apps = await getInstalledApps(store);
  return apps.some((item) => item.id === id);
}

export async function installApp(
  app: InstalledAppInput,
  store: TypedStorage = storage,
): Promise<InstalledAppItem[]> {
  const current = await getInstalledApps(store);
  const filtered = current.filter((item) => item.id !== app.id);
  const updated: InstalledAppItem[] = [{ ...app, installedAt: Date.now() }, ...filtered];
  await store.set(STORAGE_KEY, updated);
  return updated;
}

export async function uninstallApp(
  id: string,
  store: TypedStorage = storage,
): Promise<InstalledAppItem[]> {
  const current = await getInstalledApps(store);
  const updated = current.filter((item) => item.id !== id);
  await store.set(STORAGE_KEY, updated);
  return updated;
}
