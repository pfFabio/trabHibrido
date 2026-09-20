import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface CategoryItem {
  id: string;
  name: string;
  placeholderUri: string;
  color: string;
  label: string;
}

const GAME_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Ação', placeholderUri: 'https://placehold.co/72x72/EF5350/FFFFFF/png?text=A%C3%A7%C3%A3o', color: '#EF5350', label: 'AC' },
  { id: '2', name: 'Simulador', placeholderUri: 'https://placehold.co/72x72/26A69A/FFFFFF/png?text=Sim', color: '#26A69A', label: 'SI' },
  { id: '3', name: 'Quebra-cabeças', placeholderUri: 'https://placehold.co/72x72/29B6F6/FFFFFF/png?text=Quebra', color: '#29B6F6', label: 'QC' },
  { id: '4', name: 'Aventura', placeholderUri: 'https://placehold.co/72x72/FFCA28/333333/png?text=Avent', color: '#FFCA28', label: 'AV' },
  { id: '5', name: 'Corrida', placeholderUri: 'https://placehold.co/72x72/BA68C8/FFFFFF/png?text=Corr', color: '#BA68C8', label: 'CO' },
  { id: '6', name: 'RPG', placeholderUri: 'https://placehold.co/72x72/42A5F5/FFFFFF/png?text=RPG', color: '#42A5F5', label: 'RPG' },
  { id: '7', name: 'Estratégia', placeholderUri: 'https://placehold.co/72x72/00E676/333333/png?text=Estrat', color: '#00E676', label: 'ES' },
  { id: '8', name: 'Esportes', placeholderUri: 'https://placehold.co/72x72/F06292/FFFFFF/png?text=Esp', color: '#F06292', label: 'ESP' },
  { id: '9', name: 'Cartas', placeholderUri: 'https://placehold.co/72x72/EC407A/FFFFFF/png?text=Cartas', color: '#EC407A', label: 'CAR' },
  { id: '10', name: 'Tabuleiros', placeholderUri: 'https://placehold.co/72x72/26A69A/FFFFFF/png?text=Tab', color: '#26A69A', label: 'TAB' },
];

const APP_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Produtividade', placeholderUri: 'https://placehold.co/72x72/42A5F5/FFFFFF/png?text=Prod', color: '#42A5F5', label: 'PRO' },
  { id: '2', name: 'Ferramentas', placeholderUri: 'https://placehold.co/72x72/FFA726/FFFFFF/png?text=Ferr', color: '#FFA726', label: 'FER' },
];

