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

interface BookItem {
  id: string;
  title: string;
  subtitle?: string;
  author?: string;
  bgColor: string;
  accentColor: string;
  iconName?: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
  isMaterialIcon?: boolean;
  coverLabel?: string;
  originalPrice?: string;
  price: string;
}

// 1. E-books por menos de R$ 5 (15 Livros)
const EBOOKS_SUB_5: BookItem[] = [
  {
    id: '1',
    title: 'Você Já Sabe: Por que o Seu C...',
    subtitle: 'Por que o cérebro se recusa',
    bgColor: '#141416',
    accentColor: '#FF6B00',
    iconName: 'bulb-outline',
    coverLabel: 'VOCÊ JÁ\nSABE',
    originalPrice: 'R$ 4,99',
    price: 'R$ 2,78',
  },
  {
    id: '2',
    title: 'Como chegar ao sim com você ...',
    subtitle: 'William Ury',
    bgColor: '#0284C7',
    accentColor: '#BAE6FD',
    iconName: 'checkmark-circle-outline',
    coverLabel: 'SIM\nCOM VOCÊ',
    price: 'R$ 4,32',
  },
  {
    id: '3',
    title: 'Psicologia Sombria do Di...',
    subtitle: 'Controle Financeiro Mental',
    bgColor: '#18181B',
    accentColor: '#EAB308',
    iconName: 'key-outline',
    coverLabel: 'DO\nDINHEIRO',
    price: 'R$ 2,78',
  },
  {
    id: '4',
    title: '10 HÁBITOS JAPONESES...',
    subtitle: 'Para Melhorar Sua Vida',
    bgColor: '#FAF7F2',
    accentColor: '#DC2626',
    iconName: 'flower-outline',
    coverLabel: '10 HÁBITOS\nJAPÃO',
    originalPrice: 'R$ 12,90',
    price: 'R$ 0,99',
  },
  {
    id: '5',
    title: 'O Poder do Foco Silencioso',
    subtitle: 'Alta Concentração',
    bgColor: '#1E293B',
    accentColor: '#38BDF8',
    iconName: 'eye-outline',
    coverLabel: 'FOCO\nTOTAL',
    originalPrice: 'R$ 4,90',
    price: 'R$ 1,99',
  },
  {
    id: '6',
    title: 'A Arte de Falar em Público',
    subtitle: 'Oratória Descomplicada',
    bgColor: '#431407',
    accentColor: '#FDBA74',
    iconName: 'mic-outline',
    coverLabel: 'ARTE DE\nFALAR',
    originalPrice: 'R$ 9,90',
    price: 'R$ 3,49',
  },
  {
    id: '7',
    title: 'Mindset de Sucesso Diário',
    subtitle: 'Rotinas Vitoriosas',
    bgColor: '#1E1B4B',
    accentColor: '#A78BFA',
    iconName: 'trophy-outline',
    coverLabel: 'MINDSET\nDIÁRIO',
    price: 'R$ 3,89',
  },
  {
    id: '8',
    title: 'Finanças Sem Complicação',
    subtitle: 'Economize Todo Mês',
    bgColor: '#064E3B',
    accentColor: '#6EE7B7',
    iconName: 'wallet-outline',
    coverLabel: 'FINANÇAS\nFÁCEIS',
    originalPrice: 'R$ 15,00',
    price: 'R$ 4,90',
  },
  {
    id: '9',
    title: 'Inteligência Emocional Prática',
    subtitle: 'Autocontrole e Empatia',
    bgColor: '#831843',
    accentColor: '#F9A8D4',
    iconName: 'heart-half-outline',
    coverLabel: 'INTELIGÊNCIA\nEMOCIONAL',
    price: 'R$ 2,99',
  },
  {
    id: '10',
    title: 'Guia Rápido do Estoicismo',
    subtitle: 'Sêneca & Marco Aurélio',
    bgColor: '#262626',
    accentColor: '#E5E5E5',
    iconName: 'cube-outline',
    coverLabel: 'GUIA\nESTÓICO',
    originalPrice: 'R$ 8,50',
    price: 'R$ 2,50',
  },
  {
    id: '11',
    title: 'Programação em Python Fácil',
    subtitle: 'Iniciantes ao Código',
    bgColor: '#0C4A6E',
    accentColor: '#FDE047',
    iconName: 'code-slash-outline',
    coverLabel: 'PYTHON\nEXPRESS',
    price: 'R$ 4,95',
  },
  {
    id: '12',
    title: 'O Milagre das 5 da Manhã',
    subtitle: 'Desperte Seu Potencial',
    bgColor: '#7C2D12',
    accentColor: '#FED7AA',
    iconName: 'sunny-outline',
    coverLabel: 'CLUBE DAS\n5H',
    originalPrice: 'R$ 14,90',
    price: 'R$ 3,75',
  },
  {
    id: '13',
    title: 'Comunicação Não-Violenta',
    subtitle: 'Diálogos Construtivos',
    bgColor: '#14532D',
    accentColor: '#86EFAC',
    iconName: 'chatbubble-ellipses-outline',
    coverLabel: 'CONECTAR &\nOUVIR',
    price: 'R$ 4,50',
  },
  {
    id: '14',
    title: 'Ansiedade Zero: Guia de Bolso',
    subtitle: 'Técnicas de Respiração',
    bgColor: '#164E63',
    accentColor: '#67E8F9',
    iconName: 'leaf-outline',
    coverLabel: 'CALMA\nAGORA',
    originalPrice: 'R$ 6,90',
    price: 'R$ 1,89',
  },
  {
    id: '15',
    title: 'Minimalismo na Prática',
    subtitle: 'Viva com Menos',
    bgColor: '#171717',
    accentColor: '#A3A3A3',
    iconName: 'remove-outline',
    coverLabel: 'MENOS É\nMAIS',
    price: 'R$ 3,20',
  },
];

