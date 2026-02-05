/**
 * WhatsSound — DJ Panel Styles
 * Extracted from dj-panel.tsx
 */

import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.base, paddingBottom: spacing['4xl'] },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  backBtn: { padding: spacing.xs },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerTitle: { ...typography.h2, color: colors.textPrimary },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,59,48,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  pulseContainer: { width: 12, height: 12, alignItems: 'center', justifyContent: 'center' },
  pulseRing: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff3b30',
  },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#ff3b30' },
  liveText: { ...typography.captionBold, color: '#ff3b30', fontSize: 10, letterSpacing: 0.5 },
  settingsBtn: { padding: spacing.xs },

  // Session
  sessionBar: { marginBottom: spacing.md },
  sessionName: { ...typography.h3, color: colors.primary, fontSize: 17 },
  sessionGenre: { ...typography.caption, color: colors.textMuted, marginTop: 2 },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 17 },
  statLabel: { ...typography.caption, color: colors.textMuted, fontSize: 10 },

  // Now Playing
  nowPlayingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    ...typography.captionBold,
    color: colors.textMuted,
    letterSpacing: 1,
    fontSize: 10,
    marginBottom: spacing.sm,
  },
  nowPlayingContent: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  albumArt: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.md,
  },
  songDetails: { flex: 1, justifyContent: 'center' },
  songTitle: { ...typography.h3, color: colors.textPrimary, fontSize: 18 },
  songArtist: { ...typography.body, color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  songAlbum: { ...typography.caption, color: colors.textMuted, marginTop: 2 },

  // Progress
  progressContainer: { marginBottom: spacing.md },
  progressTrack: {
    height: 4,
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: { ...typography.caption, color: colors.textMuted, fontSize: 11 },

  // Controls
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2xl'],
    marginBottom: spacing.md,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Volume
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  volumeTrack: {
    flex: 1,
    height: 3,
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: colors.textMuted,
    borderRadius: 2,
  },
  volumeText: { ...typography.caption, color: colors.textMuted, fontSize: 11, minWidth: 30 },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 15 },
  seeAllText: { ...typography.bodySmall, color: colors.primary, fontSize: 13 },

  // Next songs
  nextSongRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  nextRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextRankFirst: { backgroundColor: 'rgba(255,215,0,0.2)' },
  nextRankText: { ...typography.captionBold, color: colors.textMuted, fontSize: 12 },
  nextRankTextFirst: { color: '#FFD700' },
  nextSongInfo: { flex: 1 },
  nextSongTitle: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 13 },
  nextSongArtist: { ...typography.caption, color: colors.textMuted, fontSize: 11 },
  nextVotes: {
    backgroundColor: 'rgba(255,107,0,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  nextVotesText: { ...typography.captionBold, color: '#ff6b00', fontSize: 12 },

  // Chat
  chatCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatMsg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  chatAvatar: { fontSize: 20 },
  chatBubble: { flex: 1 },
  chatUser: { ...typography.captionBold, color: colors.primary, fontSize: 12 },
  chatText: { ...typography.bodySmall, color: colors.textPrimary, fontSize: 13 },
  chatTime: { ...typography.caption, color: colors.textMuted, fontSize: 10, marginTop: 2 },

  // Actions
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionCardActive: {
    borderColor: colors.primary + '50',
    backgroundColor: colors.primary + '08',
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { ...typography.captionBold, color: colors.textSecondary, fontSize: 11 },
  actionLabelActive: { color: colors.primary },

  // Nav
  navRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navBtnText: { ...typography.captionBold, color: colors.textSecondary, fontSize: 12 },

  // End
  endBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.error + '30',
    marginBottom: spacing.xl,
  },
  endText: { ...typography.bodyBold, color: colors.error, fontSize: 14 },

  // Connected Users
  connectedCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  connUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  connAvatar: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  connOnline: {
    position: 'absolute', bottom: -1, right: -1,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.primary,
    borderWidth: 2, borderColor: colors.surface,
  },
  connName: { ...typography.bodyBold, color: colors.textPrimary, fontSize: 13 },
  connStatus: { ...typography.caption, color: colors.textMuted, fontSize: 11 },

  // AI Chat
  aiCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    gap: spacing.sm,
  },
  aiMsg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  aiAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center', justifyContent: 'center',
  },
  aiBubble: {
    flex: 1,
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  aiText: { ...typography.bodySmall, color: colors.textPrimary, fontSize: 13, lineHeight: 18 },
  aiTime: { ...typography.caption, color: colors.textMuted, fontSize: 10, marginTop: 4 },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  aiInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiSendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});

export default styles;
