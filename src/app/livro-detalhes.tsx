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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BookDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  // Trava de rolagem para o navegador web
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
      window.alert('Amostra gratuita carregada com sucesso!');
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#131314" />

      <View style={styles.container}>
        {/* Barra Superior com Seta de Voltar e Ações */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#E3E3E3" />
          </TouchableOpacity>

          <View style={styles.headerRightActions}>
            {/* Ícone de Salvar / Lista de Desejos */}
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

            {/* Ícone de Pesquisa */}
            <TouchableOpacity
              style={styles.headerIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="search" size={22} color="#E3E3E3" />
            </TouchableOpacity>

            {/* Menu de Opções (3 pontos) */}
            <TouchableOpacity
              style={styles.headerIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={22} color="#E3E3E3" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Conteúdo Rolável */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção Principal: Capa + Título + Autor */}
          <View style={styles.bookHeaderRow}>
            {/* Capa com Estilização de Demonstração */}
            <View style={styles.coverWrapper}>
              <View style={styles.spineEffect} />
              <View style={styles.bookSpineShadow} />

              <View style={styles.demoTag}>
                <Text style={styles.demoTagText}>DEMO</Text>
              </View>

              <View style={styles.coverArtBox}>
                <View style={styles.iconCircle}>
                  <Ionicons name="bulb-outline" size={28} color="#FF6B00" />
                </View>
                <Text style={styles.coverTitleText}>VOCÊ JÁ{'\n'}SABE</Text>
              </View>
            </View>

            {/* Informações do Livro */}
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

          {/* Faixa de Estatísticas e Avaliações com Divisórias */}
          <View style={styles.statsContainer}>
            {/* Avaliação */}
            <View style={styles.statItem}>
              <View style={styles.statTopRow}>
                <Text style={styles.statValue}>4,6</Text>
                <Ionicons name="star" size={13} color="#E3E3E3" style={{ marginLeft: 3 }} />
              </View>
              <View style={styles.statBottomRow}>
                <Text style={styles.statSubText}>63 avaliações</Text>
                <Ionicons name="information-circle-outline" size={12} color="#8E918F" style={{ marginLeft: 3 }} />
              </View>
            </View>

            <View style={styles.statDivider} />

            {/* Formato */}
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="book-open-outline" size={20} color="#E3E3E3" />
              <Text style={styles.statSubText}>E-book</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Páginas */}
            <View style={styles.statItem}>
              <Text style={styles.statValue}>144</Text>
              <Text style={styles.statSubText}>páginas</Text>
            </View>

            <View style={styles.statDivider} />

            {/* Classificação */}
            <View style={styles.statItem}>
              <Ionicons name="shield-checkmark-outline" size={19} color="#E3E3E3" />
              <Text style={styles.statSubText} numberOfLines={1}>Qualificado</Text>
            </View>
          </View>

          {/* Botões de Ação (Amostra Gratuita e Comprar E-book) */}
          <View style={styles.actionButtonsRow}>
            {/* Botão de Amostra Gratuita */}
            <TouchableOpacity
              style={styles.freeSampleBtn}
              onPress={handleFreeSample}
              activeOpacity={0.75}
            >
              <Text style={styles.freeSampleBtnText}>Amostra gratuita</Text>
            </TouchableOpacity>

            {/* Botão de Compra Primário */}
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

          {/* Destaques Promocionais (Desconto e Pontos Play Points) */}
          <View style={styles.promoSection}>
            {/* Promo 1: Redução de preço */}
            <View style={styles.promoRow}>
              <Ionicons name="pricetag-outline" size={20} color="#8E918F" style={styles.promoIcon} />
              <Text style={styles.promoText}>
                Redução de 44% no preço em 7 de set.
              </Text>
            </View>

            {/* Promo 2: Play Points */}
            <View style={styles.promoRow}>
              <Ionicons name="sparkles" size={20} color="#4285F4" style={styles.promoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.promoText}>
                  Por tempo limitado: ganhe mais Pontos do Play Points
                </Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.promoLink}>Participe do Play Points</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Seção Pacote / Coleção */}
          <View style={styles.packageHeaderRow}>
            <Text style={styles.packageTitle}>Pacote: Você Já Sabe</Text>
            <TouchableOpacity style={styles.packageArrowBtn} activeOpacity={0.7}>
              <Ionicons name="arrow-forward" size={18} color="#E3E3E3" />
            </TouchableOpacity>
          </View>

          {/* Sinopse Mockada */}
          <View style={styles.synopsisCard}>
            <Text style={styles.synopsisHeading}>Sobre este e-book</Text>
            <Text style={styles.synopsisText} numberOfLines={4}>
              Por que é tão difícil começar aquilo que sabemos que precisamos fazer? Neste best-seller provocador, 
              Ragas Bantara explora os mecanismos biológicos e psicológicos que sabotam nosso autocontrole e revela 
              ferramentas práticas para reprogramar o cérebro e vencer a autossabotagem de uma vez por todas.
            </Text>
          </View>
        </ScrollView>

        {/* Modal Simulado de Confirmação de Compra */}
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

        {/* Bottom Navigation Bar (Material 3 Style - Mantendo Aba Livros Ativa) */}
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

          {/* Tab 4: Livros (Ativa) */}
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

          {/* Tab 5: Você */}
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  bookHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 18,
  },
  coverWrapper: {
    width: 126,
    height: 190,
    borderRadius: 8,
    backgroundColor: '#141416',
    overflow: 'hidden',
    position: 'relative',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#2A2B2F',
  },
  spineEffect: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 7,
    borderRightWidth: 1,
    borderRightColor: '#27272A',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  bookSpineShadow: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
    padding: 10,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B0025',
    borderWidth: 1,
    borderColor: '#FF6B0055',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  coverTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F4F4F5',
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  bookInfoCol: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E3E3E3',
    lineHeight: 25,
  },
  authorText: {
    fontSize: 14,
    color: '#A8C7FA',
    fontWeight: '500',
    marginTop: 8,
  },
  publisherText: {
    fontSize: 13,
    color: '#8E918F',
    marginTop: 4,
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
    gap: 4,
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
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 22,
  },
  freeSampleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#444746',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#131314',
  },
  freeSampleBtnText: {
    color: '#A8C7FA',
    fontSize: 14,
    fontWeight: '600',
  },
  buyBtnWrapper: {
    flex: 1,
  },
  buyBtn: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A8C7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnPurchased: {
    backgroundColor: '#0F766E',
  },
  buyBtnText: {
    color: '#003258',
    fontSize: 14,
    fontWeight: '700',
  },
  oldPriceNote: {
    color: '#8E918F',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
  promoSection: {
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#282A2C',
    marginBottom: 20,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  promoIcon: {
    marginRight: 14,
    marginTop: 1,
  },
  promoText: {
    color: '#E3E3E3',
    fontSize: 13,
    lineHeight: 18,
  },
  promoLink: {
    color: '#A8C7FA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  packageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E3E3E3',
  },
  packageArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E1F22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  synopsisCard: {
    backgroundColor: '#1E1F22',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  synopsisHeading: {
    color: '#E3E3E3',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  synopsisText: {
    color: '#C4C7C5',
    fontSize: 13,
    lineHeight: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
