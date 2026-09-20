import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Livros relacionados de Ragas Bantara para a barra lateral no PC e mobile
const RELATED_BOOKS = [
  {
    id: '1',
    title: 'Foco Inabalável: Como Blindar sua Atenção',
    author: 'Ragas Bantara',
    category: 'Autoajuda',
    rating: '4,7',
    originalPrice: 'R$ 19,90',
    price: 'R$ 3,90',
    bgColor: '#18181B',
    accentColor: '#F59E0B',
    iconName: 'flash-outline',
  },
  {
    id: '2',
    title: 'A Arte de Não Desistir: Resiliência Prática',
    author: 'Ragas Bantara',
    category: 'Autoajuda',
    rating: '4,5',
    originalPrice: 'R$ 24,90',
    price: 'R$ 4,50',
    bgColor: '#0F172A',
    accentColor: '#38BDF8',
    iconName: 'shield-outline',
  },
  {
    id: '3',
    title: 'Hábitos Invisíveis: O Poder da Repetição',
    author: 'Ragas Bantara',
    category: 'Autoajuda',
    rating: '4,8',
    originalPrice: 'R$ 29,90',
    price: 'R$ 5,90',
    bgColor: '#1E1B4B',
    accentColor: '#818CF8',
    iconName: 'sync-outline',
  },
  {
    id: '4',
    title: 'Mente Calma, Ação Rápida',
    author: 'Ragas Bantara',
    category: 'Autoajuda',
    rating: '4,6',
    originalPrice: 'R$ 22,90',
    price: 'R$ 3,90',
    bgColor: '#172554',
    accentColor: '#60A5FA',
    iconName: 'leaf-outline',
  },
];

