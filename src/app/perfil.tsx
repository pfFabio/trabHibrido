import React, { useEffect } from 'react';
import {
  View,
  Text,
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

interface MenuItem {
  id: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconFamily?: 'Ionicons' | 'MaterialCommunityIcons';
  badge?: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    title: 'Gerenciar apps e dispositivos',
    iconName: 'grid-outline',
  },
  {
    id: '2',
    title: 'Notificações e ofertas',
    iconName: 'notifications-outline',
    badge: '3',
  },
  {
    id: '3',
    title: 'Pagamentos e assinaturas',
    iconName: 'card-outline',
  },
  {
    id: '4',
    title: 'Play Protect',
    iconName: 'shield-checkmark-outline',
  },
  {
    id: '5',
    title: 'Play Labs',
    iconName: 'flask-outline',
  },
  {
    id: '6',
    title: 'Biblioteca',
    iconName: 'folder-outline',
  },
  {
    id: '7',
    title: 'Play Pass',
    iconName: 'bookmark-outline',
  },
  {
    id: '8',
    title: 'Play Points',
    iconName: 'diamond-outline',
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Trava de rolagem no navegador web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-profile-scroll';
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
        const el = document.getElementById('playstore-profile-scroll');
        if (el) el.remove();
      };
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#131314" />

      {/* Botão Superior de Fechar (X) */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={26} color="#E3E3E3" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 24) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: Informações do Usuário */}
        <View style={styles.userCard}>
          <View style={styles.userRow}>
            {/* Foto de Perfil com Anel Azul e Badge de Edição */}
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: 'https://github.com/pfFabio.png',
                }}
                style={styles.avatarImage}
              />
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={11} color="#FFFFFF" />
              </View>
            </View>

            {/* Nome, Email e Badge Pro */}
            <View style={styles.userInfoCol}>
              <Text style={styles.userName}>Usuário nome nome</Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                email@email.com
              </Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>Pro</Text>
              </View>
            </View>

            {/* Seta Dropdown */}
            <TouchableOpacity style={styles.dropdownBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-down" size={18} color="#C4C7C5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão em Cápsula: Gerenciar sua Conta do Google */}
        <TouchableOpacity style={styles.pillButton} activeOpacity={0.75}>
          <View style={styles.googleIconBox}>
            <Ionicons name="logo-google" size={18} color="#4285F4" />
          </View>
          <Text style={styles.pillButtonText}>Gerenciar sua Conta do Google</Text>
        </TouchableOpacity>

        {/* Botão em Cápsula: Fazer upgrade para Google AI Ultra */}
        <TouchableOpacity style={styles.pillButton} activeOpacity={0.75}>
          <Ionicons name="sparkles" size={18} color="#E3E3E3" style={{ marginRight: 2 }} />
          <Text style={styles.pillButtonText}>Fazer upgrade para Google AI Ultra</Text>
        </TouchableOpacity>

        {/* Card de Opções de Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuRow} activeOpacity={0.7}>
              <Ionicons name={item.iconName} size={21} color="#C4C7C5" style={styles.menuIcon} />
              <Text style={styles.menuTitle}>{item.title}</Text>
              {item.badge ? (
                <Text style={styles.badgeText}>{item.badge}</Text>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Inferior: Personalização no app Google Play */}
        <View style={styles.bottomCard}>
          <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
            <MaterialCommunityIcons name="tune-variant" size={21} color="#C4C7C5" style={styles.menuIcon} />
            <Text style={styles.menuTitle}>Personalização no app Google Play</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 4,
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  userCard: {
    backgroundColor: '#1E1F22',
    borderRadius: 28,
    padding: 18,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#7FCFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  editBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E1F22',
    borderWidth: 1.5,
    borderColor: '#131314',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoCol: {
    flex: 1,
  },
  userName: {
    color: '#E3E3E3',
    fontSize: 17,
    fontWeight: '700',
  },
  userEmail: {
    color: '#8E918F',
    fontSize: 13,
    marginTop: 2,
  },
  proBadge: {
    backgroundColor: '#004A77',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  proBadgeText: {
    color: '#C2E7FF',
    fontSize: 11,
    fontWeight: '700',
  },
  dropdownBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#282A2C',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1F22',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  googleIconBox: {
    marginRight: 12,
  },
  pillButtonText: {
    color: '#E3E3E3',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  menuCard: {
    backgroundColor: '#1E1F22',
    borderRadius: 28,
    paddingVertical: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  menuIcon: {
    marginRight: 16,
    width: 22,
    textAlign: 'center',
  },
  menuTitle: {
    color: '#E3E3E3',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  badgeText: {
    color: '#8E918F',
    fontSize: 13,
    fontWeight: '500',
  },
  bottomCard: {
    backgroundColor: '#1E1F22',
    borderRadius: 28,
    paddingVertical: 8,
    marginBottom: 20,
  },
});
