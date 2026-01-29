/**
 * WhatsSound — Medios compartidos
 * Grid de fotos, videos, audios y links de un chat
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 2;
const COLS = 3;
const TILE_SIZE = (SCREEN_WIDTH - GRID_GAP * (COLS + 1)) / COLS;

type MediaTab = 'fotos' | 'videos' | 'audios' | 'links';

const TABS: { key: MediaTab; label: string; icon: string }[] = [
  { key: 'fotos', label: 'Fotos', icon: 'image-outline' },
  { key: 'videos', label: 'Videos', icon: 'videocam-outline' },
  { key: 'audios', label: 'Audios', icon: 'musical-notes-outline' },
  { key: 'links', label: 'Links', icon: 'link-outline' },
];

const MOCK_PHOTOS = Array.from({ length: 12 }, (_, i) => ({ id: `p${i}` }));
const MOCK_VIDEOS = Array.from({ length: 4 }, (_, i) => ({ id: `v${i}` }));
const MOCK_AUDIOS = [
  { id: 'a1', title: 'Nota de voz', duration: '0:34' },
  { id: 'a2', title: 'Beat compartido', duration: '2:15' },
  { id: 'a3', title: 'Mensaje de audio', duration: '0:12' },
];
const MOCK_LINKS = [
  { id: 'l1', title: 'Spotify — Playlist Fiesta', url: 'spotify.com/playlist/...' },
  { id: 'l2', title: 'SoundCloud — Nuevo track', url: 'soundcloud.com/track/...' },
];

export default function MediaScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<MediaTab>('fotos');

  const renderGrid = (items: { id: string }[], icon: string) => (
    <View style={styles.grid}>
      {items.map(item => (
        <View key={item.id} style={styles.tile}>
          <Ionicons name={icon as any} size={28} color={colors.textMuted} />
        </View>
      ))}
    </View>
  );

  const renderAudios = () => (
    <View style={styles.listContainer}>
      {MOCK_AUDIOS.map(a => (
        <TouchableOpacity key={a.id} style={styles.audioRow}>
          <View style={styles.audioIcon}>
            <Ionicons name="play" size={18} color={colors.primary} />
          </View>
          <View style={styles.audioInfo}>
            <Text style={styles.audioTitle}>{a.title}</Text>
            <Text style={styles.audioDuration}>{a.duration}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderLinks = () => (
    <View style={styles.listContainer}>
      {MOCK_LINKS.map(l => (
        <TouchableOpacity key={l.id} style={styles.linkRow}>
          <View style={styles.linkIcon}>
            <Ionicons name="globe-outline" size={20} color={colors.accent} />
          </View>
          <View style={styles.linkInfo}>
            <Text style={styles.linkTitle}>{l.title}</Text>
            <Text style={styles.linkUrl}>{l.url}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'fotos': return renderGrid(MOCK_PHOTOS, 'image-outline');
      case 'videos': return renderGrid(MOCK_VIDEOS, 'videocam-outline');
      case 'audios': return renderAudios();
      case 'links': return renderLinks();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medios compartidos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Ionicons
              name={t.icon as any}
              size={16}
              color={activeTab === t.key ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    paddingTop: GRID_GAP,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    paddingHorizontal: GRID_GAP,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xs,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  audioIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioInfo: {
    marginLeft: spacing.sm,
  },
  audioTitle: {
    ...typography.body,
    color: colors.textPrimary,
  },
  audioDuration: {
    ...typography.caption,
    color: colors.textMuted,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  linkTitle: {
    ...typography.body,
    color: colors.textPrimary,
  },
  linkUrl: {
    ...typography.caption,
    color: colors.accent,
  },
});
