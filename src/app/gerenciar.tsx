import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import {
  getInstalledApps,
  uninstallApp,
  type InstalledAppItem,
} from '@/services/installedApps';
import { getAllReviewsList, type BookReview } from '@/services/reviews';
import { colors, radius, spacing } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GerenciarAppsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ from?: string }>();
  // Origem recebida da tela anterior (padrão '/' se não informada, preparado para '/livros' etc.)
  const fromRoute = params.from || '/';
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'visao_geral' | 'gerenciar'>('visao_geral');
  const [installedApps, setInstalledApps] = useState<InstalledAppItem[]>([]);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const isWeb = Platform.OS === 'web';

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getInstalledApps(), getAllReviewsList()]).then(
        ([appsList, reviewsList]) => {
          if (!active) return;
          setInstalledApps(appsList);
          setReviews(reviewsList);
        },
      );
      return () => {
        active = false;
      };
    }, []),
  );

  const handleUninstallApp = async (id: string) => {
    const updated = await uninstallApp(id);
    setInstalledApps(updated);
  };

  // Animação de entrada suave apenas no web (no celular é gerido nativamente pelo Stack)
  const slideAnim = useRef(new Animated.Value(isWeb ? SCREEN_WIDTH : 0)).current;
  const opacityAnim = useRef(new Animated.Value(isWeb ? 0 : 1)).current;

  useEffect(() => {
    if (isWeb) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isWeb]);

  const handleBack = () => {
    if (isWeb) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH,
          duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.replace(fromRoute as any);
      });
    } else {
      router.replace(fromRoute as any);
    }
  };

  // Trava de rolagem no navegador web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-gerenciar-scroll';
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
        const el = document.getElementById('playstore-gerenciar-scroll');
        if (el) el.remove();
      };
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#131314" />

      <Animated.View
        style={[
          styles.animatedContainer,
          isWeb && {
            transform: [{ translateX: slideAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Top Header com Seta de Voltar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#E3E3E3" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gerenciar apps e dispositivos</Text>
        </View>

        {/* Abas Superiores: Visão geral e Gerenciar */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setSelectedTab('visao_geral')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'visao_geral' && styles.tabTextActive,
              ]}
            >
              Visão geral
            </Text>
            {selectedTab === 'visao_geral' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setSelectedTab('gerenciar')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'gerenciar' && styles.tabTextActive,
              ]}
            >
              Gerenciar
            </Text>
            {selectedTab === 'gerenciar' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>
        <View style={styles.tabsDivider} />

        {/* Conteúdo das Abas: Visão Geral e Gerenciar */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === 'visao_geral' ? (
            <>
              {/* Item 1: Play Protect */}
              <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
                <View style={styles.iconCol}>
                  <Ionicons name="shield-checkmark-outline" size={24} color="#C4C7C5" />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.itemTitle}>Nenhum app nocivo encontrado</Text>
                  <Text style={styles.itemSubtitle}>
                    A verificação do Play Protect foi feita ontem
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Item 2: Atualizações de Apps */}
              <View style={styles.rowItemWithAction}>
                <View style={styles.iconCol}>
                  <Ionicons name="apps-outline" size={24} color="#C4C7C5" />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.itemTitle}>
                    {installedApps.length === 0
                      ? 'Nenhum app instalado pela loja'
                      : `${installedApps.length} ${installedApps.length === 1 ? 'app instalado' : 'apps instalados'} recentemente`}
                  </Text>
                  <Text style={styles.itemSubtitle}>Última verificação há 1 dia</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.actionBtn}
                    onPress={() => setSelectedTab('gerenciar')}
                  >
                    <Text style={styles.actionBtnText}>Gerenciar apps instalados</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Item 3: Armazenamento */}
              <TouchableOpacity
                style={styles.rowItem}
                activeOpacity={0.7}
                onPress={() => setSelectedTab('gerenciar')}
              >
                <View style={styles.iconCol}>
                  <Ionicons name="server-outline" size={24} color="#C4C7C5" />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.itemTitle}>105 GB de 113 GB em uso</Text>
                  <View style={styles.storageBarContainer}>
                    <View style={styles.storageBarFill} />
                    <View style={styles.storageBarDot} />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Item 4: Sincronizar apps */}
              <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
                <View style={styles.iconCol}>
                  <MaterialCommunityIcons name="cellphone-link" size={24} color="#C4C7C5" />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.itemTitle}>Sincronizar apps com os dispositivos</Text>
                  <Text style={styles.itemSubtitle}>Nenhum dispositivo sincronizado</Text>
                </View>
              </TouchableOpacity>

              {/* Item 5: Notas e avaliações */}
              <TouchableOpacity
                style={styles.rowItem}
                activeOpacity={0.7}
                onPress={() => setSelectedTab('gerenciar')}
              >
                <View style={styles.iconCol}>
                  <Ionicons name="star-outline" size={24} color="#C4C7C5" />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.itemTitle}>Notas e avaliações</Text>
                  <Text style={styles.itemSubtitle}>
                    {reviews.length === 0
                      ? 'Nenhuma avaliação publicada ainda'
                      : `${reviews.length} ${reviews.length === 1 ? 'avaliação salva' : 'avaliações salvas'} no dispositivo`}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Item 6: Suas contribuições */}
              <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
                <View style={styles.iconCol}>
                  <MaterialCommunityIcons name="badge-account-outline" size={24} color="#C4C7C5" />
                </View>
                <View style={styles.textCol}>
                  <Text style={styles.itemTitle}>Suas contribuições</Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.manageSection}>
              <Text style={styles.manageHeading}>
                Aplicativos instalados ({installedApps.length})
              </Text>

              {installedApps.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="cloud-download-outline" size={34} color={colors.textMuted} />
                  <Text style={styles.emptyCardTitle}>Nenhum aplicativo instalado</Text>
                  <Text style={styles.emptyCardSub}>
                    Instale apps ou jogos pela loja para gerenciá-los por aqui.
                  </Text>
                  <TouchableOpacity
                    style={styles.exploreBtn}
                    onPress={() => router.replace('/apps')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.exploreBtnText}>Explorar apps</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                installedApps.map((app) => (
                  <View key={app.id} style={styles.installedRow}>
                    <View style={[styles.installedIcon, { backgroundColor: app.color }]}>
                      <Text style={styles.installedIconText} numberOfLines={1}>
                        {app.iconLabel}
                      </Text>
                    </View>
                    <View style={styles.installedInfo}>
                      <Text style={styles.installedName} numberOfLines={1}>
                        {app.name}
                      </Text>
                      <Text style={styles.installedMeta} numberOfLines={1}>
                        {app.size} • {app.category}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.uninstallChip}
                      onPress={() => handleUninstallApp(app.id)}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.uninstallChipText}>Desinstalar</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}

              <Text style={[styles.manageHeading, { marginTop: spacing.lg }]}>
                Suas avaliações de livros ({reviews.length})
              </Text>

              {reviews.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="star-outline" size={32} color={colors.textMuted} />
                  <Text style={styles.emptyCardTitle}>Sem avaliações salvas</Text>
                  <Text style={styles.emptyCardSub}>
                    Avalie um livro na Play Livros para acompanhar suas notas aqui.
                  </Text>
                </View>
              ) : (
                reviews.map((rev) => (
                  <View key={rev.bookId} style={styles.reviewCard}>
                    <View style={styles.reviewTopRow}>
                      <Text style={styles.reviewBookId} numberOfLines={1}>
                        Livro: {rev.bookId}
                      </Text>
                      <Text style={styles.reviewStars}>{rev.rating} ★</Text>
                    </View>
                    {rev.text ? (
                      <Text style={styles.reviewBody}>{rev.text}</Text>
                    ) : (
                      <Text style={styles.reviewNoText}>Sem comentário escrito</Text>
                    )}
                    <Text style={styles.reviewDate}>
                      Atualizado em {new Date(rev.updatedAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#131314',
    height: '100%',
    ...(Platform.OS === 'web'
      ? {
          height: '100vh' as any,
          maxHeight: '100vh' as any,
          overflow: 'hidden' as any,
        }
      : {}),
  },
  animatedContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#131314',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  backBtn: {
    padding: 6,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#E3E3E3',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 4,
    gap: 28,
  },
  tabItem: {
    paddingBottom: 8,
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E918F',
  },
  tabTextActive: {
    color: '#A8C7FA',
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#A8C7FA',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabsDivider: {
    height: 1,
    backgroundColor: '#282A2C',
    width: '100%',
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 18,
  },
  rowItemWithAction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 18,
  },
  iconCol: {
    width: 32,
    marginRight: 20,
    alignItems: 'center',
    paddingTop: 2,
  },
  textCol: {
    flex: 1,
  },
  itemTitle: {
    color: '#E3E3E3',
    fontSize: 15,
    fontWeight: '500',
  },
  itemSubtitle: {
    color: '#8E918F',
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  actionBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  actionBtnText: {
    color: '#A8C7FA',
    fontSize: 13,
    fontWeight: '600',
  },
  storageBarContainer: {
    height: 4,
    backgroundColor: '#282A2C',
    borderRadius: 2,
    marginTop: 12,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageBarFill: {
    height: 4,
    width: '92%',
    backgroundColor: '#A8C7FA',
    borderRadius: 2,
  },
  storageBarDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#A8C7FA',
    marginLeft: 4,
  },
  manageSection: {
    paddingTop: spacing.sm,
    gap: 10,
  },
  manageHeading: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 8,
  },
  emptyCardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyCardSub: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  exploreBtn: {
    marginTop: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  exploreBtnText: {
    color: '#062E6F',
    fontSize: 13,
    fontWeight: '700',
  },
  installedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: 12,
    gap: 12,
  },
  installedIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  installedIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  installedInfo: {
    flex: 1,
    gap: 2,
  },
  installedName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  installedMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  uninstallChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  uninstallChipText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: 14,
    gap: 6,
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  reviewBookId: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewStars: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  reviewBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  reviewNoText: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  reviewDate: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
