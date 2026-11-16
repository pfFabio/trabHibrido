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

interface GameItem {
  id: string;
  name: string;
  developer: string;
  category: string;
  rating: string;
  downloads: string;
  size: string;
  color: string;
  iconLabel: string;
  featured?: boolean;
  description: string;
}

const GAME_FILTERS = [
  'Para você',
  'Mais populares',
  'Ação',
  'RPG',
  'Estratégia',
  'Corrida',
  'Simulador',
  'Quebra-cabeças',
];

const GAMES_CATALOG: GameItem[] = [
  {
    id: 'game-genshin-impact',
    name: 'Genshin Impact',
    developer: 'COGNOSPHERE PTE. LTD.',
    category: 'RPG',
    rating: '4,6',
    downloads: '100 mi+',
    size: '485 MB',
    color: '#2E3A59',
    iconLabel: 'GI',
    featured: true,
    description:
      'Explore o vasto mundo aberto de Teyvat com combates elementais, missões cooperativas e trilha sonora orquestrada.',
  },
  {
    id: 'game-brawl-stars',
    name: 'Brawl Stars',
    developer: 'Supercell',
    category: 'Ação',
    rating: '4,5',
    downloads: '500 mi+',
    size: '164 MB',
    color: '#D97706',
    iconLabel: 'BS',
    description:
      'Batalhas frenéticas 3v3 e sobrevivência em partidas rápidas de até 3 minutos com dezenas de Brawlers desbloqueáveis.',
  },
  {
    id: 'game-clash-royale',
    name: 'Clash Royale',
    developer: 'Supercell',
    category: 'Estratégia',
    rating: '4,4',
    downloads: '500 mi+',
    size: '198 MB',
    color: '#1D4ED8',
    iconLabel: 'CR',
    description:
      'Monte seu deck de batalha, destrua as torres adversárias em tempo real e conquiste troféus na arena global.',
  },
  {
    id: 'game-asphalt-legends',
    name: 'Asphalt Legends Unite',
    developer: 'Gameloft SE',
    category: 'Corrida',
    rating: '4,7',
    downloads: '100 mi+',
    size: '1,9 GB',
    color: '#B91C1C',
    iconLabel: 'A9',
    description:
      'Corridas arcade em alta velocidade com supercarros licenciados, manobras acrobáticas e modo multijogador online.',
  },
  {
    id: 'game-stardew-valley',
    name: 'Stardew Valley',
    developer: 'ConcernedApe',
    category: 'Simulador',
    rating: '4,9',
    downloads: '5 mi+',
    size: '340 MB',
    color: '#15803D',
    iconLabel: 'SV',
    description:
      'Construa a fazenda dos seus sonhos, explore cavernas misteriosas, pesque e crie laços com os moradores da vila.',
  },
  {
    id: 'game-block-blast',
    name: 'Block Blast!',
    developer: 'Hungry Studio',
    category: 'Quebra-cabeças',
    rating: '4,8',
    downloads: '500 mi+',
    size: '78 MB',
    color: '#0284C7',
    iconLabel: 'BB',
    description:
      'Combine blocos coloridos em um tabuleiro clássico 8x8 para treinar o raciocínio lógico sem precisar de internet.',
  },
  {
    id: 'game-honkai-star-rail',
    name: 'Honkai: Star Rail',
    developer: 'COGNOSPHERE PTE. LTD.',
    category: 'RPG',
    rating: '4,7',
    downloads: '50 mi+',
    size: '620 MB',
    color: '#4338CA',
    iconLabel: 'HSR',
    description:
      'Embarque no Expresso Astral nesta aventura espacial de RPG por turnos com história cinematográfica.',
  },
];

