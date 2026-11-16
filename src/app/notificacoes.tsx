import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { storage } from '@/services/storage';
import { colors, radius, spacing } from '@/theme';

const READ_STORAGE_KEY = '@playstore:notificacoes-lidas';

interface NotificationOffer {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  targetRoute: '/livros' | '/booking-detalhes';
  actionLabel: string;
}

const DEFAULT_NOTIFICATIONS: NotificationOffer[] = [
  {
    id: 'notif-1',
    title: 'E-books com até 50% de desconto',
    description: 'Confira os títulos selecionados por menos de R$ 5 na Play Livros hoje.',
    dateLabel: 'Hoje',
    icon: 'book-outline',
    targetRoute: '/livros',
    actionLabel: 'Ver Play Livros',
  },
  {
    id: 'notif-2',
    title: 'Oferta de viagem na Booking.com',
    description: 'Economize em hospedagens e voos com descontos exclusivos no app parceiro.',
    dateLabel: 'Ontem',
    icon: 'airplane-outline',
    targetRoute: '/booking-detalhes',
    actionLabel: 'Abrir app',
  },
  {
    id: 'notif-3',
    title: 'Ganhe Pontos extras no Play Points',
    description: 'Ative o bônus semanal ao avaliar livros ou instalar novos aplicativos.',
    dateLabel: 'Há 2 dias',
    icon: 'sparkles-outline',
    targetRoute: '/livros',
    actionLabel: 'Explorar agora',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [readIds, setReadIds] = useState<string[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.id = 'playstore-notifications-scroll';
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
        document.getElementById('playstore-notifications-scroll')?.remove();
      };
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      storage.get<string[]>(READ_STORAGE_KEY, []).then((saved) => {
        if (active) setReadIds(saved);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const persistReadIds = async (next: string[]) => {
    setReadIds(next);
    await storage.set(READ_STORAGE_KEY, next);
  };

  const markAsRead = async (id: string) => {
    if (!readIds.includes(id)) {
      await persistReadIds([...readIds, id]);
    }
  };

  const markAllAsRead = async () => {
    await persistReadIds(DEFAULT_NOTIFICATIONS.map((item) => item.id));
  };

  const restoreNotifications = async () => {
    await storage.remove(READ_STORAGE_KEY);
    setReadIds([]);
  };

  const handleOpenOffer = async (item: NotificationOffer) => {
    await markAsRead(item.id);
    router.push(item.targetRoute);
  };

  const unreadCount = useMemo(
    () => DEFAULT_NOTIFICATIONS.filter((item) => !readIds.includes(item.id)).length,
    [readIds],
  );

  const visibleList = useMemo(() => {
    if (filterMode === 'unread') {
      return DEFAULT_NOTIFICATIONS.filter((item) => !readIds.includes(item.id));
    }
    return DEFAULT_NOTIFICATIONS;
  }, [filterMode, readIds]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/perfil');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.container}>
        {/* Cabecalho */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notificações e ofertas</Text>

          {unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllAsRead} activeOpacity={0.7}>
              <Text style={styles.headerAction}>Marcar lidas</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={restoreNotifications} activeOpacity={0.7}>
              <Text style={styles.headerAction}>Restaurar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Abas de Filtro */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, filterMode === 'all' && styles.filterChipActive]}
            onPress={() => setFilterMode('all')}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.filterChipText,
                filterMode === 'all' && styles.filterChipTextActive,
              ]}
            >
              Todas ({DEFAULT_NOTIFICATIONS.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filterMode === 'unread' && styles.filterChipActive]}
            onPress={() => setFilterMode('unread')}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.filterChipText,
                filterMode === 'unread' && styles.filterChipTextActive,
              ]}
            >
              Não lidas ({unreadCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Notificacoes */}
        <FlatList
          data={visibleList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="notifications-off-outline" size={52} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Tudo em dia por aqui</Text>
              <Text style={styles.emptyText}>
                Você já leu todas as notificações e ofertas disponíveis.
              </Text>
              <TouchableOpacity
                style={styles.restoreBtn}
                onPress={restoreNotifications}
                activeOpacity={0.8}
              >
                <Text style={styles.restoreBtnText}>Restaurar ofertas</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const isRead = readIds.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.card, !isRead && styles.cardUnread]}
                activeOpacity={0.8}
                onPress={() => handleOpenOffer(item)}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon} size={22} color={colors.primary} />
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {!isRead && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.cardDesc}>{item.description}</Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.dateText}>{item.dateLabel}</Text>
                    <Text style={styles.actionText}>{item.actionLabel}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
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
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 19,
    fontWeight: '500',
  },
  headerAction: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
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
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
  },
  cardUnread: {
    borderColor: colors.primaryContainer,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 6,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  actionText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
    gap: 10,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  restoreBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  restoreBtnText: {
    color: '#062E6F',
    fontSize: 13,
    fontWeight: '700',
  },
});
