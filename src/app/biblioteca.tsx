import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { getWishlist, removeFromWishlist, WishlistBook } from '@/services/wishlist';

// Formata a data em que o livro foi salvo (ex.: "15 de nov.")
function formatSavedDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

export default function LibraryScreen() {
  const router = useRouter();
  const [books, setBooks] = useState<WishlistBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Trava de rolagem para modo web (mesmo padrão das outras telas)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-library-scroll';
      style.innerHTML = `
        html, body, #root {
          height: 100% !important;
          max-height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(style);
      return () => {
        document.getElementById('playstore-library-scroll')?.remove();
      };
    }
  }, []);

  // Recarrega do armazenamento local sempre que a tela ganha foco
  // (ex.: ao voltar dos detalhes depois de salvar ou remover um livro)
  useFocusEffect(
    useCallback(() => {
      let active = true;
      getWishlist().then((saved) => {
        if (!active) return;
        setBooks(saved);
        setIsLoading(false);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const handleRemove = async (id: string) => {
    await removeFromWishlist(id);
    setBooks((current) => current.filter((b) => b.id !== id));
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/livros');
    }
  };

  const openBook = (book: WishlistBook) => {
    // O livro de demonstração abre a tela de detalhes sem parâmetros
    if (book.id === 'demo-voce-ja-sabe') {
      router.push('/livro-detalhes');
      return;
    }
    router.push({
      pathname: '/livro-detalhes',
      params: {
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl ?? '',
        year: book.year ?? '',
        pages: book.pages ?? '',
        rating: book.rating ?? '',
      },
    });
  };

  const renderItem = ({ item }: { item: WishlistBook }) => (
    <TouchableOpacity style={styles.bookItem} activeOpacity={0.75} onPress={() => openBook(item)}>
      {item.coverUrl ? (
        <Image source={{ uri: item.coverUrl }} style={styles.cover} resizeMode="cover" />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Ionicons name="book-outline" size={26} color="#8E918F" />
        </View>
      )}

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <View style={styles.metaRow}>
          <Ionicons name="bookmark" size={12} color="#A8C7FA" />
          <Text style={styles.metaText}>Salvo em {formatSavedDate(item.savedAt)}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemove(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
        accessibilityLabel={`Remover ${item.title} da lista de desejos`}
      >
        <Ionicons name="trash-outline" size={22} color="#C4C7C5" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#A8C7FA" />
        </View>
      );
    }

    if (books.length === 0) {
      return (
        <View style={styles.centerBox}>
          <Ionicons name="bookmark-outline" size={56} color="#8E918F" />
          <Text style={styles.centerTitle}>Sua lista de desejos está vazia</Text>
          <Text style={styles.centerText}>
            Toque no marcador de um livro para salvá-lo aqui e ler depois.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={() => router.push('/busca-livros')}
          >
            <Text style={styles.primaryBtnText}>Pesquisar livros</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.countText}>
            {books.length} {books.length === 1 ? 'livro salvo' : 'livros salvos'}
          </Text>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#131314" />

      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#E3E3E3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lista de desejos</Text>
        </View>

        <View style={styles.content}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#131314',
    ...(Platform.OS === 'web'
      ? {
          height: '100vh' as any,
          maxHeight: '100vh' as any,
          overflow: 'hidden' as any,
        }
      : {}),
  },
  container: {
    flex: 1,
    backgroundColor: '#131314',
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#282A2C',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#E3E3E3',
    fontSize: 20,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  countText: {
    color: '#C4C7C5',
    fontSize: 14,
    marginBottom: 8,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 16,
  },
  cover: {
    width: 64,
    height: 96,
    borderRadius: 6,
    backgroundColor: '#1E1F22',
    borderWidth: 1,
    borderColor: '#2A2B2F',
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookInfo: {
    flex: 1,
    gap: 4,
  },
  bookTitle: {
    color: '#E3E3E3',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  bookAuthor: {
    color: '#C4C7C5',
    fontSize: 13,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    color: '#8E918F',
    fontSize: 12,
  },
  removeBtn: {
    padding: 8,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  centerTitle: {
    color: '#E3E3E3',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  centerText: {
    color: '#8E918F',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryBtn: {
    marginTop: 12,
    backgroundColor: '#A8C7FA',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  primaryBtnText: {
    color: '#062E6F',
    fontSize: 14,
    fontWeight: '600',
  },
});
