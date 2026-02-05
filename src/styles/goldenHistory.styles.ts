/**
 * WhatsSound — Golden History Styles
 */
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B141A',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFD70033',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    gap: 12,
  },
  badgeIcon: {
    fontSize: 36,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgeDesc: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  nextBoostCard: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  nextBoostTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  nextBoostInfo: {
    gap: 8,
  },
  nextBoostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextBoostText: {
    fontSize: 14,
    color: '#888',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#FFD70020',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
  },
  tabTextActive: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 40,
  },
  list: {
    paddingHorizontal: 16,
  },
  boostItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostInfo: {
    flex: 1,
    marginLeft: 12,
  },
  boostUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  boostDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  boostIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  nextBadgeCard: {
    backgroundColor: '#1a1a1a',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  nextBadgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  badgeProgress: {
    gap: 8,
  },
  badgeProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeProgressIcon: {
    fontSize: 20,
  },
  badgeProgressName: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  badgeProgressCount: {
    fontSize: 14,
    color: '#FFD700',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  maxBadge: {
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
  },
});

export default styles;
