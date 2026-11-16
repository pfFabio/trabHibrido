import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/theme';

interface StoreAppItem {
  id: string;
  name: string;
  developer: string;
  category: string;
  rating: string;
  downloads: string;
  size: string;
  color: string;
  iconLabel: string;
  description: string;
}

const APP_FILTERS = [
  'Para você',
  'Mais famosos',
  'Produtividade',
  'Ferramentas',
  'Viagens',
  'Compras',
];

const APPS_CATALOG: StoreAppItem[] = [
  {
    id: 'booking-com',
    name: 'Booking.com',
    developer: 'Booking.com Hotels & Vacation Rentals',
    category: 'Viagens',
    rating: '4,7',
    downloads: '500 mi+',
    size: '66 MB',
    color: '#003580',
    iconLabel: 'Booking',
    description:
      'Economize na sua próxima viagem com o aplicativo da Booking.com! Encontre ofertas de hotéis, apartamentos, voos e aluguel de carros em minutos.',
  },
  {
    id: 'shopee-br',
    name: 'Shopee: Compre de Tudo Online',
    developer: 'Shopee Mobile',
    category: 'Compras',
    rating: '4,8',
    downloads: '100 mi+',
    size: '103 MB',
    color: '#EE4D2D',
    iconLabel: 'Shopee',
    description:
      'Compre online com cupons de frete grátis, ofertas relâmpago diárias, Garantia Shopee e rastreamento completo dos seus pedidos.',
  },
  {
    id: 'notion-notes',
    name: 'Notion: Notas e Tarefas',
    developer: 'Notion Labs, Inc.',
    category: 'Produtividade',
    rating: '4,8',
    downloads: '10 mi+',
    size: '54 MB',
    color: '#202124',
    iconLabel: 'N',
    description:
      'Organize anotações da faculdade, quadros Kanban, documentos e projetos em equipe sincronizados na nuvem.',
  },
  {
    id: 'canva-design',
    name: 'Canva: Design, Foto e Vídeo',
    developer: 'Canva',
    category: 'Produtividade',
    rating: '4,8',
    downloads: '100 mi+',
    size: '48 MB',
    color: '#00C4CC',
    iconLabel: 'Canva',
    description:
      'Crie apresentações, currículos, posts e edições de imagem em minutos com milhares de modelos prontos.',
  },
  {
    id: 'duolingo-app',
    name: 'Duolingo: Inglês e Muito Mais',
    developer: 'Duolingo',
    category: 'Produtividade',
    rating: '4,7',
    downloads: '500 mi+',
    size: '61 MB',
    color: '#58CC02',
    iconLabel: 'Duo',
    description:
      'Aprenda idiomas com lições rápidas, exercícios interativos de pronúncia e ofensivas diárias gamificadas.',
  },
  {
    id: 'google-files',
    name: 'Files do Google',
    developer: 'Google LLC',
    category: 'Ferramentas',
    rating: '4,7',
    downloads: '1 bi+',
    size: '19 MB',
    color: '#1A73E8',
    iconLabel: 'Files',
    description:
      'Libere espaço de armazenamento com recomendações inteligentes, encontre arquivos rápido e compartilhe offline.',
  },
];

