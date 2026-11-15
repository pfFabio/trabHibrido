import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { searchBooks, BookSearchResult } from '@/services/openLibrary';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export default function BookSearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();

  const [query, setQuery] = useState(params.q ?? '');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  // Trava de rolagem para modo web (mesmo padrão das outras telas)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-booksearch-scroll';
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
        document.getElementById('playstore-booksearch-scroll')?.remove();
      };
    }
  }, []);

  // Pesquisa na API 500ms depois que o usuário para de digitar
  useEffect(() => {
    const termo = query.trim();
    if (termo.length < 2) {
      setResults([]);
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus('loading');
      try {
        const data = await searchBooks(termo, controller.signal);
        setResults(data);
        setStatus('success');
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido');
        setStatus('error');
      }
    }, 500);

    // Cancela a busca anterior se o texto mudar antes de terminar
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, retryCount]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/livros');
    }
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#A8C7FA" />
          <Text style={styles.centerText}>Buscando livros...</Text>
        </View>
      );
    }

    if (status === 'error') {
      return (
        <View style={styles.centerBox}>
          <Ionicons name="cloud-offline-outline" size={56} color="#8E918F" />
          <Text style={styles.centerTitle}>Não foi possível buscar</Text>
          <Text style={styles.centerText}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            activeOpacity={0.8}
            onPress={() => setRetryCount((c) => c + 1)}
          >
            <Text style={styles.retryBtnText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (status === 'success' && results.length === 0) {
      return (
        <View style={styles.centerBox}>
          <Ionicons name="search-outline" size={56} color="#8E918F" />
          <Text style={styles.centerTitle}>Nenhum livro encontrado</Text>
          <Text style={styles.centerText}>Tente outro título, autor ou assunto.</Text>
        </View>
      );
    }

    if (status === 'success') {
      return (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {results.length} resultados para "{query.trim()}"
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.centerBox}>
        <Ionicons name="book-outline" size={56} color="#8E918F" />
        <Text style={styles.centerTitle}>Pesquise na Play Livros</Text>
        <Text style={styles.centerText}>Digite o título, autor ou assunto do livro.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#131314" />

      <View style={styles.container}>
        {/* Barra de pesquisa com seta de voltar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#E3E3E3" />
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar livros"
              placeholderTextColor="#8E918F"
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
                <Ionicons name="close" size={22} color="#C4C7C5" />
              </TouchableOpacity>
            )}
          </View>
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
    paddingTop: 8,
    paddingBottom: 8,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#282A2C',
  },
  backBtn: {
    padding: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1F22',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: '#E3E3E3',
    fontSize: 15,
    paddingVertical: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  content: {
    flex: 1,
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
  retryBtn: {
    marginTop: 12,
    backgroundColor: '#A8C7FA',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryBtnText: {
    color: '#062E6F',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resultsCount: {
    color: '#C4C7C5',
    fontSize: 14,
  },
});