export default function BookDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const isPC = windowWidth >= 768;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  // Trava de rolagem para modo web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-bookdetails-scroll';
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
        const el = document.getElementById('playstore-bookdetails-scroll');
        if (el) el.remove();
      };
    }
  }, []);

  const handleFreeSample = () => {
    if (Platform.OS === 'web') {
      window.alert('Amostra gratuita de "Você Já Sabe" carregada com sucesso!');
    } else {
      Alert.alert('Amostra Gratuita', 'Amostra carregada na sua biblioteca!');
    }
  };

  const handleConfirmPurchase = () => {
    setIsPurchased(true);
    setPurchaseModalVisible(false);
    if (Platform.OS === 'web') {
      window.alert('Compra de R$ 2,78 realizada com sucesso! O livro foi adicionado à sua biblioteca.');
    } else {
      Alert.alert('Sucesso!', 'Compra realizada! Livro disponível na sua biblioteca.');
    }
  };

  // Renderizador da capa estilizada "Você Já Sabe"
  const renderVoceJaSabeCover = (isLarge: boolean = false) => {
    const width = isLarge ? 215 : 126;
    const height = isLarge ? 320 : 190;

    return (
      <View style={[styles.coverWrapper, { width, height }]}>
        {/* Lombada e efeito 3D */}
        <View style={styles.spineEffect} />
        <View style={styles.bookSpineShadow} />

        <View style={styles.demoTag}>
          <Text style={styles.demoTagText}>DEMO</Text>
        </View>

        <View style={styles.coverArtBox}>
          <View
            style={[
              styles.iconCircle,
              isLarge && { width: 70, height: 70, borderRadius: 35, marginBottom: 16 },
            ]}
          >
            <Ionicons name="bulb-outline" size={isLarge ? 36 : 28} color="#FF6B00" />
          </View>
          <Text
            style={[
              styles.coverTitleText,
              isLarge && { fontSize: 18, lineHeight: 24 },
            ]}
          >
            VOCÊ JÁ{'\n'}SABE
          </Text>
          {isLarge && (
            <Text style={styles.coverLargeSubtitle}>
              Por que o seu cérebro se recusa a fazer o que você sabe que é certo
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, isPC && styles.pcSafeArea]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" backgroundColor="#131314" />

      <View style={[styles.container, isPC && styles.pcContainer]}>
        {/* ============================================================== */}
        {/* NAVEGAÇÃO SUPERIOR (Apenas a seta de voltar, sem texto 'Voltar')*/}
        {/* ============================================================== */}
        <View style={[styles.topHeader, isPC && styles.pcTopNav]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#E3E3E3" />
          </TouchableOpacity>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={styles.headerIconBtn}
              onPress={() => setIsBookmarked(!isBookmarked)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={22}
                color={isBookmarked ? '#A8C7FA' : '#E3E3E3'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="search" size={22} color="#E3E3E3" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={22} color="#E3E3E3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================== */}
        {/* CONTEÚDO ROLÁVEL                                               */}
        {/* ============================================================== */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, isPC && styles.pcScrollContent]}
          showsVerticalScrollIndicator={false}
        >
          {isPC ? (
            /* ========================================================== */
            /* VERSÃO PC / DESKTOP (Layout 2 Colunas conforme o Mockup)   */
            /* ========================================================== */
            <>
              {/* TOPO: Informações à esquerda e Capa Grande à direita */}
              <View style={styles.pcHeaderContainer}>
                {/* Coluna Esquerda do Topo */}
                <View style={styles.pcHeaderLeftCol}>
                  <Text style={styles.pcBookTitle}>
                    Você Já Sabe: Por que o seu cérebro se recusa a fazer o que você sabe que é certo
                  </Text>

                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.pcAuthorText}>Ragas Bantara</Text>
                  </TouchableOpacity>
                  <Text style={styles.pcPubText}>Sextante • mar. de 2024</Text>

                  {/* Faixa de Estatísticas PC */}
                  <View style={styles.pcMetricsRow}>
                    <View style={styles.pcMetricItem}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.pcMetricValue}>4,6</Text>
                        <Ionicons name="star" size={13} color="#E3E3E3" style={{ marginLeft: 3 }} />
                      </View>
                      <Text style={styles.pcMetricSub}>63 avaliações</Text>
                    </View>

                    <View style={styles.pcMetricDivider} />

                    <View style={styles.pcMetricItem}>
                      <MaterialCommunityIcons name="book-open-outline" size={18} color="#E3E3E3" />
                      <Text style={styles.pcMetricSub}>E-book</Text>
                    </View>

                    <View style={styles.pcMetricDivider} />

                    <View style={styles.pcMetricItem}>
                      <Text style={styles.pcMetricValue}>144</Text>
                      <Text style={styles.pcMetricSub}>Páginas</Text>
                    </View>

                    <View style={styles.pcMetricDivider} />

                    <View style={styles.pcMetricItem}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="school-outline" size={18} color="#E3E3E3" />
                        <Ionicons name="information-circle-outline" size={11} color="#8E918F" style={{ marginLeft: 3 }} />
                      </View>
                      <Text style={styles.pcMetricSub}>Qualificado</Text>
                    </View>
                  </View>

                  {/* Botões de Ação PC */}
                  <View style={styles.pcActionsRow}>
                    {/* Botão de Compra com Preço Riscado */}
                    <TouchableOpacity
                      style={styles.pcBuyBtn}
                      onPress={() => (isPurchased ? handleFreeSample() : setPurchaseModalVisible(true))}
                      activeOpacity={0.85}
                    >
                      {!isPurchased && (
                        <Text style={styles.pcBuyOldPrice}>R$ 4,99</Text>
                      )}
                      <Text style={styles.pcBuyBtnText}>
                        {isPurchased ? 'Ler agora' : 'E-book por R$ 2,78'}
                      </Text>
                    </TouchableOpacity>

                    {/* Amostra Gratuita */}
                    <TouchableOpacity
                      style={styles.pcOutlineBtn}
                      onPress={handleFreeSample}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.pcOutlineBtnText}>Amostra gratuita</Text>
                    </TouchableOpacity>

                    {/* Adicionar à lista de desejos */}
                    <TouchableOpacity
                      style={styles.pcSecondaryIconBtn}
                      onPress={() => setIsBookmarked(!isBookmarked)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={18}
                        color="#A8C7FA"
                      />
                      <Text style={styles.pcSecondaryIconBtnText}>
                        {isBookmarked ? 'Na lista de desejos' : 'Adicionar à lista de desejos'}
                      </Text>
                    </TouchableOpacity>

                    {/* Comprar como presente */}
                    <TouchableOpacity style={styles.pcSecondaryIconBtn} activeOpacity={0.7}>
                      <Ionicons name="gift-outline" size={18} color="#A8C7FA" />
                      <Text style={styles.pcSecondaryIconBtnText}>Comprar como presente</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Avisos de Família e Play Points */}
                  <View style={styles.pcNoticesContainer}>
                    <View style={styles.pcNoticeRow}>
                      <Ionicons name="home-outline" size={16} color="#8E918F" style={{ marginRight: 8 }} />
                      <Text style={styles.pcNoticeText}>
                        Você pode compartilhar isto com sua família.{' '}
                        <Text style={styles.pcNoticeLink}>Saiba mais sobre a Biblioteca da família</Text>
                      </Text>
                    </View>
                    <View style={styles.pcNoticeRow}>
                      <Ionicons name="sparkles" size={16} color="#A8C7FA" style={{ marginRight: 8 }} />
                      <Text style={styles.pcNoticeText}>
                        Por tempo limitado: ganhe mais Pontos do Play Points.{' '}
                        <Text style={styles.pcNoticeLink}>Saiba mais</Text>
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Coluna Direita do Topo: Capa Grande com Efeito 3D */}
                <View style={styles.pcHeaderRightCol}>
                  {renderVoceJaSabeCover(true)}
                </View>
              </View>

              {/* GRID INFERIOR NO PC: Sinopse à Esquerda e Livros Relacionados à Direita */}
              <View style={styles.pcGridContainer}>
                {/* Coluna Esquerda: Sobre este e-book, Saiba mais, Pacote */}
                <View style={styles.pcGridLeft}>
                  {/* Seção Sobre este e-book */}
                  <View style={styles.aboutSection}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionHeading}>Sobre este e-book</Text>
                      <TouchableOpacity style={styles.arrowCircleBtn} activeOpacity={0.7}>
                        <Ionicons name="arrow-forward" size={18} color="#E3E3E3" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.pcSynopsisText}>
                      Por que é tão difícil começar aquilo que sabemos que precisamos fazer? Neste best-seller provocador, Ragas Bantara explora os mecanismos biológicos e psicológicos que sabotam nosso autocontrole e revela ferramentas práticas para reprogramar o cérebro e vencer a autossabotagem de uma vez por todas.{'\n\n'}
                      Com base nas pesquisas mais recentes da neurociência e da psicologia comportamental, o livro apresenta estratégias acessíveis e aplicáveis ao dia a dia para que você recupere o foco, vença a procrastinação e alcance seus objetivos mais ambiciosos.
                    </Text>

                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.pcLearnMoreLink}>Saiba mais sobre o livro</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Seção Saiba mais (Tags) */}
                  <View style={styles.pcTagsSection}>
                    <Text style={styles.pcSubHeading}>Saiba mais</Text>
                    <View style={styles.tagsRow}>
                      <View style={styles.tagChip}>
                        <Text style={styles.tagChipText}>Autoajuda</Text>
                      </View>
                      <View style={styles.tagChip}>
                        <Text style={styles.tagChipText}>Psicologia</Text>
                      </View>
                    </View>
                  </View>

                  {/* Seção Pacote: Você Já Sabe */}
                  <View style={styles.pcPackageSection}>
                    <Text style={styles.pcSubHeading}>Pacote: Você Já Sabe</Text>
                    <View style={styles.pcPackageCard}>
                      <View style={styles.packageBooksStack}>
                        <View style={[styles.miniStackBook, { left: 0, zIndex: 1 }]} />
                        <View style={[styles.miniStackBook, { left: 8, zIndex: 2 }]} />
                        <View style={[styles.miniStackBook, { left: 16, zIndex: 3, backgroundColor: '#141416' }]}>
                          <Ionicons name="bulb-outline" size={14} color="#FF6B00" style={{ alignSelf: 'center', marginTop: 8 }} />
                          <Text style={{ fontSize: 6.5, fontWeight: '800', textAlign: 'center', color: '#F4F4F5', marginTop: 2 }}>VOCÊ</Text>
                        </View>
                        <View style={styles.packageCountBadge}>
                          <Text style={styles.packageCountText}>+49</Text>
                        </View>
                      </View>

                      <View style={styles.packageInfoCol}>
                        <Text style={styles.packageTitleText}>Compre até 50 livros</Text>
                        <Text style={styles.packageSubText}>Selecione qualquer combinação</Text>
                      </View>

                      <TouchableOpacity style={styles.packageCreateBtn} activeOpacity={0.8}>
                        <Text style={styles.packageCreateBtnText}>Criar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Coluna Direita: Mais de Ragas Bantara */}
                <View style={styles.pcGridRight}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeading}>Mais de Ragas Bantara</Text>
                    <TouchableOpacity style={styles.arrowCircleBtn} activeOpacity={0.7}>
                      <Ionicons name="arrow-forward" size={18} color="#E3E3E3" />
                    </TouchableOpacity>
                  </View>

                  {/* Lista vertical de livros relacionados */}
                  <View style={styles.relatedBooksList}>
                    {RELATED_BOOKS.map((book) => (
                      <TouchableOpacity
                        key={book.id}
                        style={styles.relatedBookItem}
                        activeOpacity={0.75}
                      >
                        {/* Mini capa */}
                        <View style={[styles.relatedCoverBox, { backgroundColor: book.bgColor }]}>
                          <View style={styles.spineEffect} />
                          <Ionicons name={book.iconName as any} size={18} color={book.accentColor} />
                        </View>

                        {/* Dados do Livro */}
                        <View style={styles.relatedBookInfoCol}>
                          <Text style={styles.relatedBookTitle} numberOfLines={1}>
                            {book.title}
                          </Text>
                          <Text style={styles.relatedBookAuthor}>{book.author}</Text>
                          <Text style={styles.relatedBookCategory}>{book.category}</Text>
                          <View style={styles.relatedPriceRow}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                              <Text style={styles.relatedBookRating}>{book.rating}</Text>
                              <Ionicons name="star" size={10} color="#E3E3E3" style={{ marginLeft: 2 }} />
                            </View>
                            <Text style={styles.relatedOldPrice}>{book.originalPrice}</Text>
                            <Text style={styles.relatedCurrentPrice}>{book.price}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </>
          ) : (
            /* ========================================================== */
            /* VERSÃO MOBILE (Dark Mode Adaptado para Você Já Sabe)       */
            /* ========================================================== */
            <>
              {/* Cabeçalho Mobile com Capa + Título */}
              <View style={styles.bookHeaderRow}>
                {renderVoceJaSabeCover(false)}

                <View style={styles.bookInfoCol}>
                  <Text style={styles.mainTitle}>
                    Você Já Sabe: Por que o seu cérebro se recusa a fazer o que você sabe que é certo
                  </Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.authorText}>Ragas Bantara</Text>
                  </TouchableOpacity>
                  <Text style={styles.publisherText}>Sextante</Text>
                </View>
              </View>

              {/* Faixa de Estatísticas Mobile */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={styles.statTopRow}>
                    <Text style={styles.statValue}>4,6</Text>
                    <Ionicons name="star" size={13} color="#E3E3E3" style={{ marginLeft: 3 }} />
                  </View>
                  <View style={styles.statBottomRow}>
                    <Text style={styles.statSubText}>63 avaliações</Text>
                  </View>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="book-open-outline" size={20} color="#E3E3E3" />
                  <Text style={styles.statSubText}>E-book</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statValue}>144</Text>
                  <Text style={styles.statSubText}>Páginas</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Ionicons name="school-outline" size={19} color="#E3E3E3" />
                  <Text style={styles.statSubText}>Qualificado</Text>
                </View>
              </View>

              {/* Botões de Ação Mobile */}
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={styles.freeSampleBtn}
                  onPress={handleFreeSample}
                  activeOpacity={0.75}
                >
                  <Text style={styles.freeSampleBtnText}>Amostra gratuita</Text>
                </TouchableOpacity>

                <View style={styles.buyBtnWrapper}>
                  <TouchableOpacity
                    style={[styles.buyBtn, isPurchased && styles.buyBtnPurchased]}
                    onPress={() => (isPurchased ? handleFreeSample() : setPurchaseModalVisible(true))}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.buyBtnText}>
                      {isPurchased ? 'Ler agora' : 'E-book R$ 2,78'}
                    </Text>
                  </TouchableOpacity>
                  {!isPurchased && (
                    <Text style={styles.oldPriceNote}>Custava R$ 4,99</Text>
                  )}
                </View>
              </View>

              {/* Destaques Promocionais */}
              <View style={styles.promoSection}>
                <View style={styles.promoRow}>
                  <Ionicons name="pricetag-outline" size={20} color="#8E918F" style={styles.promoIcon} />
                  <Text style={styles.promoText}>
                    Redução de 44% no preço em 7 de set.
                  </Text>
                </View>

                <View style={styles.promoRow}>
                  <Ionicons name="sparkles" size={20} color="#A8C7FA" style={styles.promoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.promoText}>
                      Por tempo limitado: ganhe mais Pontos do Play Points
                    </Text>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.promoLink}>Saiba mais</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Sinopse */}
              <View style={styles.synopsisCard}>
                <Text style={styles.synopsisHeading}>Sobre este e-book</Text>
                <Text style={styles.synopsisText} numberOfLines={4}>
                  Por que é tão difícil começar aquilo que sabemos que precisamos fazer? Neste best-seller provocador, Ragas Bantara explora os mecanismos biológicos e psicológicos que sabotam nosso autocontrole e revela ferramentas práticas para reprogramar o cérebro e vencer a autossabotagem de uma vez por todas.
                </Text>
              </View>

              {/* Seção Mais de Ragas Bantara no Mobile */}
              <View style={[styles.pcPackageSection, { marginTop: 20 }]}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeading}>Mais de Ragas Bantara</Text>
                  <TouchableOpacity style={styles.arrowCircleBtn} activeOpacity={0.7}>
                    <Ionicons name="arrow-forward" size={18} color="#E3E3E3" />
                  </TouchableOpacity>
                </View>
                <View style={styles.relatedBooksList}>
                  {RELATED_BOOKS.slice(0, 3).map((book) => (
                    <View key={book.id} style={styles.relatedBookItem}>
                      <View style={[styles.relatedCoverBox, { backgroundColor: book.bgColor }]}>
                        <Ionicons name={book.iconName as any} size={16} color={book.accentColor} />
                      </View>
                      <View style={styles.relatedBookInfoCol}>
                        <Text style={styles.relatedBookTitle} numberOfLines={1}>{book.title}</Text>
                        <Text style={styles.relatedBookAuthor}>{book.author}</Text>
                        <Text style={styles.relatedCurrentPrice}>{book.price}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* ============================================================== */}
        {/* MODAL DE COMPRA SIMULADO COM 1 CLIQUE                          */}
        {/* ============================================================== */}
        {purchaseModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Google Play</Text>
                <TouchableOpacity onPress={() => setPurchaseModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#E3E3E3" />
                </TouchableOpacity>
              </View>
              <Text style={styles.modalBookTitle}>Você Já Sabe (E-book)</Text>
              <Text style={styles.modalPrice}>R$ 2,78</Text>
              <Text style={styles.modalPaymentMethod}>💳 Saldo do Google Play: R$ 50,00</Text>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmPurchase}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmBtnText}>Comprar com 1 clique</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ============================================================== */}
        {/* MENU INFERIOR FIXO (Material 3 Style - Sempre Visível)         */}
        {/* ============================================================== */}
        <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/')}
            activeOpacity={0.7}
          >
            <Ionicons name="game-controller-outline" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Jogos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="view-grid-outline" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Apps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.replace('/')}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Pesquisa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <View style={styles.activePill}>
              <Ionicons name="book" size={20} color="#C2E7FF" />
            </View>
            <Text style={styles.tabLabelActive}>Livros</Text>
          </TouchableOpacity>

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
  pcSafeArea: {
    backgroundColor: '#131314',
  },
  container: {
    flex: 1,
    backgroundColor: '#131314',
  },
  pcContainer: {
    backgroundColor: '#131314',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  pcTopNav: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 36,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconBtn: {
    padding: 4,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
  },
  pcScrollContent: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 36,
    paddingTop: 10,
    paddingBottom: 40,
  },

  // ==============================================================
  // CAPA PERSONALIZADA "VOCÊ JÁ SABE"
  // ==============================================================
  coverWrapper: {
    borderRadius: 8,
    backgroundColor: '#141416',
    overflow: 'hidden',
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2B2F',
  },
  spineEffect: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    borderRightWidth: 1,
    borderRightColor: '#27272A',
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 2,
  },
  bookSpineShadow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 2,
  },
  demoTag: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    zIndex: 2,
  },
  demoTagText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#F4F4F5',
    letterSpacing: 0.6,
  },
  coverArtBox: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FF6B0025',
    borderWidth: 1,
    borderColor: '#FF6B0055',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  coverTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F4F4F5',
    textAlign: 'center',
    lineHeight: 17,
    letterSpacing: 0.5,
  },
  coverLargeSubtitle: {
    fontSize: 10,
    color: '#A1A1AA',
    textAlign: 'center',
    marginTop: 14,
    paddingHorizontal: 8,
    lineHeight: 14,
  },

  // ==============================================================
  // ESTILOS DO HEADER NO PC
  // ==============================================================
  pcHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 36,
  },
  pcHeaderLeftCol: {
    flex: 1,
    paddingRight: 48,
  },
  pcBookTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#E3E3E3',
    lineHeight: 40,
    letterSpacing: -0.4,
  },
  pcAuthorText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A8C7FA',
    marginTop: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcPubText: {
    fontSize: 13,
    color: '#8E918F',
    marginTop: 4,
    marginBottom: 20,
  },
  pcMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  pcMetricItem: {
    alignItems: 'flex-start',
    gap: 3,
  },
  pcMetricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E3E3E3',
  },
  pcMetricSub: {
    fontSize: 12,
    color: '#8E918F',
  },
  pcMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#282A2C',
  },
  pcActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 24,
  },
  pcBuyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#A8C7FA',
    paddingHorizontal: 24,
    height: 42,
    borderRadius: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcBuyOldPrice: {
    fontSize: 12,
    color: '#003258',
    opacity: 0.7,
    textDecorationLine: 'line-through',
  },
  pcBuyBtnText: {
    color: '#003258',
    fontSize: 14,
    fontWeight: '700',
  },
  pcOutlineBtn: {
    borderWidth: 1,
    borderColor: '#444746',
    paddingHorizontal: 20,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcOutlineBtnText: {
    color: '#A8C7FA',
    fontSize: 14,
    fontWeight: '600',
  },
  pcSecondaryIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    height: 42,
    borderRadius: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcSecondaryIconBtnText: {
    color: '#A8C7FA',
    fontSize: 13,
    fontWeight: '600',
  },
  pcNoticesContainer: {
    gap: 10,
    paddingTop: 8,
  },
  pcNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pcNoticeText: {
    fontSize: 12,
    color: '#8E918F',
  },
  pcNoticeLink: {
    color: '#A8C7FA',
    textDecorationLine: 'underline',
  },
  pcHeaderRightCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ==============================================================
  // ESTILOS DO GRID INFERIOR NO PC (Sinopse e Livros Relacionados)
  // ==============================================================
  pcGridContainer: {
    flexDirection: 'row',
    gap: 48,
    alignItems: 'flex-start',
  },
  pcGridLeft: {
    flex: 1,
  },
  pcGridRight: {
    width: 380,
  },
  aboutSection: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E3E3E3',
  },
  arrowCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E1F22',
    borderWidth: 1,
    borderColor: '#282A2C',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcSynopsisText: {
    fontSize: 13.5,
    lineHeight: 22,
    color: '#8E918F',
  },
  pcLearnMoreLink: {
    color: '#A8C7FA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcTagsSection: {
    marginBottom: 28,
  },
  pcSubHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E3E3E3',
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#1E1F22',
    borderWidth: 1,
    borderColor: '#282A2C',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagChipText: {
    color: '#C4C7C5',
    fontSize: 12,
    fontWeight: '500',
  },
  pcPackageSection: {
    marginBottom: 24,
  },
  pcPackageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1F22',
    borderWidth: 1,
    borderColor: '#282A2C',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  packageBooksStack: {
    width: 58,
    height: 60,
    position: 'relative',
    justifyContent: 'center',
  },
  miniStackBook: {
    position: 'absolute',
    top: 4,
    width: 34,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#3F3F46',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  packageCountBadge: {
    position: 'absolute',
    right: -4,
    bottom: 2,
    backgroundColor: '#282A2C',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    zIndex: 4,
  },
  packageCountText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E3E3E3',
  },
  packageInfoCol: {
    flex: 1,
  },
  packageTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E3E3E3',
  },
  packageSubText: {
    fontSize: 12,
    color: '#8E918F',
    marginTop: 2,
  },
  packageCreateBtn: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#A8C7FA',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  packageCreateBtnText: {
    color: '#A8C7FA',
    fontSize: 13,
    fontWeight: '600',
  },

  // ==============================================================
  // ESTILOS DA COLUNA "MAIS DE RAGAS BANTARA"
  // ==============================================================
  relatedBooksList: {
    gap: 14,
  },
  relatedBookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    backgroundColor: '#1E1F22',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#282A2C',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  relatedCoverBox: {
    width: 44,
    height: 64,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  relatedBookInfoCol: {
    flex: 1,
  },
  relatedBookTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E3E3E3',
  },
  relatedBookAuthor: {
    fontSize: 11,
    color: '#8E918F',
    marginTop: 2,
  },
  relatedBookCategory: {
    fontSize: 10.5,
    color: '#8E918F',
    marginTop: 1,
  },
  relatedPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  relatedBookRating: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E3E3E3',
  },
  relatedOldPrice: {
    fontSize: 11,
    color: '#8E918F',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  relatedCurrentPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E3E3E3',
  },

  // ==============================================================
  // ESTILOS DA VERSÃO MOBILE
  // ==============================================================
  bookHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },
  bookInfoCol: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E3E3E3',
    lineHeight: 24,
  },
  authorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A8C7FA',
    marginTop: 6,
  },
  publisherText: {
    fontSize: 12,
    color: '#8E918F',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#282A2C',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E3E3E3',
  },
  statBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statSubText: {
    fontSize: 11,
    color: '#8E918F',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#282A2C',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  freeSampleBtn: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#444746',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeSampleBtnText: {
    color: '#A8C7FA',
    fontSize: 14,
    fontWeight: '600',
  },
  buyBtnWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  buyBtn: {
    width: '100%',
    height: 42,
    borderRadius: 21,
    backgroundColor: '#A8C7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnPurchased: {
    backgroundColor: '#004A77',
  },
  buyBtnText: {
    color: '#003258',
    fontSize: 14,
    fontWeight: '700',
  },
  oldPriceNote: {
    color: '#8E918F',
    fontSize: 11,
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  promoSection: {
    backgroundColor: '#1E1F22',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoIcon: {
    marginRight: 12,
  },
  promoText: {
    fontSize: 12,
    color: '#C4C7C5',
    flex: 1,
  },
  promoLink: {
    fontSize: 12,
    color: '#A8C7FA',
    fontWeight: '600',
    marginTop: 2,
  },
  synopsisCard: {
    backgroundColor: '#1E1F22',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#282A2C',
  },
  synopsisHeading: {
    color: '#E3E3E3',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  synopsisText: {
    color: '#8E918F',
    fontSize: 13,
    lineHeight: 20,
  },

  // ==============================================================
  // MODAL DE COMPRA SIMULADO
  // ==============================================================
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: '#1E1F22',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderTopWidth: 1,
    borderColor: '#282A2C',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E3E3E3',
  },
  modalBookTitle: {
    fontSize: 15,
    color: '#C4C7C5',
    marginBottom: 6,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#A8C7FA',
    marginBottom: 12,
  },
  modalPaymentMethod: {
    fontSize: 13,
    color: '#8E918F',
    marginBottom: 20,
  },
  modalConfirmBtn: {
    backgroundColor: '#A8C7FA',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmBtnText: {
    color: '#003258',
    fontSize: 15,
    fontWeight: '700',
  },

  // ==============================================================
  // MENU INFERIOR FIXO
  // ==============================================================
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
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
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
