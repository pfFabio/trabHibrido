import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteReview, getReview, saveReview } from '@/services/reviews';

const MAX_LENGTH = 500;
const RATING_LABELS = ['', 'Odiei', 'Não gostei', 'Razoável', 'Gostei', 'Adorei'];

type ReviewParams = {
  id?: string;
  title?: string;
  author?: string;
  coverUrl?: string;
};

export default function RateBookScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ReviewParams>();
  const bookId = params.id ?? 'demo-voce-ja-sabe';

  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [hasSavedReview, setHasSavedReview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Trava de rolagem para modo web (mesmo padrão das outras telas)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-ratebook-scroll';
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
        document.getElementById('playstore-ratebook-scroll')?.remove();
      };
    }
  }, []);

  // Se o usuário já avaliou este livro, carrega a avaliação para edição
  useEffect(() => {
    getReview(bookId).then((review) => {
      if (!review) return;
      setRating(review.rating);
      setText(review.text);
      setHasSavedReview(true);
    });
  }, [bookId]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/livros');
    }
  };

  const handleSave = async () => {
    if (rating === 0 || isSaving) return;
    setIsSaving(true);
    await saveReview(bookId, rating, text);
    goBack();
  };

  const handleDelete = async () => {
    await deleteReview(bookId);
    goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#131314" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Cabeçalho com fechar e botão Postar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={goBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            accessibilityLabel="Fechar"
          >
            <Ionicons name="close" size={26} color="#E3E3E3" />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            {hasSavedReview ? 'Editar avaliação' : 'Avaliar este livro'}
          </Text>

          <TouchableOpacity
            style={[styles.postBtn, rating === 0 && styles.postBtnDisabled]}
            onPress={handleSave}
            disabled={rating === 0 || isSaving}
            activeOpacity={0.8}
          >
            <Text style={[styles.postBtnText, rating === 0 && styles.postBtnTextDisabled]}>
              Postar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Livro que está sendo avaliado */}
          <View style={styles.bookRow}>
            {params.coverUrl ? (
              <Image source={{ uri: params.coverUrl }} style={styles.cover} resizeMode="cover" />
            ) : (
              <View style={[styles.cover, styles.coverFallback]}>
                <Ionicons name="book-outline" size={22} color="#8E918F" />
              </View>
            )}
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {params.title ?? 'Você Já Sabe'}
              </Text>
              <Text style={styles.bookAuthor} numberOfLines={1}>
                {params.author ?? 'Ragas Bantara'}
              </Text>
            </View>
          </View>

          <Text style={styles.notice}>
            As avaliações ficam salvas neste dispositivo e aparecem na página do livro.
          </Text>

          {/* Seleção de 1 a 5 estrelas */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                activeOpacity={0.7}
                accessibilityLabel={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? '#A8C7FA' : '#8E918F'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingLabel}>{RATING_LABELS[rating] || 'Toque para avaliar'}</Text>

          {/* Texto da resenha */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="Conte o que você achou deste livro (opcional)"
              placeholderTextColor="#8E918F"
              value={text}
              onChangeText={setText}
              maxLength={MAX_LENGTH}
              multiline
              textAlignVertical="top"
            />
          </View>
          <Text style={styles.counter}>
            {text.length}/{MAX_LENGTH}
          </Text>

          {hasSavedReview && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={18} color="#F2B8B5" />
              <Text style={styles.deleteBtnText}>Excluir avaliação</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 20,
  },
  headerTitle: {
    flex: 1,
    color: '#E3E3E3',
    fontSize: 20,
    fontWeight: '500',
  },
  postBtn: {
    backgroundColor: '#A8C7FA',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postBtnDisabled: {
    backgroundColor: '#2A2B2F',
  },
  postBtnText: {
    color: '#062E6F',
    fontSize: 14,
    fontWeight: '600',
  },
  postBtnTextDisabled: {
    color: '#5F6368',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cover: {
    width: 48,
    height: 72,
    borderRadius: 4,
    backgroundColor: '#1E1F22',
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookInfo: {
    flex: 1,
    gap: 2,
  },
  bookTitle: {
    color: '#E3E3E3',
    fontSize: 16,
    fontWeight: '500',
  },
  bookAuthor: {
    color: '#C4C7C5',
    fontSize: 13,
  },
  notice: {
    color: '#8E918F',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 18,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
    paddingHorizontal: 12,
  },
  ratingLabel: {
    color: '#C4C7C5',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  inputBox: {
    marginTop: 28,
    borderWidth: 1,
    borderColor: '#5F6368',
    borderRadius: 8,
    minHeight: 140,
    padding: 12,
  },
  textInput: {
    flex: 1,
    color: '#E3E3E3',
    fontSize: 15,
    lineHeight: 21,
    minHeight: 116,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  counter: {
    color: '#8E918F',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginTop: 24,
    paddingVertical: 8,
  },
  deleteBtnText: {
    color: '#F2B8B5',
    fontSize: 14,
    fontWeight: '500',
  },
});