// 2. Os mais vendidos (15 Livros)
const BEST_SELLERS: BookItem[] = [
  {
    id: '1',
    title: 'Não deixe tudo te abalar: Com...',
    subtitle: 'Daniel Chidiac',
    bgColor: '#F4F4F5',
    accentColor: '#B45309',
    iconName: 'cafe-outline',
    coverLabel: 'NÃO DEIXE\nTUDO TE ABALAR',
    price: 'R$ 33,24',
  },
  {
    id: '2',
    title: 'Muito Prazer: Fal...',
    subtitle: 'Livro 1',
    bgColor: '#0F766E',
    accentColor: '#CCFBF1',
    iconName: 'chatbubbles-outline',
    coverLabel: 'MUITO\nPRAZER',
    price: 'R$ 95,00',
  },
  {
    id: '3',
    title: 'Homem-Aran... Vol. 1',
    subtitle: 'Vol. 1',
    bgColor: '#1E1B4B',
    accentColor: '#EF4444',
    iconName: 'flash-outline',
    coverLabel: 'HOMEM\nARANHA',
    price: 'R$ 17,50',
  },
  {
    id: '4',
    title: 'O diário de uma princesa...',
    subtitle: 'Edição Comemorativa',
    bgColor: '#FDF2F8',
    accentColor: '#EC4899',
    iconName: 'heart-outline',
    coverLabel: 'DIÁRIO DA\nPRINCESA',
    price: 'R$ 37,90',
  },
  {
    id: '5',
    title: 'A Psicologia Financeira',
    subtitle: 'Morgan Housel',
    bgColor: '#064E3B',
    accentColor: '#34D399',
    iconName: 'trending-up-outline',
    coverLabel: 'PSICOLOGIA\nFINANCEIRA',
    price: 'R$ 39,90',
  },
  {
    id: '6',
    title: 'Hábitos Atômicos',
    subtitle: 'James Clear',
    bgColor: '#FAF7F2',
    accentColor: '#EA580C',
    iconName: 'sparkles-outline',
    coverLabel: 'HÁBITOS\nATÔMICOS',
    price: 'R$ 44,50',
  },
  {
    id: '7',
    title: 'Café com Deus Pai 2026',
    subtitle: 'Junior Rostirola',
    bgColor: '#451A03',
    accentColor: '#FDE68A',
    iconName: 'bookmark-outline',
    coverLabel: 'CAFÉ COM\nDEUS PAI',
    price: 'R$ 52,90',
  },
  {
    id: '8',
    title: 'A Coragem de Ser Imperfeito',
    subtitle: 'Brené Brown',
    bgColor: '#701A75',
    accentColor: '#F5D0FE',
    iconName: 'shield-checkmark-outline',
    coverLabel: 'CORAGEM &\nVULNERABILIDADE',
    price: 'R$ 38,00',
  },
  {
    id: '9',
    title: 'É Assim que Acaba',
    subtitle: 'Colleen Hoover',
    bgColor: '#881337',
    accentColor: '#FECDD3',
    iconName: 'rose-outline',
    coverLabel: 'É ASSIM\nQUE ACABA',
    price: 'R$ 35,90',
  },
  {
    id: '10',
    title: 'Pai Rico, Pai Pobre',
    subtitle: 'Robert T. Kiyosaki',
    bgColor: '#3B0764',
    accentColor: '#E9D5FF',
    iconName: 'cash-outline',
    coverLabel: 'PAI RICO\nPAI POBRE',
    price: 'R$ 42,90',
  },
  {
    id: '11',
    title: 'Mulheres que Correm com os Lobos',
    subtitle: 'Clarissa Pinkola Estés',
    bgColor: '#1C1917',
    accentColor: '#FB923C',
    iconName: 'moon-outline',
    coverLabel: 'LOBOS &\nMULHERES',
    price: 'R$ 68,00',
  },
  {
    id: '12',
    title: 'O Homem Mais Rico da Babilônia',
    subtitle: 'George S. Clason',
    bgColor: '#713F12',
    accentColor: '#FEF08A',
    iconName: 'diamond-outline',
    coverLabel: 'HOMEM MAIS\nRICO',
    price: 'R$ 22,90',
  },
  {
    id: '13',
    title: 'As 48 Leis do Poder',
    subtitle: 'Robert Greene',
    bgColor: '#111827',
    accentColor: '#F87171',
    iconName: 'flag-outline',
    coverLabel: '48 LEIS\nDO PODER',
    price: 'R$ 58,90',
  },
  {
    id: '14',
    title: 'Tudo é Rio',
    subtitle: 'Carla Madeira',
    bgColor: '#083344',
    accentColor: '#7DD3FC',
    iconName: 'water-outline',
    coverLabel: 'TUDO É\nRIO',
    price: 'R$ 36,90',
  },
  {
    id: '15',
    title: 'A Revolução dos Bichos',
    subtitle: 'George Orwell',
    bgColor: '#450A0A',
    accentColor: '#FCA5A5',
    iconName: 'alert-circle-outline',
    coverLabel: 'REVOLUÇÃO\nDOS BICHOS',
    price: 'R$ 19,90',
  },
];

