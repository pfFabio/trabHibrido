import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { storage } from '@/services/storage';
import { colors, radius, readerThemes, type ReaderThemeId, spacing } from '@/theme';

const PREFS_KEY = '@playlivros:preferencias-leitor';
const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 26;

interface ReaderPreferences {
  tema: ReaderThemeId;
  fonte: number;
}

const DEFAULT_PREFS: ReaderPreferences = {
  tema: 'escuro',
  fonte: 17,
};

type ReaderParams = {
  id?: string;
  title?: string;
  author?: string;
  synopsis?: string;
};

export default function SampleReaderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ReaderParams>();

  const bookId = params.id ?? 'demo-voce-ja-sabe';
  const bookTitle = params.title ?? 'Você Já Sabe';
  const bookAuthor = params.author ?? 'Ragas Bantara';
  const bookSynopsis =
    params.synopsis ??
    'Por que é tão difícil começar aquilo que sabemos que precisamos fazer? Esta amostra apresenta os primeiros conceitos sobre foco, hábitos e tomada de decisão.';

  const [prefs, setPrefs] = useState<ReaderPreferences>(DEFAULT_PREFS);
  const [pageIndex, setPageIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const progressKey = `@playlivros:progresso:${bookId}`;

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-reader-scroll';
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
        document.getElementById('playstore-reader-scroll')?.remove();
      };
    }
  }, []);

  // Hidrata preferencias (tema e tamanho da fonte) + pagina salva no AsyncStorage
  useEffect(() => {
    let active = true;
    Promise.all([
      storage.get<ReaderPreferences>(PREFS_KEY, DEFAULT_PREFS),
      storage.get<number>(progressKey, 0),
    ]).then(([savedPrefs, savedPage]) => {
      if (!active) return;
      const validTheme: ReaderThemeId =
        savedPrefs.tema in readerThemes ? savedPrefs.tema : 'escuro';
      const validFont = Math.min(
        MAX_FONT_SIZE,
        Math.max(MIN_FONT_SIZE, Number(savedPrefs.fonte) || DEFAULT_PREFS.fonte),
      );
      setPrefs({ tema: validTheme, fonte: validFont });
      setPageIndex(Math.min(2, Math.max(0, Number(savedPage) || 0)));
      setIsReady(true);
    });
    return () => {
      active = false;
    };
  }, [progressKey]);

  const updatePrefs = async (next: ReaderPreferences) => {
    setPrefs(next);
    await storage.set(PREFS_KEY, next);
  };

  const changeFontSize = (delta: number) => {
    const nextFont = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, prefs.fonte + delta));
    if (nextFont !== prefs.fonte) {
      updatePrefs({ ...prefs, fonte: nextFont });
    }
  };

  const changeTheme = (tema: ReaderThemeId) => {
    if (tema !== prefs.tema) {
      updatePrefs({ ...prefs, tema });
    }
  };

  const goToPage = async (nextIndex: number) => {
    const clamped = Math.min(pages.length - 1, Math.max(0, nextIndex));
    setPageIndex(clamped);
    await storage.set(progressKey, clamped);
  };

  const pages = useMemo(
    () => [
      {
        chapter: 'Apresentação da Obra',
        paragraphs: [
          bookTitle,
          `Por ${bookAuthor}`,
          bookSynopsis,
          'Nesta prévia gratuita do Google Play Livros, suas preferências de leitura (tema visual, tamanho da fonte e página atual) ficam salvas automaticamente no dispositivo.',
        ],
      },
      {
        chapter: 'Capítulo 1 • O Primeiro Passo',
        paragraphs: [
          'Grande parte das decisões diárias acontece no piloto automático antes mesmo de pararmos para refletir. Quando o ambiente exige esforço sem clareza, nossa tendência natural é adiar.',
          'Ao dividir uma meta complexa em ações pequenas e imediatas, reduzimos a resistência inicial e criamos ritmo constante. Pequenos avanços visíveis alimentam a confiança para o próximo bloco de trabalho.',
        ],
      },
      {
        chapter: 'Fim da Amostra Gratuita',
        paragraphs: [
          'Você concluiu a leitura da amostra gratuita deste e-book.',
          'Continue explorando novos títulos na Play Livros, salve suas obras favoritas na Lista de Desejos ou registre sua avaliação com estrelas e comentários.',
        ],
      },
    ],
    [bookTitle, bookAuthor, bookSynopsis],
  );

  const activeTheme = readerThemes[prefs.tema];
  const currentPage = pages[pageIndex];
  const progressPercent = Math.round(((pageIndex + 1) / pages.length) * 100);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/livros');
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: activeTheme.background }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar
        barStyle={prefs.tema === 'escuro' ? 'light-content' : 'dark-content'}
        backgroundColor={activeTheme.background}
      />

      <View style={styles.container}>
        {/* Cabecalho */}
        <View style={[styles.headerRow, { borderBottomColor: activeTheme.border }]}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            accessibilityLabel="Fechar leitor"
          >
            <Ionicons name="close" size={24} color={activeTheme.text} />
          </TouchableOpacity>

          <View style={styles.headerTextCol}>
            <Text style={[styles.headerTitle, { color: activeTheme.text }]} numberOfLines={1}>
              {bookTitle}
            </Text>
            <Text style={[styles.headerSub, { color: activeTheme.muted }]} numberOfLines={1}>
              Amostra gratuita • {progressPercent}%
            </Text>
          </View>
        </View>

        {/* Barra de Controles: Fonte e Tema salvos no AsyncStorage */}
        <View
          style={[
            styles.controlsBar,
            { backgroundColor: activeTheme.surface, borderBottomColor: activeTheme.border },
          ]}
        >
          <View style={styles.fontControls}>
            <TouchableOpacity
              style={[styles.fontBtn, { borderColor: activeTheme.border }]}
              onPress={() => changeFontSize(-2)}
              activeOpacity={0.7}
              accessibilityLabel="Diminuir fonte"
            >
              <Text style={[styles.fontBtnText, { color: activeTheme.text }]}>A-</Text>
            </TouchableOpacity>
            <Text style={[styles.fontSizeLabel, { color: activeTheme.muted }]}>
              {prefs.fonte}dp
            </Text>
            <TouchableOpacity
              style={[styles.fontBtn, { borderColor: activeTheme.border }]}
              onPress={() => changeFontSize(2)}
              activeOpacity={0.7}
              accessibilityLabel="Aumentar fonte"
            >
              <Text style={[styles.fontBtnText, { color: activeTheme.text }]}>A+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.themeControls}>
            {(Object.keys(readerThemes) as ReaderThemeId[]).map((temaId) => {
              const selected = prefs.tema === temaId;
              return (
                <TouchableOpacity
                  key={temaId}
                  style={[
                    styles.themePill,
                    { borderColor: selected ? colors.primary : activeTheme.border },
                    selected && { backgroundColor: colors.primaryContainer },
                  ]}
                  onPress={() => changeTheme(temaId)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.themePillText,
                      { color: selected ? colors.onPrimaryContainer : activeTheme.text },
                    ]}
                  >
                    {readerThemes[temaId].label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Conteudo do Livro */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isReady && (
            <>
              <Text style={[styles.chapterLabel, { color: activeTheme.muted }]}>
                {currentPage.chapter}
              </Text>
              {currentPage.paragraphs.map((paragraph, idx) => (
                <Text
                  key={`${pageIndex}-${idx}`}
                  style={[
                    styles.bodyText,
                    {
                      color: activeTheme.text,
                      fontSize: prefs.fonte,
                      lineHeight: Math.round(prefs.fonte * 1.55),
                    },
                  ]}
                >
                  {paragraph}
                </Text>
              ))}
            </>
          )}
        </ScrollView>

        {/* Rodape com Paginacao e Barra de Progresso */}
        <View
          style={[
            styles.footer,
            { backgroundColor: activeTheme.surface, borderTopColor: activeTheme.border },
          ]}
        >
          <View style={[styles.progressTrack, { backgroundColor: activeTheme.border }]}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>

          <View style={styles.paginationRow}>
            <TouchableOpacity
              style={[styles.pageBtn, pageIndex === 0 && styles.pageBtnDisabled]}
              disabled={pageIndex === 0}
              onPress={() => goToPage(pageIndex - 1)}
              activeOpacity={0.75}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={pageIndex === 0 ? activeTheme.muted : activeTheme.text}
              />
              <Text
                style={[
                  styles.pageBtnText,
                  { color: pageIndex === 0 ? activeTheme.muted : activeTheme.text },
                ]}
              >
                Anterior
              </Text>
            </TouchableOpacity>

            <Text style={[styles.pageIndicator, { color: activeTheme.muted }]}>
              Página {pageIndex + 1} de {pages.length}
            </Text>

            <TouchableOpacity
              style={[
                styles.pageBtn,
                pageIndex === pages.length - 1 && styles.pageBtnDisabled,
              ]}
              disabled={pageIndex === pages.length - 1}
              onPress={() => goToPage(pageIndex + 1)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.pageBtnText,
                  {
                    color:
                      pageIndex === pages.length - 1 ? activeTheme.muted : activeTheme.text,
                  },
                ]}
              >
                Próxima
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={pageIndex === pages.length - 1 ? activeTheme.muted : activeTheme.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    maxWidth: 820,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 14,
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fontBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  fontBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  fontSizeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  themeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  chapterLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: spacing.xs,
  },
  bodyText: {
    fontWeight: '400',
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: colors.primary,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  pageBtnDisabled: {
    opacity: 0.5,
  },
  pageBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  pageIndicator: {
    fontSize: 12,
    fontWeight: '500',
  },
});
