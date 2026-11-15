// Camada de Dados: lista de desejos salva localmente com AsyncStorage
// Os livros continuam salvos mesmo depois de fechar o app.
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@playlivros:lista-desejos';

export interface WishlistBook {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  year?: string;
  pages?: string;
  rating?: string;
  savedAt: number; // data em que foi salvo (timestamp)
}

export async function getWishlist(): Promise<WishlistBook[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as WishlistBook[]) : [];
  } catch {
    return [];
  }
}

async function saveWishlist(books: WishlistBook[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export async function isInWishlist(id: string): Promise<boolean> {
  const books = await getWishlist();
  return books.some((b) => b.id === id);
}

export async function addToWishlist(book: Omit<WishlistBook, 'savedAt'>) {
  const books = await getWishlist();
  if (books.some((b) => b.id === book.id)) return;
  // Mais recente primeiro
  await saveWishlist([{ ...book, savedAt: Date.now() }, ...books]);
}

export async function removeFromWishlist(id: string) {
  const books = await getWishlist();
  await saveWishlist(books.filter((b) => b.id !== id));
}

// Adiciona ou remove; devolve true se o livro ficou na lista
export async function toggleWishlist(book: Omit<WishlistBook, 'savedAt'>): Promise<boolean> {
  if (await isInWishlist(book.id)) {
    await removeFromWishlist(book.id);
    return false;
  }
  await addToWishlist(book);
  return true;
}