// 3. Livros levados para a tela (15 Livros)
const SCREEN_ADAPTATIONS: BookItem[] = [
  {
    id: '1',
    title: 'Duna: Crônicas de Arrakis',
    subtitle: 'Frank Herbert',
    bgColor: '#78350F',
    accentColor: '#FDE68A',
    iconName: 'planet-outline',
    coverLabel: 'DUNA',
    price: 'R$ 44,90',
  },
  {
    id: '2',
    title: 'O Senhor dos Anéis: A Sociedade',
    subtitle: 'J.R.R. Tolkien',
    bgColor: '#14532D',
    accentColor: '#BBF7D0',
    iconName: 'shield-outline',
    coverLabel: 'SENHOR\nDOS ANÉIS',
    price: 'R$ 62,90',
  },
  {
    id: '3',
    title: 'O Gambito da Rainha',
    subtitle: 'Walter Tevis',
    bgColor: '#312E81',
    accentColor: '#C7D2FE',
    iconName: 'grid-outline',
    coverLabel: 'GAMBITO\nDA RAINHA',
    price: 'R$ 32,00',
  },
  {
    id: '4',
    title: 'Percy Jackson & O Ladrão de Raios',
    subtitle: 'Rick Riordan',
    bgColor: '#1E3A8A',
    accentColor: '#60A5FA',
    iconName: 'water-outline',
    coverLabel: 'PERCY\nJACKSON',
    price: 'R$ 29,90',
  },
  {
    id: '5',
    title: 'Jogos Vorazes: Edição Especial',
    subtitle: 'Suzanne Collins',
    bgColor: '#7C2D12',
    accentColor: '#FDBA74',
    iconName: 'flame-outline',
    coverLabel: 'JOGOS\nVORAZES',
    price: 'R$ 34,90',
  },
  {
    id: '6',
    title: 'Harry Potter e a Pedra Filosofal',
    subtitle: 'J.K. Rowling',
    bgColor: '#581C87',
    accentColor: '#E9D5FF',
    iconName: 'color-wand-outline',
    coverLabel: 'HARRY\nPOTTER',
    price: 'R$ 39,90',
  },
  {
    id: '7',
    title: 'A Culpa é das Estrelas',
    subtitle: 'John Green',
    bgColor: '#0284C7',
    accentColor: '#BAE6FD',
    iconName: 'cloudy-outline',
    coverLabel: 'A CULPA É DAS\nESTRELAS',
    price: 'R$ 27,90',
  },
  {
    id: '8',
    title: 'O Iluminado',
    subtitle: 'Stephen King',
    bgColor: '#1C1917',
    accentColor: '#EF4444',
    iconName: 'skull-outline',
    coverLabel: 'O\nILUMINADO',
    price: 'R$ 48,00',
  },
  {
    id: '9',
    title: 'O Poderoso Chefão',
    subtitle: 'Mario Puzo',
    bgColor: '#0F172A',
    accentColor: '#F59E0B',
    iconName: 'glasses-outline',
    coverLabel: 'PODEROSO\nCHEFÃO',
    price: 'R$ 41,50',
  },
  {
    id: '10',
    title: 'A Roda do Tempo: Olho do Mundo',
    subtitle: 'Robert Jordan',
    bgColor: '#064E3B',
    accentColor: '#A7F3D0',
    iconName: 'refresh-outline',
    coverLabel: 'RODA DO\nTEMPO',
    price: 'R$ 59,90',
  },
  {
    id: '11',
    title: 'Fundação',
    subtitle: 'Isaac Asimov',
    bgColor: '#1E1B4B',
    accentColor: '#818CF8',
    iconName: 'rocket-outline',
    coverLabel: 'FUNDAÇÃO\nASIMOV',
    price: 'R$ 38,90',
  },
  {
    id: '12',
    title: 'Good Omens: Belas Maldições',
    subtitle: 'Neil Gaiman & T. Pratchett',
    bgColor: '#451A03',
    accentColor: '#FDE68A',
    iconName: 'hourglass-outline',
    coverLabel: 'GOOD\nOMENS',
    price: 'R$ 33,50',
  },
  {
    id: '13',
    title: 'Garota Exemplar',
    subtitle: 'Gillian Flynn',
    bgColor: '#18181B',
    accentColor: '#38BDF8',
    iconName: 'finger-print-outline',
    coverLabel: 'GAROTA\nEXEMPLAR',
    price: 'R$ 28,90',
  },
  {
    id: '14',
    title: 'Blade Runner: Androides Sonham?',
    subtitle: 'Philip K. Dick',
    bgColor: '#312E81',
    accentColor: '#F43F5E',
    iconName: 'hardware-chip-outline',
    coverLabel: 'BLADE\nRUNNER',
    price: 'R$ 36,00',
  },
  {
    id: '15',
    title: 'O Silêncio dos Inocentes',
    subtitle: 'Thomas Harris',
    bgColor: '#171717',
    accentColor: '#A855F7',
    iconName: 'eye-off-outline',
    coverLabel: 'SILÊNCIO DOS\nINOCENTES',
    price: 'R$ 31,90',
  },
];

