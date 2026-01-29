/**
 * WhatsSound — Cola de Canciones
 * Lista con votación, canción actual, siguientes
 * Conectada a Supabase via sessionStore
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing, borderRadius } from '../../src/theme/spacing';
import { useSessionStore } from '../../src/stores/sessionStore';
import { supabase } from '../../src/lib/supabase';

const SESSION_ID = '9ee38aaa-30a1-4aa8-9925-3155597ad025';

interface Song {
  id: string;
  title: string;
  artist: string;
  requestedBy: string;
  votes: number;
  userVoted: boolean;
  status: 'playing' | 'next' | 'queued';
  duration: string;
  fromDB?: boolean;
}

const MOCK_QUEUE: Song[] = [
  { id: 'mock-1', title: 'Gasolina', artist: 'Daddy Yankee', requestedBy: 'Carlos', votes: 12, userVoted: true, status: 'playing', duration: '3:12' },
  { id: 'mock-2', title: 'Dákiti', artist: 'Bad Bunny ft. Jhay Cortez', requestedBy: 'Laura', votes: 8, userVoted: false, status: 'next', duration: '3:25' },
  { id: 'mock-3', title: 'Pepas', artist: 'Farruko', requestedBy: 'Pedro', votes: 6, userVoted: true, status: 'queued', duration: '4:47' },
  { id: 'mock-4', title: 'Tusa', artist: 'Karol G ft. Nicki Minaj', requestedBy: 'María', votes: 5, userVoted: false, status: 'queued', duration: '3:20' },
  { id: 'mock-5', title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', requestedBy: 'Ana', votes: 4, userVoted: false, status: 'queued', duration: '3:47' },
  { id: 'mock-6', title: 'Con Calma', artist: 'Daddy Yankee ft. Snow', requestedBy: 'DJ Marcos', votes: 3, userVoted: false, status: 'queued', duration: '3:30' },
  { id: 'mock-7', title: 'Baila Conmigo', artist: 'Selena Gomez ft. Rauw', requestedBy: 'Sofia', votes: 2, userVoted: false, status: 'queued', duration: '3:15' },
];

const SongItem = ({ song, onVote }: { song: Song; onVote: () => void }) => (
  <View style={[styles.songItem, song.status === 'playing' && styles.songPlaying]}>
    {/* Status indicator */}
    <View style={styles.songLeft}>
      {song.status === 'playing' ? (
        <View style={styles.playingIcon}>
          <Ionicons name="musical-note" size={18} color={colors.primary} />
        </View>
      ) : (
        <View style={styles.albumThumb}>
          <Ionicons name="disc" size={18} color={colors.textMuted} />
        </View>
      )}
    </View>

    {/* Song info */}
    <View style={styles.songInfo}>
      <View style={styles.titleRow}>
        <Text style={[styles.songTitle, song.status === 'playing' && styles.songTitlePlaying]} numberOfLines={1}>
          {song.title}
        </Text>
        {song.fromDB && (
          <View style={styles.dbBadge}>
            <Text style={styles.dbBadgeText}>DB</Text>
          </View>
        )}
      </View>
      <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
      <Text style={styles.requestedBy}>
        Pedida por {song.requestedBy} · {song.duration}
      </Text>
    </View>

    {/* Vote button */}
    <TouchableOpacity style={styles.voteContainer} onPress={onVote}>
      <Ionicons
        name={song.userVoted ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
        size={28}
        color={song.userVoted ? colors.primary : colors.textMuted}
      />
      <Text style={[styles.voteCount, song.userVoted && styles.voteCountActive]}>
        {song.votes}
      </Text>
    </TouchableOpacity>
  </View>
);

