/**
 * WhatsSound — Simulator Styles
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  refreshButton: {
    padding: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h1,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.md,
    gap: spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107', // Pending = amarillo
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  cardTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  cardUsers: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  cardAmounts: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  cardAmount: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  cardFee: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  cardNet: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: '600',
  },
  cardMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  failButton: {
    backgroundColor: '#F44336',
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  actionText: {
    ...typography.buttonSmall,
    color: '#FFF',
  },
  sendAllButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendAllText: {
    ...typography.button,
    color: '#FFF',
  },
  pushTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  pushBody: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  logEntry: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logTime: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 70,
  },
  logAction: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    flex: 1,
  },
  logDetail: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default styles;