// Componente estilizado de Capa de Livro de Demonstração (Ícone + Nome)
const BookCard: React.FC<{ book: BookItem }> = ({ book }) => {
  const isLightBg = book.bgColor === '#FAF7F2' || book.bgColor === '#F4F4F5' || book.bgColor === '#FDF2F8';
  const textColor = isLightBg ? '#18181B' : '#F4F4F5';

  return (
    <TouchableOpacity style={styles.bookCardContainer} activeOpacity={0.8}>
      {/* Capa com proporção de livro real */}
      <View style={[styles.bookCoverWrapper, { backgroundColor: book.bgColor }]}>
        {/* Lombada e relevo 3D do livro */}
        <View style={[styles.spineEffect, { borderRightColor: isLightBg ? '#E4E4E7' : '#27272A' }]} />
        <View style={styles.bookSpineShadow} />

        {/* Badge demonstrativa no topo da capa */}
        <View style={[styles.demoTag, { backgroundColor: isLightBg ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.12)' }]}>
          <Text style={[styles.demoTagText, { color: textColor }]}>DEMO</Text>
        </View>

        {/* Conteúdo Central: Ícone Temático e Nome */}
        <View style={styles.bookArtFallback}>
          <View style={[styles.iconCircle, { backgroundColor: book.accentColor + '25', borderColor: book.accentColor + '55' }]}>
            <Ionicons
              name={(book.iconName as any) || 'book-outline'}
              size={24}
              color={book.accentColor}
            />
          </View>
          <Text
            style={[
              styles.coverArtworkText,
              { color: textColor },
            ]}
            numberOfLines={3}
          >
            {book.coverLabel || book.title}
          </Text>
        </View>
      </View>

      {/* Título do Livro */}
      <Text style={styles.bookTitle} numberOfLines={2}>
        {book.title}
      </Text>

      {/* Subtítulo / Edição (se houver) */}
      {book.subtitle && (
        <Text style={styles.bookSubtitle} numberOfLines={1}>
          {book.subtitle}
        </Text>
      )}

      {/* Preço com riscado promocional */}
      <View style={styles.priceRow}>
        {book.originalPrice && (
          <Text style={styles.originalPriceText}>{book.originalPrice}</Text>
        )}
        <Text style={styles.currentPriceText}>{book.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function BooksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'ebooks' | 'audiolivros' | 'generos' | 'mais_vendidos'>('ebooks');

  // Trava de rolagem para modo web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-books-lock-scroll';
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
        const el = document.getElementById('playstore-books-lock-scroll');
        if (el) el.remove();
      };
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#131314" />

      <View style={styles.container}>
        {/* Barra Superior de Pesquisa */}
        <View style={styles.headerRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#C4C7C5" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar livros"
              placeholderTextColor="#8E918F"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
              <Ionicons name="mic" size={21} color="#C4C7C5" />
            </TouchableOpacity>
          </View>

          {/* Foto de Perfil com Anel Azul do Google */}
          <TouchableOpacity
            style={styles.avatarContainer}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/perfil', params: { from: '/livros' } })}
          >
            <Image
              source={{
                uri: 'https://github.com/pfFabio.png',
              }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>

        {/* Abas Superiores de Filtros / Chips (E-books, Audiolivros, Gêneros...) */}
        <View style={styles.subTabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subTabsScroll}
          >
            <TouchableOpacity
              style={styles.subTabItem}
              onPress={() => setActiveSubTab('ebooks')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeSubTab === 'ebooks' && styles.subTabTextActive,
                ]}
              >
                E-books
              </Text>
              {activeSubTab === 'ebooks' && <View style={styles.subTabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subTabItem}
              onPress={() => setActiveSubTab('audiolivros')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeSubTab === 'audiolivros' && styles.subTabTextActive,
                ]}
              >
                Audiolivros
              </Text>
              {activeSubTab === 'audiolivros' && <View style={styles.subTabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subTabItem}
              onPress={() => setActiveSubTab('generos')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeSubTab === 'generos' && styles.subTabTextActive,
                ]}
              >
                Gêneros
              </Text>
              {activeSubTab === 'generos' && <View style={styles.subTabIndicator} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.subTabItem}
              onPress={() => setActiveSubTab('mais_vendidos')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subTabText,
                  activeSubTab === 'mais_vendidos' && styles.subTabTextActive,
                ]}
              >
                Os mais vendidos
              </Text>
              {activeSubTab === 'mais_vendidos' && <View style={styles.subTabIndicator} />}
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Conteúdo Principal Rolável */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção 1: E-books por menos de R$ 5 */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>E-books por menos de R$ 5</Text>
            <TouchableOpacity style={styles.circleArrowBtn} activeOpacity={0.7}>
              <Ionicons name="arrow-forward" size={18} color="#E3E3E3" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.booksRowScroll}
          >
            {EBOOKS_SUB_5.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ScrollView>

          {/* Seção 2: Os mais vendidos */}
          <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
            <Text style={styles.sectionTitle}>Os mais vendidos</Text>
            <TouchableOpacity style={styles.circleArrowBtn} activeOpacity={0.7}>
              <Ionicons name="arrow-forward" size={18} color="#E3E3E3" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.booksRowScroll}
          >
            {BEST_SELLERS.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ScrollView>

          {/* Seção 3: Livros levados para a tela */}
          <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
            <Text style={styles.sectionTitle}>Livros levados para a tela</Text>
            <TouchableOpacity style={styles.circleArrowBtn} activeOpacity={0.7}>
              <Ionicons name="arrow-forward" size={18} color="#E3E3E3" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.booksRowScroll, { paddingBottom: 28 }]}
          >
            {SCREEN_ADAPTATIONS.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ScrollView>
        </ScrollView>

        {/* Bottom Navigation Bar (Material 3 Style - Fixo no Rodapé) */}
        <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          {/* Tab 1: Jogos */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/')}
            activeOpacity={0.7}
          >
            <Ionicons name="game-controller-outline" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Jogos</Text>
          </TouchableOpacity>

          {/* Tab 2: Apps */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="view-grid-outline" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Apps</Text>
          </TouchableOpacity>

          {/* Tab 3: Pesquisa */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/')}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Pesquisa</Text>
          </TouchableOpacity>

          {/* Tab 4: Livros (Ativa com Pill Azul) */}
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.85}
          >
            <View style={styles.activePill}>
              <Ionicons name="book" size={20} color="#C2E7FF" />
            </View>
            <Text style={styles.tabLabelActive}>Livros</Text>
          </TouchableOpacity>

          {/* Tab 5: Você (Perfil) */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push({ pathname: '/perfil', params: { from: '/livros' } })}
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 12,
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
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#E3E3E3',
    fontSize: 15,
    paddingVertical: 0,
  },
  micBtn: {
    padding: 4,
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#7FCFFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  subTabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#282A2C',
    marginTop: 6,
  },
  subTabsScroll: {
    paddingHorizontal: 16,
    gap: 22,
  },
  subTabItem: {
    paddingVertical: 10,
    position: 'relative',
  },
  subTabText: {
    color: '#C4C7C5',
    fontSize: 14,
    fontWeight: '500',
  },
  subTabTextActive: {
    color: '#A8C7FA',
    fontWeight: '600',
  },
  subTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#A8C7FA',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E3E3E3',
    letterSpacing: 0.2,
  },
  circleArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E1F22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  booksRowScroll: {
    paddingHorizontal: 16,
    gap: 14,
  },
  bookCardContainer: {
    width: 116,
  },
  bookCoverWrapper: {
    width: 116,
    height: 174,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#2A2B2F',
  },
  demoTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  demoTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bookArtFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  spineEffect: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 7,
    borderRightWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  coverArtworkText: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 15,
    letterSpacing: 0.4,
  },
  bookSpineShadow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  bookTitle: {
    color: '#E3E3E3',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    lineHeight: 18,
  },
  bookSubtitle: {
    color: '#8E918F',
    fontSize: 12,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  originalPriceText: {
    color: '#8E918F',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  currentPriceText: {
    color: '#E3E3E3',
    fontSize: 12,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1E1F22',
    borderTopWidth: 1,
    borderTopColor: '#282A2C',
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
    backgroundColor: '#004A77',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C2E7FF',
  },
  tabLabelInactive: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E918F',
  },
});
