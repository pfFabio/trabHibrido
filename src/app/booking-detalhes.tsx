import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 6 Screenshots demonstrativos para o carrossel da Booking
const BOOKING_SCREENSHOTS = [
  {
    id: '1',
    header: 'Reserve tudo em um só app',
    type: 'search',
  },
  {
    id: '2',
    header: 'Ache a acomodação ideal',
    type: 'hotel',
  },
  {
    id: '3',
    header: 'Ficou fácil reservar voos',
    type: 'flight',
  },
  {
    id: '4',
    header: 'Reserve um carro',
    type: 'car',
  },
  {
    id: '5',
    header: 'Conheça atrações incríveis',
    type: 'attractions',
  },
  {
    id: '6',
    header: 'Reserve com facilidade',
    type: 'booking',
  },
];

export default function BookingDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const isPC = windowWidth >= 768;

  const [installState, setInstallState] = useState<'idle' | 'installing' | 'installed'>('idle');
  const [progress, setProgress] = useState(0);

  // Estados do carrossel de capturas de tela (PC e Mobile)
  const screenshotsScrollRef = useRef<ScrollView>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const currentScrollX = useRef(0);
  const screenshotsContentWidth = useRef(0);

  // Trava de rolagem para modo web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-booking-scroll';
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
        const el = document.getElementById('playstore-booking-scroll');
        if (el) el.remove();
      };
    }
  }, []);

  // Simulação interativa de download e instalação
  const handleInstall = () => {
    if (installState === 'idle') {
      setInstallState('installing');
      setProgress(10);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setInstallState('installed');
            return 100;
          }
          return prev + 30;
        });
      }, 350);
    }
  };

  const handleUninstall = () => {
    setInstallState('idle');
    setProgress(0);
  };

  const handleCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    currentScrollX.current = contentOffset.x;
    screenshotsContentWidth.current = contentSize.width;

    setCanScrollLeft(contentOffset.x > 10);
    const maxScroll = contentSize.width - layoutMeasurement.width;
    setCanScrollRight(contentOffset.x < maxScroll - 10);
  };

  const handleCarouselStep = (direction: 'left' | 'right') => {
    if (!screenshotsScrollRef.current) return;
    const step = isPC ? 440 : 260;
    const targetX =
      direction === 'left'
        ? Math.max(0, currentScrollX.current - step)
        : currentScrollX.current + step;

    screenshotsScrollRef.current.scrollTo({ x: targetX, animated: true });
  };

  // Renderizador das telas do carrossel simulando o app Booking
  const renderScreenshotCard = (item: typeof BOOKING_SCREENSHOTS[0]) => (
    <View key={item.id} style={[styles.screenshotCard, isPC && styles.pcScreenshotCard]}>
      <Text style={[styles.screenshotHeader, isPC && styles.pcScreenshotHeader]} numberOfLines={1}>
        {item.header}
      </Text>

      <View style={styles.mockAppPreview}>
        {item.type === 'search' && (
          <>
            <View style={styles.mockBookingBar}>
              <Text style={styles.mockLogoText}>Booking.com</Text>
              <View style={styles.mockPillsRow}>
                <Text style={styles.mockPillActive}>Acomodações</Text>
                <Text style={styles.mockPill}>Voos</Text>
                <Text style={styles.mockPill}>Carros</Text>
              </View>
            </View>
            <View style={styles.mockSearchCard}>
              <Text style={styles.mockSearchText}>📍 Barcelona</Text>
              <Text style={styles.mockDateText}>📅 sáb., 12 de nov. - sex., 18 de nov.</Text>
              <Text style={styles.mockDateText}>👥 1 quarto • 2 adultos</Text>
              <View style={styles.mockSearchBtn}>
                <Text style={styles.mockSearchBtnText}>Pesquisar</Text>
              </View>
            </View>
            <Text style={styles.mockPromoTitle}>Promoção de Férias</Text>
            <View style={styles.mockCitiesRow}>
              <View style={styles.mockCityBox}><Text style={styles.mockCityText}>Londres</Text></View>
              <View style={styles.mockCityBox}><Text style={styles.mockCityText}>Paris</Text></View>
            </View>
          </>
        )}

        {item.type === 'hotel' && (
          <View style={styles.mockHotelCard}>
            <View style={styles.mockHotelImageBox}>
              <Ionicons name="image-outline" size={30} color="#94A3B8" />
              <Text style={styles.mockHotelImageLabel}>Terraço com Piscina</Text>
            </View>
            <View style={styles.mockHotelDetails}>
              <Text style={styles.mockHotelName}>Almanac Barcelona</Text>
              <Text style={styles.mockHotelStars}>★★★★★ Excelente</Text>
              <View style={styles.mockTagGreen}>
                <Text style={styles.mockTagGreenText}>Cancelamento grátis</Text>
              </View>
              <View style={styles.mockSelectRoomBtn}>
                <Text style={styles.mockSelectRoomText}>Selecionar quarto</Text>
              </View>
            </View>
          </View>
        )}

        {item.type === 'flight' && (
          <View style={styles.mockFlightCard}>
            <Ionicons name="airplane" size={32} color="#003580" style={{ alignSelf: 'center', marginVertical: 6 }} />
            <View style={styles.mockFlightInput}>
              <Text style={styles.mockFlightLabel}>Origem</Text>
              <Text style={styles.mockFlightCity}>São Paulo (GRU)</Text>
            </View>
            <View style={styles.mockFlightInput}>
              <Text style={styles.mockFlightLabel}>Destino</Text>
              <Text style={styles.mockFlightCity}>Madri (MAD)</Text>
            </View>
            <View style={styles.mockSearchBtn}>
              <Text style={styles.mockSearchBtnText}>Ver voos</Text>
            </View>
          </View>
        )}

        {item.type === 'car' && (
          <View style={styles.mockFlightCard}>
            <Ionicons name="car-sport" size={32} color="#003580" style={{ alignSelf: 'center', marginVertical: 6 }} />
            <View style={styles.mockFlightInput}>
              <Text style={styles.mockFlightLabel}>Retirada do veículo</Text>
              <Text style={styles.mockFlightCity}>Aeroporto de Barcelona</Text>
            </View>
            <View style={styles.mockSearchBtn}>
              <Text style={styles.mockSearchBtnText}>Pesquisar carros</Text>
            </View>
          </View>
        )}

        {item.type === 'attractions' && (
          <View style={styles.mockHotelCard}>
            <View style={[styles.mockHotelImageBox, { backgroundColor: '#FDE68A' }]}>
              <Ionicons name="ticket-outline" size={30} color="#D97706" />
              <Text style={[styles.mockHotelImageLabel, { color: '#92400E' }]}>Passeios & Museus</Text>
            </View>
            <View style={styles.mockHotelDetails}>
              <Text style={styles.mockHotelName}>Sagrada Família</Text>
              <Text style={styles.mockHotelStars}>Entrada rápida sem fila</Text>
              <View style={[styles.mockSelectRoomBtn, { marginTop: 12 }]}>
                <Text style={styles.mockSelectRoomText}>Ver ingressos</Text>
              </View>
            </View>
          </View>
        )}

        {item.type === 'booking' && (
          <View style={styles.mockFlightCard}>
            <Ionicons name="shield-checkmark" size={32} color="#15803D" style={{ alignSelf: 'center', marginVertical: 8 }} />
            <Text style={{ textAlign: 'center', fontWeight: '700', color: '#0F172A', fontSize: 13 }}>
              Confirmação Imediata
            </Text>
            <Text style={{ textAlign: 'center', color: '#64748B', fontSize: 10, marginTop: 4 }}>
              Sem taxas ocultas e suporte 24 horas todos os dias.
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, isPC && styles.pcSafeArea]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#131314"
      />

      <View style={[styles.container, isPC && styles.pcContainer]}>
        {/* ============================================================== */}
        {/* NAVEGAÇÃO SUPERIOR                                             */}
        {/* ============================================================== */}
        {isPC ? (
          <View style={styles.pcTopNav}>
            <TouchableOpacity
              style={styles.pcBackBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="#E3E3E3" />
              <Text style={styles.pcBackBtnText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#E3E3E3" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={22} color="#E3E3E3" />
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================== */}
        {/* CONTEÚDO ROLÁVEL                                               */}
        {/* ============================================================== */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, isPC && styles.pcScrollContent]}
          showsVerticalScrollIndicator={false}
        >
          {/* ========================================================== */}
          {/* CABEÇALHO DO APLICATIVO                                    */}
          {/* ========================================================== */}
          {isPC ? (
            /* Versão PC: Título à esquerda e Ícone Grande à direita */
            <View style={styles.pcHeaderContainer}>
              <View style={styles.pcHeaderLeftCol}>
                <Text style={styles.pcAppTitle}>Booking.com</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.pcDeveloperText}>
                    Booking.com Hotels & Vacation Rentals
                  </Text>
                </TouchableOpacity>

                {/* Métricas no Desktop (4,7 ★ e 500 mi+ downloads) */}
                <View style={styles.pcMetricsRow}>
                  <View style={styles.pcMetricItem}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.pcMetricValue}>4,7</Text>
                      <Ionicons name="star" size={13} color="#E3E3E3" style={{ marginLeft: 3 }} />
                    </View>
                    <Text style={styles.pcMetricSub}>6,33 mi avaliações</Text>
                  </View>

                  <View style={styles.pcMetricDivider} />

                  <View style={styles.pcMetricItem}>
                    <Text style={styles.pcMetricValue}>500 mi+</Text>
                    <Text style={styles.pcMetricSub}>downloads</Text>
                  </View>
                </View>

                {/* Botões de Ação da Versão PC (Verde Google Play Web) */}
                <View style={styles.pcActionsRow}>
                  {installState === 'idle' && (
                    <TouchableOpacity
                      style={styles.pcInstallBtn}
                      onPress={handleInstall}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.pcInstallBtnText}>Instalar</Text>
                    </TouchableOpacity>
                  )}

                  {installState === 'installing' && (
                    <View style={styles.pcInstallingBox}>
                      <ActivityIndicator size="small" color="#00A86B" />
                      <Text style={styles.pcInstallingText}>Instalando... {progress}%</Text>
                    </View>
                  )}

                  {installState === 'installed' && (
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity
                        style={styles.pcUninstallBtn}
                        onPress={handleUninstall}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.pcUninstallBtnText}>Desinstalar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.pcInstallBtn}
                        onPress={() => alert('Abrindo Booking.com...')}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.pcInstallBtnText}>Abrir</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity style={styles.pcSecondaryBtn} activeOpacity={0.7}>
                    <Ionicons name="share-social-outline" size={18} color="#00A86B" />
                    <Text style={styles.pcSecondaryBtnText}>Compartilhar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.pcSecondaryBtn} activeOpacity={0.7}>
                    <Ionicons name="bookmark-outline" size={18} color="#00A86B" />
                    <Text style={styles.pcSecondaryBtnText}>Adicionar à lista de desejos</Text>
                  </TouchableOpacity>
                </View>

                {/* Avisos de Dispositivos e Família */}
                <View style={styles.pcNoticesContainer}>
                  <View style={styles.pcNoticeRow}>
                    <Ionicons name="laptop-outline" size={16} color="#8E918F" style={{ marginRight: 8 }} />
                    <Text style={styles.pcNoticeText}>Este app está disponível para todos os seus dispositivos</Text>
                  </View>
                  <View style={styles.pcNoticeRow}>
                    <Ionicons name="home-outline" size={16} color="#8E918F" style={{ marginRight: 8 }} />
                    <Text style={styles.pcNoticeText}>
                      Você pode compartilhar isso com sua família.{' '}
                      <Text style={styles.pcNoticeLink}>Saiba mais sobre a Biblioteca da família</Text>
                    </Text>
                  </View>
                </View>
              </View>

              {/* Ícone Grande à Direita (Versão PC) */}
              <View style={styles.pcAppIconBox}>
                <Text style={styles.pcAppIconText}>Booking</Text>
              </View>
            </View>
          ) : (
            /* Versão Mobile (Dark Mode) */
            <>
              <View style={styles.appHeaderRow}>
                <View style={styles.appIconBox}>
                  <Text style={styles.appIconText}>Booking</Text>
                </View>
                <View style={styles.appTitleCol}>
                  <Text style={styles.appName}>Booking.com</Text>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.developerName}>
                      Booking.com Hotels & Vacation Rentals
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Faixa de Estatísticas Mobile */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <View style={styles.statTopRow}>
                    <Text style={styles.statValue}>4,9</Text>
                    <Ionicons name="star" size={12} color="#E3E3E3" style={{ marginLeft: 3 }} />
                  </View>
                  <Text style={styles.statSubText}>6 mi avaliações</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <View style={styles.freeBadgeBox}>
                    <Text style={styles.freeBadgeText}>L</Text>
                  </View>
                  <View style={styles.statBottomRow}>
                    <Text style={styles.statSubText}>Classificação Livre</Text>
                    <Ionicons name="information-circle-outline" size={12} color="#8E918F" style={{ marginLeft: 3 }} />
                  </View>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <MaterialCommunityIcons name="arrow-collapse-down" size={19} color="#E3E3E3" />
                  <Text style={styles.statSubText}>66 MB</Text>
                </View>
              </View>

              {/* Botão de Instalação Mobile */}
              <View style={styles.installSection}>
                {installState === 'idle' && (
                  <TouchableOpacity
                    style={styles.installBtn}
                    onPress={handleInstall}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.installBtnText}>Instalar</Text>
                  </TouchableOpacity>
                )}

                {installState === 'installing' && (
                  <View style={styles.installingContainer}>
                    <View style={styles.installingHeader}>
                      <ActivityIndicator size="small" color="#A8C7FA" />
                      <Text style={styles.installingText}>Instalando... {progress}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                  </View>
                )}

                {installState === 'installed' && (
                  <View style={styles.installedActionsRow}>
                    <TouchableOpacity
                      style={styles.uninstallBtn}
                      onPress={handleUninstall}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.uninstallBtnText}>Desinstalar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.openBtn}
                      onPress={() => alert('Abrindo Booking.com...')}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.openBtnText}>Abrir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )}

          {/* ========================================================== */}
          {/* CARROSSEL DE SCREENSHOTS COM SETA FLUTUANTE                */}
          {/* ========================================================== */}
          <View style={[styles.mainLayoutGrid, isPC && styles.pcMainLayoutGrid]}>
            <View style={[styles.leftContentCol, isPC && styles.pcLeftContentCol]}>
              <View
                style={styles.carouselWrapper}
                {...({
                  onMouseEnter: () => setIsCarouselHovered(true),
                  onMouseLeave: () => setIsCarouselHovered(false),
                } as any)}
              >
                <ScrollView
                  ref={screenshotsScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleCarouselScroll}
                  scrollEventThrottle={16}
                  contentContainerStyle={styles.screenshotsScroll}
                >
                  {BOOKING_SCREENSHOTS.map(renderScreenshotCard)}
                </ScrollView>

                {/* Seta Esquerda (Apenas no hover e se rolado) */}
                {canScrollLeft && (isCarouselHovered || !isPC) && (
                  <TouchableOpacity
                    style={[styles.carouselFloatingBtn, styles.carouselFloatingLeft]}
                    onPress={() => handleCarouselStep('left')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="chevron-back" size={22} color="#E3E3E3" />
                  </TouchableOpacity>
                )}

                {/* Seta Direita (Apenas no hover e se houver mais conteúdo) */}
                {canScrollRight && (isCarouselHovered || !isPC) && (
                  <TouchableOpacity
                    style={[styles.carouselFloatingBtn, styles.carouselFloatingRight]}
                    onPress={() => handleCarouselStep('right')}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="chevron-forward" size={22} color="#E3E3E3" />
                  </TouchableOpacity>
                )}
              </View>

              {/* ====================================================== */}
              {/* SEÇÃO "SOBRE ESTE APP"                                 */}
              {/* ====================================================== */}
              <View style={[styles.aboutSection, isPC && styles.pcAboutSection]}>
                <View style={styles.aboutHeaderRow}>
                  <Text style={[styles.aboutTitle, isPC && styles.pcAboutTitle]}>
                    Sobre este app
                  </Text>
                  <TouchableOpacity
                    style={[styles.circleArrowBtn, isPC && styles.pcCircleArrowBtn]}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color="#E3E3E3"
                    />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.aboutDescription, isPC && styles.pcAboutDescription]}>
                  Economize na sua próxima viagem com o aplicativo da Booking.com! Encontre ótimas ofertas de hotéis ou apartamentos e reserve em apenas alguns minutos. Pelo aplicativo, você também pode reservar voos, alugar carros e muito mais.
                </Text>
                <Text style={[styles.aboutDescription, isPC && styles.pcAboutDescription, { marginTop: 12 }]}>
                  Reserve toda a sua viagem em apenas um aplicativo (acomodações, voos, aluguel de carro, táxis e atrações)...
                </Text>

                {isPC && (
                  <View style={styles.pcUpdateInfoRow}>
                    <Text style={styles.pcUpdateLabel}>Atualizado em</Text>
                    <Text style={styles.pcUpdateValue}>17 de set. de 2026</Text>
                  </View>
                )}

                <View style={styles.tagsRow}>
                  <View style={[styles.tagChip, isPC && styles.pcTagChip]}>
                    <Text style={[styles.tagChipText, isPC && styles.pcTagChipText]}>
                      #1 principais apps gratuitos Viagem e Turismo
                    </Text>
                  </View>
                  <View style={[styles.tagChip, isPC && styles.pcTagChip]}>
                    <Text style={[styles.tagChipText, isPC && styles.pcTagChipText]}>
                      Viagem e Turismo
                    </Text>
                  </View>
                </View>
              </View>

              {/* ====================================================== */}
              {/* SEÇÃO "SEGURANÇA DOS DADOS"                            */}
              {/* ====================================================== */}
              <View style={[styles.securitySection, isPC && styles.pcSecuritySection]}>
                <View style={styles.aboutHeaderRow}>
                  <Text style={[styles.aboutTitle, isPC && styles.pcAboutTitle]}>
                    Segurança dos dados
                  </Text>
                  <TouchableOpacity
                    style={[styles.circleArrowBtn, isPC && styles.pcCircleArrowBtn]}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color="#E3E3E3"
                    />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.aboutDescription, isPC && styles.pcAboutDescription]}>
                  Sua segurança começa quando você entende como os desenvolvedores coletam e compartilham seus dados. As práticas de segurança e privacidade de dados podem variar de acordo com o uso, a região e a idade.
                </Text>
              </View>
            </View>

            {/* ====================================================== */}
            {/* BARRA LATERAL NO PC (Classificação Livre e Suporte)    */}
            {/* ====================================================== */}
            {isPC && (
              <View style={styles.pcSidebarCol}>
                {/* Card de Classificação Livre */}
                <View style={styles.pcRatingCard}>
                  <View style={styles.pcRatingBadge}>
                    <Text style={styles.pcRatingBadgeText}>L</Text>
                  </View>
                  <View>
                    <Text style={styles.pcRatingTitle}>Classificação Livre</Text>
                    <Text style={styles.pcRatingLink}>Saiba mais</Text>
                  </View>
                </View>

                {/* Suporte do app */}
                <TouchableOpacity style={styles.pcSupportRow} activeOpacity={0.7}>
                  <Text style={styles.pcSupportText}>Suporte do app</Text>
                  <Ionicons name="chevron-down" size={18} color="#8E918F" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* ============================================================== */}
        {/* MENU INFERIOR FIXO (Material 3 Style - Mantido em Mobile e PC) */}
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
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <View style={styles.activePill}>
              <Ionicons name="search" size={20} color="#C2E7FF" />
            </View>
            <Text style={styles.tabLabelActive}>Pesquisa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => router.push('/livros')}
            activeOpacity={0.7}
          >
            <Ionicons name="book-outline" size={22} color="#8E918F" />
            <Text style={styles.tabLabelInactive}>Livros</Text>
          </TouchableOpacity>

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
  // Mobile Base Styles
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
    paddingBottom: 8,
  },
  backBtn: {
    padding: 6,
  },
  headerIconBtn: {
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },
  appHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  appIconBox: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#003580',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  appTitleCol: {
    flex: 1,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E3E3E3',
  },
  developerName: {
    fontSize: 13,
    color: '#A8C7FA',
    fontWeight: '500',
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
    marginBottom: 22,
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
  freeBadgeBox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    backgroundColor: '#1E8E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  statBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  installSection: {
    marginBottom: 26,
  },
  installBtn: {
    backgroundColor: '#A8C7FA',
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  installBtnText: {
    color: '#003258',
    fontSize: 15,
    fontWeight: '700',
  },
  installingContainer: {
    gap: 8,
  },
  installingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  installingText: {
    color: '#A8C7FA',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#282A2C',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#A8C7FA',
    borderRadius: 3,
  },
  installedActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  uninstallBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#444746',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uninstallBtnText: {
    color: '#A8C7FA',
    fontSize: 14,
    fontWeight: '600',
  },
  openBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A8C7FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openBtnText: {
    color: '#003258',
    fontSize: 14,
    fontWeight: '700',
  },
  carouselWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  screenshotsScroll: {
    gap: 14,
    paddingBottom: 24,
  },
  screenshotCard: {
    width: 210,
    height: 360,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pcScreenshotCard: {
    width: 175,
    height: 310,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#282A2C',
    backgroundColor: '#1E1F22',
  },
  pcScreenshotHeader: {
    color: '#E3E3E3',
  },
  screenshotHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003580',
    textAlign: 'center',
    marginBottom: 8,
  },
  mockAppPreview: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    overflow: 'hidden',
  },
  mockBookingBar: {
    backgroundColor: '#003580',
    padding: 8,
  },
  mockLogoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  mockPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mockPillActive: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mockPill: {
    color: '#CBD5E1',
    fontSize: 8,
  },
  mockSearchCard: {
    backgroundColor: '#FFFFFF',
    margin: 6,
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  mockSearchText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1E293B',
  },
  mockDateText: {
    fontSize: 8,
    color: '#64748B',
  },
  mockSearchBtn: {
    backgroundColor: '#003580',
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 4,
  },
  mockSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  mockPromoTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 6,
    marginTop: 2,
  },
  mockCitiesRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 6,
    marginTop: 2,
  },
  mockCityBox: {
    flex: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockCityText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#334155',
  },
  mockHotelCard: {
    flex: 1,
    padding: 8,
  },
  mockHotelImageBox: {
    height: 90,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockHotelImageLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  mockHotelDetails: {
    marginTop: 6,
    gap: 3,
  },
  mockHotelName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  mockHotelStars: {
    fontSize: 9,
    color: '#F59E0B',
  },
  mockTagGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  mockTagGreenText: {
    color: '#15803D',
    fontSize: 8,
    fontWeight: '700',
  },
  mockSelectRoomBtn: {
    borderWidth: 1,
    borderColor: '#003580',
    borderRadius: 4,
    paddingVertical: 3,
    alignItems: 'center',
    marginTop: 4,
  },
  mockSelectRoomText: {
    color: '#003580',
    fontSize: 9,
    fontWeight: '700',
  },
  mockFlightCard: {
    flex: 1,
    padding: 10,
    gap: 6,
  },
  mockFlightInput: {
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mockFlightLabel: {
    fontSize: 8,
    color: '#64748B',
  },
  mockFlightCity: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },
  carouselFloatingBtn: {
    position: 'absolute',
    top: '42%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#282A2C',
    borderWidth: 1,
    borderColor: '#3C4043',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  carouselFloatingLeft: {
    left: 8,
  },
  carouselFloatingRight: {
    right: 8,
  },
  aboutSection: {
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#282A2C',
  },
  aboutHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E3E3E3',
  },
  circleArrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E1F22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aboutDescription: {
    fontSize: 13,
    color: '#8E918F',
    lineHeight: 19,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  tagChip: {
    borderWidth: 1,
    borderColor: '#444746',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagChipText: {
    color: '#E3E3E3',
    fontSize: 12,
  },
  securitySection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#282A2C',
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

  // ==============================================================
  // ESTILOS EXCLUSIVOS DA VERSÃO PC (DESKTOP)
  // ==============================================================
  pcSafeArea: {
    backgroundColor: '#131314',
  },
  pcContainer: {
    backgroundColor: '#131314',
  },
  pcTopNav: {
    paddingHorizontal: 36,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pcBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#1E1F22',
    borderWidth: 1,
    borderColor: '#282A2C',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcBackBtnText: {
    color: '#E3E3E3',
    fontSize: 14,
    fontWeight: '600',
  },
  pcScrollContent: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 36,
    paddingTop: 10,
    paddingBottom: 40,
  },
  pcHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  pcHeaderLeftCol: {
    flex: 1,
    paddingRight: 40,
  },
  pcAppTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#E3E3E3',
    letterSpacing: -0.5,
  },
  pcDeveloperText: {
    fontSize: 15,
    color: '#00A86B',
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 16,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  pcMetricItem: {
    alignItems: 'flex-start',
    gap: 2,
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
    gap: 16,
    marginBottom: 24,
  },
  pcInstallBtn: {
    backgroundColor: '#01875F',
    paddingHorizontal: 32,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcInstallBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pcInstallingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#1A3828',
  },
  pcInstallingText: {
    color: '#7CD8AE',
    fontSize: 14,
    fontWeight: '600',
  },
  pcUninstallBtn: {
    paddingHorizontal: 20,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444746',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcUninstallBtnText: {
    color: '#00A86B',
    fontSize: 14,
    fontWeight: '600',
  },
  pcSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 8,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcSecondaryBtnText: {
    color: '#00A86B',
    fontSize: 14,
    fontWeight: '600',
  },
  pcNoticesContainer: {
    gap: 8,
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
    color: '#00A86B',
    textDecorationLine: 'underline',
  },
  pcAppIconBox: {
    width: 170,
    height: 170,
    borderRadius: 36,
    backgroundColor: '#003580',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  pcAppIconText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  mainLayoutGrid: {
    flexDirection: 'column',
  },
  pcMainLayoutGrid: {
    flexDirection: 'row',
    gap: 36,
    alignItems: 'flex-start',
  },
  leftContentCol: {
    flex: 1,
  },
  pcLeftContentCol: {
    flex: 1,
  },
  pcSidebarCol: {
    width: 280,
    paddingTop: 8,
  },
  pcRatingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#1E1F22',
    borderWidth: 1,
    borderColor: '#282A2C',
    borderRadius: 12,
    marginBottom: 20,
  },
  pcRatingBadge: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#1E8E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pcRatingBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  pcRatingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E3E3E3',
  },
  pcRatingLink: {
    fontSize: 12,
    color: '#8E918F',
    textDecorationLine: 'underline',
    marginTop: 2,
  },
  pcSupportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#282A2C',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcSupportText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E3E3E3',
  },
  pcAboutSection: {
    borderTopWidth: 0,
    marginTop: 18,
    paddingTop: 0,
  },
  pcAboutTitle: {
    color: '#E3E3E3',
    fontSize: 20,
    fontWeight: '700',
  },
  pcCircleArrowBtn: {
    backgroundColor: '#1E1F22',
    borderWidth: 1,
    borderColor: '#282A2C',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' as any } : {}),
  },
  pcAboutDescription: {
    color: '#8E918F',
    fontSize: 14,
    lineHeight: 22,
  },
  pcUpdateInfoRow: {
    marginTop: 16,
    marginBottom: 6,
  },
  pcUpdateLabel: {
    fontSize: 12,
    color: '#8E918F',
  },
  pcUpdateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E3E3E3',
    marginTop: 2,
  },
  pcTagChip: {
    backgroundColor: '#1E1F22',
    borderWidth: 1,
    borderColor: '#282A2C',
  },
  pcTagChipText: {
    color: '#C4C7C5',
    fontWeight: '500',
  },
  pcSecuritySection: {
    borderTopWidth: 1,
    borderColor: '#282A2C',
    marginTop: 24,
    paddingTop: 20,
  },
});