export default function GamesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const params = useLocalSearchParams<{ category?: string }>();
  const initialFilter =
    params.category && GAME_FILTERS.includes(params.category) ? params.category : 'Para você';

  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (params.category && GAME_FILTERS.includes(params.category)) {
      setSelectedFilter(params.category);
    }
  }, [params.category]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-games-scroll';
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
        document.getElementById('playstore-games-scroll')?.remove();
      };
    }
  }, []);

  const filteredGames = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return GAMES_CATALOG.filter((game) => {
      const matchesFilter =
        selectedFilter === 'Para você' ||
        selectedFilter === 'Mais populares' ||
        game.category === selectedFilter;
      const matchesQuery =
        !query ||
        game.name.toLowerCase().includes(query) ||
        game.category.toLowerCase().includes(query) ||
        game.developer.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [selectedFilter, searchText]);

  const featuredGame = GAMES_CATALOG[0];

  const openGameDetails = (game: GameItem) => {
    router.push({
      pathname: '/booking-detalhes',
      params: {
        id: game.id,
        name: game.name,
        developer: game.developer,
        category: game.category,
        rating: game.rating,
        downloads: game.downloads,
        size: game.size,
        color: game.color,
        iconLabel: game.iconLabel,
        description: game.description,
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
              placeholder="Pesquisar jogos"
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
            onPress={() => router.push({ pathname: '/perfil', params: { from: '/jogos' } })}
          >
            <Image
              source={{ uri: 'https://github.com/pfFabio.png' }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Chips de Filtro de Categorias */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {GAME_FILTERS.map((filter) => {
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
          {/* Banner de Destaque da Semana */}
          {selectedFilter === 'Para você' && !searchText.trim() && (
            <TouchableOpacity
              style={styles.featuredBanner}
              activeOpacity={0.85}
              onPress={() => openGameDetails(featuredGame)}
            >
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>ESCOLHA DOS EDITORES</Text>
              </View>
              <Text style={styles.featuredTitle}>{featuredGame.name}</Text>
              <Text style={styles.featuredDesc} numberOfLines={2}>
                {featuredGame.description}
              </Text>
              <View style={styles.featuredFooter}>
                <View style={[styles.gameIconSmall, { backgroundColor: featuredGame.color }]}>
                  <Text style={styles.gameIconSmallText}>{featuredGame.iconLabel}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featuredDev}>{featuredGame.developer}</Text>
                  <Text style={styles.featuredMeta}>
                    {featuredGame.category} • {featuredGame.rating} ★ • {featuredGame.size}
                  </Text>
                </View>
                <View style={styles.installPill}>
                  <Text style={styles.installPillText}>Ver</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Lista de Jogos */}
          <Text style={styles.sectionTitle}>
            {selectedFilter === 'Para você' ? 'Jogos em alta' : `Jogos • ${selectedFilter}`}
          </Text>

          {filteredGames.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="game-controller-outline" size={44} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhum jogo encontrado</Text>
              <Text style={styles.emptySub}>Tente limpar a busca ou trocar a categoria.</Text>
            </View>
          ) : (
            filteredGames.map((game, index) => (
              <TouchableOpacity
                key={game.id}
                style={styles.gameRow}
                activeOpacity={0.75}
                onPress={() => openGameDetails(game)}
              >
                <Text style={styles.rankText}>{index + 1}</Text>
                <View style={[styles.gameIconBox, { backgroundColor: game.color }]}>
                  <Text style={styles.gameIconText}>{game.iconLabel}</Text>
                </View>
                <View style={styles.gameInfoCol}>
                  <Text style={styles.gameTitle} numberOfLines={1}>
                    {game.name}
                  </Text>
                  <Text style={styles.gameCategory} numberOfLines={1}>
                    {game.category} • {game.developer}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.gameMeta}>{game.rating}</Text>
                    <Ionicons name="star" size={11} color={colors.textSecondary} />
                    <Text style={styles.gameMeta}> • {game.size}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Bottom Navigation Bar Fixo */}
        <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <TouchableOpacity style={styles.tabItem} activeOpacity={0.85}>
            <View style={styles.activePill}>
              <Ionicons name="game-controller" size={20} color={colors.onPrimaryContainer} />
            </View>
            <Text style={styles.tabLabelActive}>Jogos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/apps')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="view-grid-outline" size={22} color={colors.textMuted} />
            <Text style={styles.tabLabelInactive}>Apps</Text>
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
            onPress={() => router.push({ pathname: '/perfil', params: { from: '/jogos' } })}
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
  featuredBanner: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  featuredBadgeText: {
    color: colors.onPrimaryContainer,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  featuredTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  featuredDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: spacing.xs,
  },
  gameIconSmall: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIconSmallText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  featuredDev: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  featuredMeta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  installPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  installPillText: {
    color: '#062E6F',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  gameRow: {
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
  gameIconBox: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  gameInfoCol: {
    flex: 1,
    gap: 2,
  },
  gameTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  gameCategory: {
    color: colors.textMuted,
    fontSize: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  gameMeta: {
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
