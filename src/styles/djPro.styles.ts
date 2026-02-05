/**
 * WhatsSound — DJ Pro Styles
 */

import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';

export 
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
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  exportBtnText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabBtnActive: {
    backgroundColor: colors.primary + '20',
  },
  tabBtnText: {
    ...typography.body,
    color: colors.textMuted,
  },
  tabBtnTextActive: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  kpiValue: {
    ...typography.h1,
    color: colors.textPrimary,
    fontSize: 28,
  },
  kpiLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  kpiTrend: {
    ...typography.captionBold,
    color: '#10B981',
    marginTop: 4,
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
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
  lineChart: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  linePoint: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
  pointDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  lineLabel: {
    ...typography.caption,
    color: colors.textMuted,
    position: 'absolute',
    bottom: -20,
    fontSize: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  supportersCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  supporterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  supporterRank: {
    ...typography.bodyBold,
    color: colors.primary,
    width: 30,
  },
  supporterName: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  supporterStats: {
    alignItems: 'flex-end',
  },
  supporterDB: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  supporterSessions: {
    ...typography.caption,
    color: colors.textMuted,
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  insightCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  insightValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  insightLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  retentionChart: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  retentionBar: {
    flex: 1,
    alignItems: 'center',
  },
  retentionBarWrapper: {
    flex: 1,
    width: 16,
    backgroundColor: colors.border,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  retentionFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  retentionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 10,
  },
  chartNote: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    backgroundColor: colors.primary + '10',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  profilePreview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileEmoji: {
    fontSize: 40,
  },
  profileName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  profileDesc: {
    ...typography.caption,
    color: colors.textMuted,
  },
  editProfileBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  editProfileText: {
    ...typography.button,
    color: '#fff',
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contentLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  contentValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  coDJCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  coDJContent: {
    flex: 1,
  },
  coDJTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  coDJDesc: {
    ...typography.caption,
    color: colors.textMuted,
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF620',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#8B5CF640',
    marginTop: spacing.lg,
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
    color: '#8B5CF6',
  },
  ctaDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ctaPrice: {
    ...typography.h3,
    color: '#8B5CF6',
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
    backgroundColor: colors.primary,
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
