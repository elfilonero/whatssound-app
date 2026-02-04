/**
 * WhatsSound — PermanentSponsors
 * Lista de patrocinadores permanentes en perfil de DJ
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// LinearGradient reemplazado por View simple
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { supabase } from '../../lib/supabase';

interface Sponsor {
  sponsor_id: string;
  sponsor_name: string;
  sponsor_avatar: string | null;
  message: string | null;
  is_highlighted: boolean;
  created_at: string;
}

interface PermanentSponsorsProps {
  djId: string;
  onBecomeSponsor?: () => void;
}

export function PermanentSponsors({ djId, onBecomeSponsor }: PermanentSponsorsProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSponsors();
  }, [djId]);

  const loadSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('ws_dj_permanent_sponsors')
        .select('*')
        .eq('dj_id', djId)
        .order('is_highlighted', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSponsors(data || []);
    } catch (error) {
      console.error('[PermanentSponsors] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  if (sponsors.length === 0) {
    return (
      <Pressable style={styles.emptyContainer} onPress={onBecomeSponsor}>
        <Ionicons name="diamond-outline" size={24} color="#FFD700" />
        <Text style={styles.emptyText}>Sé el primer patrocinador permanente</Text>
        <Text style={styles.emptySubtext}>Tu nombre aquí para siempre · €19.99</Text>
      </Pressable>
    );
  }

  const renderSponsor = ({ item }: { item: Sponsor }) => (
    <View style={[styles.sponsorCard, item.is_highlighted && styles.sponsorHighlighted]}>
      {item.is_highlighted && (
        <View style={[styles.highlightGradient, { backgroundColor: 'rgba(255,215,0,0.15)' }]} />
      )}
      
      {item.sponsor_avatar ? (
        <Image source={{ uri: item.sponsor_avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarText}>
            {item.sponsor_name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.sponsorInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.sponsorName}>{item.sponsor_name}</Text>
          {item.is_highlighted && (
            <Ionicons name="star" size={14} color="#FFD700" />
          )}
        </View>
        {item.message && (
          <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        )}
      </View>

      <Ionicons name="diamond" size={16} color="#FFD700" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="diamond" size={20} color="#FFD700" />
        <Text style={styles.title}>Patrocinadores Permanentes</Text>
        <Text style={styles.count}>{sponsors.length}</Text>
      </View>

      <FlatList
        data={sponsors}
        keyExtractor={item => item.sponsor_id}
        renderItem={renderSponsor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <Pressable style={styles.becomeButton} onPress={onBecomeSponsor}>
            <Ionicons name="add-circle" size={24} color="#FFD700" />
            <Text style={styles.becomeText}>Únete</Text>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  title: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
  },
  count: {
    ...typography.caption,
    color: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
  },
  list: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  sponsorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 12,
    gap: spacing.sm,
    minWidth: 200,
    overflow: 'hidden',
  },
  sponsorHighlighted: {
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  highlightGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  sponsorInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sponsorName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  message: {
    ...typography.caption,
    color: colors.textMuted,
  },
  becomeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,215,0,0.1)',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    minWidth: 80,
  },
  becomeText: {
    ...typography.caption,
    color: '#FFD700',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(255,215,0,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    borderStyle: 'dashed',
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: '#FFD700',
    marginTop: spacing.sm,
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

export default PermanentSponsors;
