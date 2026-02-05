/**
 * WhatsSound — Creator Styles
 */
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const styles = StyleSheet.create({
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
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  tierBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginTop: 2,
  },
  tierText: {
    ...typography.caption,
  },
  upgradeBtn: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  upgradeBtnText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h2,
    color: colors.textPrimary,
    fontSize: 24,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statTrend: {
    ...typography.captionBold,
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  chartContainer: {
    height: 120,
    marginBottom: spacing.md,
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    width: 20,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 10,
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  chartStat: {
    alignItems: 'center',
  },
  chartStatValue: {
    ...typography.h3,
    color: colors.primary,
  },
  chartStatLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  songsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  songRank: {
    ...typography.bodyBold,
    color: colors.primary,
    width: 30,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  songArtist: {
    ...typography.caption,
    color: colors.textMuted,
  },
  songVotes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  songVotesText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  scheduleDesc: {
    ...typography.caption,
    color: colors.textMuted,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  notifStat: {
    flex: 1,
    alignItems: 'center',
  },
  notifValue: {
    ...typography.h2,
    color: colors.primary,
  },
  notifLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    marginBottom: spacing.xl,
  },
  ctaEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  ctaContent: {
    flex: 1,
  },
  ctaTitle: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  ctaDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ctaPrice: {
    ...typography.h3,
    color: colors.primary,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  lockedEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  lockedTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  lockedDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  unlockBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  unlockBtnText: {
    ...typography.button,
    color: '#fff',
  },
  backLink: {
    ...typography.body,
    color: colors.textMuted,
  },
});

export default styles;
