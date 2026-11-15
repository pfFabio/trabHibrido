// Camada de Dados: avaliações do usuário salvas localmente com AsyncStorage
// Guarda um objeto { [idDoLivro]: avaliação } — uma avaliação por livro.
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@playlivros:avaliacoes';

export interface BookReview {
  bookId: string;
  rating: number; // 1 a 5 estrelas
  text: string;
  updatedAt: number; // timestamp da última edição
}

type ReviewMap = Record<string, BookReview>;

async function getAllReviews(): Promise<ReviewMap> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? (JSON.parse(json) as ReviewMap) : {};
  } catch {
    return {};
  }
}

export async function getReview(bookId: string): Promise<BookReview | undefined> {
  const reviews = await getAllReviews();
  return reviews[bookId];
}

export async function saveReview(bookId: string, rating: number, text: string) {
  const reviews = await getAllReviews();
  reviews[bookId] = { bookId, rating, text: text.trim(), updatedAt: Date.now() };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export async function deleteReview(bookId: string) {
  const reviews = await getAllReviews();
  delete reviews[bookId];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}
