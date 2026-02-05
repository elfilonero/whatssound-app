/**
 * WhatsSound — Golden Boost History
 * Pantalla de historial de Golden Boosts dados y recibidos
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useGoldenBoost, GoldenBoostGiven, GoldenBoostReceived } from '../../src/hooks/useGoldenBoost';
import { styles } from '../../src/styles/goldenHistory.styles';
// Helper function (no date-fns dependency)
const formatDistanceToNow = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (days > 0) return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  if (minutes > 0) return `hace ${minutes}m`;
  return 'ahora';
};

type TabType = 'received' | 'given';

export default function GoldenHistoryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('received');
  const [receivedList, setReceivedList] = useState<GoldenBoostReceived[]>([]);
  const [givenList, setGivenList] = useState<GoldenBoostGiven[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    received,
    given,
    available,
    badge,
    getGivenHistory,
    getReceivedHistory,
    getDaysUntilReset,
    getSessionsUntilBonus,
  } = useGoldenBoost();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    const [receivedData, givenData] = await Promise.all([
      getReceivedHistory(50),
      getGivenHistory(50),
    ]);
    setReceivedList(receivedData);
    setGivenList(givenData);
    setIsLoading(false);
  };

  const getBadgeInfo = () => {
    switch (badge) {
      case 'rising_star':
        return { icon: '🌟', name: 'Rising Star', color: '#FFD700' };
      case 'fan_favorite':
        return { icon: '⭐', name: 'Fan Favorite', color: '#FFA500' };
      case 'verified':
        return { icon: '✓', name: 'Verificado', color: '#00BFFF' };
      case 'hall_of_fame':
        return { icon: '🏆', name: 'Hall of Fame', color: '#FFD700' };
      default:
        return null;
    }
  };

  const badgeInfo = getBadgeInfo();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Golden Boosts',
          headerStyle: { backgroundColor: '#0B141A' },
          headerTintColor: '#FFD700',
        }}
      />
      
      <ScrollView style={styles.container}>
        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={32} color="#FFD700" />
            <Text style={styles.statValue}>{available}</Text>
            <Text style={styles.statLabel}>Disponibles</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Ionicons name="arrow-down" size={32} color="#4CAF50" />
            <Text style={styles.statValue}>{received}</Text>
            <Text style={styles.statLabel}>Recibidos</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Ionicons name="arrow-up" size={32} color="#2196F3" />
            <Text style={styles.statValue}>{given}</Text>
            <Text style={styles.statLabel}>Dados</Text>
          </View>
        </View>

        {/* Badge */}
        {badgeInfo && (
          <View style={[styles.badgeCard, { borderColor: badgeInfo.color }]}>
            <Text style={styles.badgeIcon}>{badgeInfo.icon}</Text>
            <View>
              <Text style={[styles.badgeName, { color: badgeInfo.color }]}>
                {badgeInfo.name}
              </Text>
              <Text style={styles.badgeDesc}>
                {received} Golden Boosts recibidos
              </Text>
            </View>
          </View>
        )}

        {/* Próximo boost */}
        <View style={styles.nextBoostCard}>
          <Text style={styles.nextBoostTitle}>Próximo Golden Boost</Text>
          <View style={styles.nextBoostInfo}>
            <View style={styles.nextBoostItem}>
              <Ionicons name="calendar" size={20} color="#888" />
              <Text style={styles.nextBoostText}>
                Regenera en {getDaysUntilReset()} días
              </Text>
            </View>
            <View style={styles.nextBoostItem}>
              <Ionicons name="headset" size={20} color="#888" />
              <Text style={styles.nextBoostText}>
                {getSessionsUntilBonus() > 0 
                  ? `Escucha ${getSessionsUntilBonus()} sesiones más para +1 extra`
                  : '¡Bonus desbloqueado! 🎉'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'received' && styles.tabActive]}
            onPress={() => setActiveTab('received')}
          >
            <Text style={[styles.tabText, activeTab === 'received' && styles.tabTextActive]}>
              Recibidos ({receivedList.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'given' && styles.tabActive]}
            onPress={() => setActiveTab('given')}
          >
            <Text style={[styles.tabText, activeTab === 'given' && styles.tabTextActive]}>
              Dados ({givenList.length})
            </Text>
          </Pressable>
        </View>

        {/* Lista */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
        ) : (
          <View style={styles.list}>
            {activeTab === 'received' ? (
              receivedList.length > 0 ? (
                receivedList.map((item) => (
                  <BoostItem
                    key={item.id}
                    type="received"
                    userName={item.fromUserName}
                    userAvatar={item.fromUserAvatar}
                    date={item.createdAt}
                    onPress={() => router.push(`/profile/${item.fromUserId}`)}
                  />
                ))
              ) : (
                <EmptyState text="Aún no has recibido Golden Boosts" />
              )
            ) : (
              givenList.length > 0 ? (
                givenList.map((item) => (
                  <BoostItem
                    key={item.id}
                    type="given"
                    userName={item.toUserName}
                    userAvatar={item.toUserAvatar}
                    date={item.createdAt}
                    onPress={() => router.push(`/profile/${item.toUserId}`)}
                  />
                ))
              ) : (
                <EmptyState text="Aún no has dado Golden Boosts" />
              )
            )}
          </View>
        )}

        {/* Próximo badge */}
        <View style={styles.nextBadgeCard}>
          <Text style={styles.nextBadgeTitle}>Próximo Badge</Text>
          {received < 10 && (
            <BadgeProgress current={received} target={10} name="Rising Star" icon="🌟" />
          )}
          {received >= 10 && received < 50 && (
            <BadgeProgress current={received} target={50} name="Fan Favorite" icon="⭐" />
          )}
          {received >= 50 && received < 100 && (
            <BadgeProgress current={received} target={100} name="Verificado" icon="✓" />
          )}
          {received >= 100 && received < 500 && (
            <BadgeProgress current={received} target={500} name="Hall of Fame" icon="🏆" />
          )}
          {received >= 500 && (
            <Text style={styles.maxBadge}>¡Has alcanzado el máximo nivel! 🏆</Text>
          )}
        </View>
      </ScrollView>
    </>
  );
}

function BoostItem({ 
  type, 
  userName, 
  userAvatar, 
  date, 
  onPress 
}: {
  type: 'received' | 'given';
  userName: string;
  userAvatar?: string;
  date: Date;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.boostItem} onPress={onPress}>
      {userAvatar ? (
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={20} color="#888" />
        </View>
      )}
      <View style={styles.boostInfo}>
        <Text style={styles.boostUser}>{userName}</Text>
        <Text style={styles.boostDate}>
          {formatDistanceToNow(date)}
        </Text>
      </View>
      <View style={styles.boostIcon}>
        <Ionicons 
          name={type === 'received' ? 'arrow-down' : 'arrow-up'} 
          size={16} 
          color={type === 'received' ? '#4CAF50' : '#2196F3'} 
        />
        <Ionicons name="trophy" size={20} color="#FFD700" />
      </View>
    </Pressable>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="trophy-outline" size={48} color="#444" />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function BadgeProgress({ 
  current, 
  target, 
  name, 
  icon 
}: { 
  current: number; 
  target: number; 
  name: string; 
  icon: string;
}) {
  const progress = (current / target) * 100;
  
  return (
    <View style={styles.badgeProgress}>
      <View style={styles.badgeProgressHeader}>
        <Text style={styles.badgeProgressIcon}>{icon}</Text>
        <Text style={styles.badgeProgressName}>{name}</Text>
        <Text style={styles.badgeProgressCount}>{current}/{target}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}
