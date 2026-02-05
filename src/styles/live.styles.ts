/**
 * WhatsSound — Live Styles
 */
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
export 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing['3xl'] },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  createText: { ...typography.captionBold, color: colors.textOnPrimary },

  // Filters
  filters: { marginBottom: spacing.md },
  filtersContent: { paddingHorizontal: spacing.base, gap: spacing.sm },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: { backgroundColor: colors.primary + '20', borderColor: colors.primary },
  filterText: { ...typography.bodySmall, color: colors.textSecondary },
  filterTextActive: { color: colors.primary, fontWeight: '600' },

  // Featured card
  featuredCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  liveBadgeText: { ...typography.captionBold, color: colors.error },
  genreTag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  genreTagText: { ...typography.caption, color: colors.textSecondary },

  featuredBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  featuredInfo: { flex: 1, gap: 4 },
  featuredName: { ...typography.h3, color: colors.textPrimary },
  featuredDj: { ...typography.bodySmall, color: colors.textSecondary },
  featuredSongRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  featuredSong: { ...typography.bodySmall, color: colors.primary, flex: 1 },

  featuredFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.divider,
  },
  listenersRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  listenersText: { ...typography.caption, color: colors.accent },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  joinText: { ...typography.captionBold, color: colors.textOnPrimary },

  // Session items
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.divider,
  },
  // Removed unused styles - live indicator now handled in SessionAvatar
  sessionInfo: { flex: 1, gap: 2 },
  sessionName: { ...typography.bodyBold, color: colors.textPrimary },
  sessionDj: { ...typography.caption, color: colors.textSecondary },
  sessionSongRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  sessionSong: { ...typography.caption, color: colors.primary, flex: 1 },
  sessionRight: { alignItems: 'center', gap: 2 },
  listenerCount: { ...typography.bodyBold, color: colors.textPrimary },

  // States
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
  },
  stateTitle: { ...typography.h3, color: colors.textPrimary },
  stateText: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center' },

  // Skeleton loading
  skeletonContainer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
  },
  featuredSkeleton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
});

export default styles;