export default function AppsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const params = useLocalSearchParams<{ category?: string }>();
  const initialFilter =
    params.category && APP_FILTERS.includes(params.category) ? params.category : 'Para você';

  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (params.category && APP_FILTERS.includes(params.category)) {
      setSelectedFilter(params.category);
    }
  }, [params.category]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-apps-scroll';
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
        document.getElementById('playstore-apps-scroll')?.remove();
      };
    }
  }, []);

  const filteredApps = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return APPS_CATALOG.filter((app) => {
      const matchesFilter =
        selectedFilter === 'Para você' ||
        selectedFilter === 'Mais famosos' ||
        app.category === selectedFilter;
      const matchesQuery =
        !query ||
        app.name.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query) ||
        app.developer.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [selectedFilter, searchText]);

  const openAppDetails = (app: StoreAppItem) => {
    router.push({
      pathname: '/booking-detalhes',
      params: {
        id: app.id,
        name: app.name,
        developer: app.developer,
        category: app.category,
        rating: app.rating,
        downloads: app.downloads,
        size: app.size,
        color: app.color,
        iconLabel: app.iconLabel,
        description: app.description,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.container}>
        {/* Barra Superior de Pesquisa + Perfil */}
        <View style={styles.headerRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar apps"
              placeholderTextColor={colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/perfil', params: { from: '/apps' } })}
          >
            <Image
              source={{ uri: 'https://github.com/pfFabio.png' }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Chips de Filtro */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {APP_FILTERS.map((filter) => {
              const active = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  activeOpacity={0.75}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, isWide && styles.wideContent]}
          showsVerticalScrollIndicator={false}
        >
          {/* Carrossel Horizontal: Recomendados */}
          <Text style={styles.sectionTitle}>Recomendados para você</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCarousel}
          >
            {APPS_CATALOG.slice(0, 4).map((app) => (
              <TouchableOpacity
                key={`rec-${app.id}`}
                style={styles.carouselCard}
                activeOpacity={0.8}
                onPress={() => openAppDetails(app)}
              >
                <View style={[styles.carouselIconBox, { backgroundColor: app.color }]}>
                  <Text style={styles.carouselIconText} numberOfLines={1}>
                    {app.iconLabel}
                  </Text>
                </View>
                <Text style={styles.carouselAppName} numberOfLines={2}>
                  {app.name}
                </Text>
                <Text style={styles.carouselAppMeta}>
                  {app.rating} ★ • {app.size}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Lista Vertical Filtrada */}
          <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
            {selectedFilter === 'Para você' ? 'Aplicativos essenciais' : `Apps • ${selectedFilter}`}
          </Text>

          {filteredApps.length === 0 ? (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="view-grid-outline" size={44} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhum aplicativo encontrado</Text>
              <Text style={styles.emptySub}>Tente outra palavra-chave ou categoria.</Text>
            </View>
          ) : (
            filteredApps.map((app, index) => (
              <TouchableOpacity
                key={app.id}
                style={styles.appRow}
                activeOpacity={0.75}
                onPress={() => openAppDetails(app)}
              >
                <Text style={styles.rankText}>{index + 1}</Text>
                <View style={[styles.appIconBox, { backgroundColor: app.color }]}>
                  <Text style={styles.appIconText} numberOfLines={1}>
                    {app.iconLabel}
                  </Text>
                </View>
                <View style={styles.appInfoCol}>
                  <Text style={styles.appTitle} numberOfLines={1}>
                    {app.name}
                  </Text>
                  <Text style={styles.appCategory} numberOfLines={1}>
                    {app.category} • {app.developer}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.appMeta}>{app.rating}</Text>
                    <Ionicons name="star" size={11} color={colors.textSecondary} />
                    <Text style={styles.appMeta}> • {app.size}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Bottom Navigation Bar Fixo */}
        <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/jogos')}
            activeOpacity={0.7}
          >
            <Ionicons name="game-controller-outline" size={22} color={colors.textMuted} />
            <Text style={styles.tabLabelInactive}>Jogos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem} activeOpacity={0.85}>
            <View style={styles.activePill}>
              <MaterialCommunityIcons name="view-grid" size={20} color={colors.onPrimaryContainer} />
            </View>
            <Text style={styles.tabLabelActive}>Apps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/')}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={22} color={colors.textMuted} />
            <Text style={styles.tabLabelInactive}>Pesquisa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/livros')}
            activeOpacity={0.7}
          >
            <Ionicons name="book-outline" size={22} color={colors.textMuted} />
            <Text style={styles.tabLabelInactive}>Livros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push({ pathname: '/perfil', params: { from: '/apps' } })}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={22} color={colors.textMuted} />
            <Text style={styles.tabLabelInactive}>Você</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: spacing.sm,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#7FCFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  filtersWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
    paddingBottom: 10,
  },
  filtersScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
  },
  filterChipActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 96,
  },
  wideContent: {
    maxWidth: 1120,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  horizontalCarousel: {
    gap: 14,
    paddingRight: spacing.md,
  },
  carouselCard: {
    width: 112,
  },
  carouselIconBox: {
    width: 112,
    height: 112,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
  },
  carouselIconText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  carouselAppName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 17,
  },
  carouselAppMeta: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  rankText: {
    width: 18,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  appIconBox: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  appInfoCol: {
    flex: 1,
    gap: 2,
  },
  appTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  appCategory: {
    color: colors.textMuted,
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  appMeta: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySub: {
    color: colors.textMuted,
    fontSize: 13,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
    paddingTop: 8,
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activePill: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.onPrimaryContainer,
  },
  tabLabelInactive: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
  },
});