// Componente de Ícone com Placeholder e Fallback
const IconPlaceholder: React.FC<{ uri: string; color: string; label: string }> = ({
  uri,
  color,
  label,
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[styles.placeholderBox, { backgroundColor: color + '22', borderColor: color + '55' }]}>
      {!hasError ? (
        <Image
          source={{ uri }}
          style={styles.placeholderImage}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <Text style={[styles.fallbackText, { color }]}>{label}</Text>
      )}
    </View>
  );
};

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'jogos' | 'apps' | 'pesquisa' | 'livros' | 'voce'>('pesquisa');

  // Garante que no navegador a página não role o body inteiro, travando a altura na viewport
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-lock-scroll';
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
        const el = document.getElementById('playstore-lock-scroll');
        if (el) el.remove();
      };
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#131314" />

      {/* Container Principal */}
      <View style={styles.container}>
        {/* Barra Superior de Pesquisa */}
        <View style={styles.headerRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#C4C7C5" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar apps e jogos"
              placeholderTextColor="#8E918F"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
              <Ionicons name="mic" size={21} color="#C4C7C5" />
            </TouchableOpacity>
          </View>

          {/* Foto de Perfil do Usuário com anel azul (Abre a tela de perfil) */}
          <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/perfil', params: { from: '/' } })}
          >
            <Image
              source={{
                uri: 'https://github.com/pfFabio.png',
              }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Conteúdo com Rolagem */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção 1: Explorar jogos */}
          <Text style={styles.sectionTitle}>Explorar jogos</Text>
          <View style={styles.grid}>
            {GAME_CATEGORIES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.categoryCard} activeOpacity={0.75}>
                <Text style={styles.categoryText} numberOfLines={1}>
                  {item.name}
                </Text>
                {/* Ícone com Placeholder */}
                <IconPlaceholder uri={item.placeholderUri} color={item.color} label={item.label} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Seção 2: Patrocinados • Sugestões para você */}
          <View style={styles.sponsoredHeaderRow}>
            <Text style={styles.sponsoredTitle}>Patrocinados • Sugestões para você</Text>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="ellipsis-vertical" size={18} color="#8E918F" />
            </TouchableOpacity>
          </View>

          {/* App Sugerido 1: Booking.com */}
          <TouchableOpacity style={styles.appCard} activeOpacity={0.75}>
            <Image
              source={{
                uri: 'https://placehold.co/96x96/003580/FFFFFF/png?text=Booking',
              }}
              style={styles.appIconImage}
              resizeMode="cover"
            />
            <View style={styles.appInfoCol}>
              <Text style={styles.appName}>Booking.com</Text>
              <Text style={styles.appSubtitle}>Viagens e lugares • Acomodação</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.appMeta}>4,9</Text>
                <Ionicons name="star" size={11} color="#C4C7C5" style={styles.starIcon} />
                <Text style={styles.appMeta}>  66 MB</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* App Sugerido 2: Shopee */}
          <TouchableOpacity style={styles.appCard} activeOpacity={0.75}>
            <Image
              source={{
                uri: 'https://placehold.co/96x96/EE4D2D/FFFFFF/png?text=Shopee',
              }}
              style={styles.appIconImage}
              resizeMode="cover"
            />
            <View style={styles.appInfoCol}>
              <Text style={styles.appName}>Shopee: Compre de Tudo Online</Text>
              <Text style={styles.appSubtitle}>Compras • Mercado on-line</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.appMeta}>4,8</Text>
                <Ionicons name="star" size={11} color="#C4C7C5" style={styles.starIcon} />
                <Text style={styles.appMeta}>  103 MB</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Seção 3: Explorar apps */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Explorar apps</Text>
          <View style={styles.grid}>
            {APP_CATEGORIES.map((item) => (
              <TouchableOpacity key={item.id} style={styles.categoryCard} activeOpacity={0.75}>
                <Text style={styles.categoryText} numberOfLines={1}>
                  {item.name}
                </Text>
                <IconPlaceholder uri={item.placeholderUri} color={item.color} label={item.label} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar (Material 3 Style - Sempre Fixo no Rodapé) */}
        <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          {/* Tab 1: Jogos */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('jogos')}
            activeOpacity={0.7}
          >
            <Ionicons name="game-controller-outline" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Jogos</Text>
          </TouchableOpacity>

          {/* Tab 2: Apps */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('apps')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="view-grid-outline" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Apps</Text>
          </TouchableOpacity>

          {/* Tab 3: Pesquisa (Ativa) */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('pesquisa')}
            activeOpacity={0.8}
          >
            <View style={styles.activePill}>
              <Ionicons name="search" size={20} color="#C2E7FF" />
            </View>
            <Text style={styles.tabLabelActive}>Pesquisa</Text>
          </TouchableOpacity>

          {/* Tab 4: Livros (Preparada para navegação quando a tela for adicionada) */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => {
              setActiveTab('livros');
              // Pronto para a futura tela de livros:
              // router.push('/livros');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="book-outline" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Livros</Text>
          </TouchableOpacity>

          {/* Tab 5: Você (Navega para a tela de Perfil informando a origem) */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push({ pathname: '/perfil', params: { from: '/' } })}
            activeOpacity={0.7}
          >
            <Ionicons name="person-outline" size={22} color="#8E918F" />
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
  container: {
    flex: 1,
    backgroundColor: '#131314',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282A2C',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#E3E3E3',
    fontSize: 15,
  },
  micBtn: {
    padding: 4,
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E3E3E3',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryCard: {
    width: '48.5%',
    height: 60,
    backgroundColor: '#1F2023',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  categoryText: {
    color: '#E3E3E3',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    marginRight: 6,
  },
  placeholderBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
  },
  fallbackText: {
    fontSize: 10,
    fontWeight: '800',
  },
  sponsoredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sponsoredTitle: {
    color: '#C4C7C5',
    fontSize: 14,
    fontWeight: '600',
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2023',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  appIconImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: '#282A2C',
  },
  appInfoCol: {
    flex: 1,
  },
  appName: {
    color: '#E3E3E3',
    fontSize: 14,
    fontWeight: '600',
  },
  appSubtitle: {
    color: '#8E918F',
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  appMeta: {
    color: '#8E918F',
    fontSize: 11,
  },
  starIcon: {
    marginLeft: 3,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#131314',
    borderTopWidth: 1,
    borderTopColor: '#1F2023',
    paddingTop: 8,
    minHeight: 56,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activePill: {
    width: 58,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#004A77',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabLabelActive: {
    color: '#C2E7FF',
    fontSize: 11,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: '#8E918F',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});