export default function QueueScreen() {
  const router = useRouter();
  const { queue: dbQueue, fetchQueue, voteSong } = useSessionStore();
  const [localQueue, setLocalQueue] = useState<Song[]>(MOCK_QUEUE);
  const [refreshing, setRefreshing] = useState(false);

  // Map DB queue items to Song format
  const mapDBtoSong = useCallback((items: typeof dbQueue): Song[] => {
    return items.map((q, i) => ({
      id: q.id,
      title: q.song_name,
      artist: q.artist,
      requestedBy: q.requester_name || 'Anónimo',
      votes: q.votes,
      userVoted: false,
      status: q.status === 'playing' ? 'playing' : i === 0 && q.status === 'pending' ? 'next' : 'queued',
      duration: '--:--',
      fromDB: true,
    }));
  }, []);

  // Build merged queue: DB songs first, then mock as fallback
  const buildQueue = useCallback(() => {
    const dbSongs = mapDBtoSong(dbQueue);
    if (dbSongs.length > 0) {
      // DB songs on top, mock songs below as padding
      const dbIds = new Set(dbSongs.map(s => s.title.toLowerCase()));
      const mockFallback = MOCK_QUEUE.filter(s => !dbIds.has(s.title.toLowerCase()));
      return [...dbSongs, ...mockFallback];
    }
    return MOCK_QUEUE;
  }, [dbQueue, mapDBtoSong]);

  useEffect(() => {
    fetchQueue(SESSION_ID);

    // Realtime: refresh queue on any change
    const channel = supabase
      .channel(`queue-${SESSION_ID}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'queue',
        filter: `session_id=eq.${SESSION_ID}`,
      }, () => {
        fetchQueue(SESSION_ID);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    setLocalQueue(buildQueue());
  }, [dbQueue, buildQueue]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQueue(SESSION_ID);
    setRefreshing(false);
  }, [fetchQueue]);

  const handleVote = (id: string, fromDB?: boolean) => {
    // Optimistic local update
    setLocalQueue(prev => prev.map(song => {
      if (song.id === id) {
        return {
          ...song,
          userVoted: !song.userVoted,
          votes: song.userVoted ? song.votes - 1 : song.votes + 1,
        };
      }
      return song;
    }).sort((a, b) => {
      if (a.status === 'playing') return -1;
      if (b.status === 'playing') return 1;
      if (a.status === 'next') return -1;
      if (b.status === 'next') return 1;
      return b.votes - a.votes;
    }));

    // If it's a DB song, also persist the vote
    if (fromDB) {
      voteSong(id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cola de canciones</Text>
        <TouchableOpacity onPress={() => router.push('/session/request-song')}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Now playing label */}
      <View style={styles.sectionLabel}>
        <Ionicons name="radio" size={14} color={colors.primary} />
        <Text style={styles.sectionText}>SONANDO AHORA</Text>
      </View>

      {/* Queue */}
      <FlatList
        data={localQueue}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            {index === 1 && (
              <View style={styles.sectionLabel}>
                <Ionicons name="list" size={14} color={colors.textMuted} />
                <Text style={[styles.sectionText, { color: colors.textMuted }]}>
                  SIGUIENTES ({localQueue.length - 1})
                </Text>
              </View>
            )}
            <SongItem song={item} onVote={() => handleVote(item.id, item.fromDB)} />
          </>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
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
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  sectionText: {
    ...typography.captionBold,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  list: {
    paddingBottom: spacing['3xl'],
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
  },
  songPlaying: {
    backgroundColor: colors.primary + '10',
  },
  songLeft: {},
  playingIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumThumb: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songInfo: {
    flex: 1,
    gap: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  songTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 15,
    flexShrink: 1,
  },
  songTitlePlaying: {
    color: colors.primary,
  },
  dbBadge: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  dbBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  songArtist: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  requestedBy: {
    ...typography.caption,
    color: colors.textMuted,
  },
  voteContainer: {
    alignItems: 'center',
    minWidth: 40,
  },
  voteCount: {
    ...typography.captionBold,
    color: colors.textMuted,
    marginTop: 2,
  },
  voteCountActive: {
    color: colors.primary,
  },
});
