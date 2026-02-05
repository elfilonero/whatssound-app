/**
 * WhatsSound — Hall of Fame Styles
 */
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B141A',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  podiumItem: {
    alignItems: 'center',
    width: 100,
  },
  podiumAvatar: {
    borderWidth: 3,
  },
  podiumAvatarPlaceholder: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  medal: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -12,
    zIndex: 1,
  },
  medalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    maxWidth: 90,
  },
  podiumBadge: {
    fontSize: 14,
    marginTop: 2,
  },
  podiumCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  podiumCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  pedestal: {
    width: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginTop: 10,
  },
  list: {
    paddingHorizontal: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  listRank: {
    width: 40,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  listAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  listAvatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
    marginLeft: 12,
  },
  listNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  listBadge: {
    fontSize: 14,
  },
  listCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  info: {
    padding: 20,
    marginTop: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default styles;
