/**
 * WhatsSound — Session Detail Styles
 */
import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
export 
const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:colors.background },

  // Header
  header: { flexDirection:'row', alignItems:'center', paddingHorizontal:spacing.md, paddingVertical:spacing.sm, backgroundColor:colors.surface, gap:spacing.sm, borderBottomWidth:.5, borderBottomColor:colors.border },
  djAvatar: { width:40, height:40, borderRadius:20, backgroundColor:colors.primary+'22', justifyContent:'center', alignItems:'center' },
  djInit: { ...typography.captionBold, color:colors.primary, fontSize:14 },
  liveDot: { position:'absolute', bottom:0, right:0, width:12, height:12, borderRadius:6, backgroundColor:colors.primary, borderWidth:2, borderColor:colors.surface },
  hTitle: { ...typography.bodyBold, color:colors.textPrimary, fontSize:15 },
  hSub: { ...typography.caption, color:colors.textSecondary },
  liveBadge: { flexDirection:'row', alignItems:'center', backgroundColor:'#EF535020', paddingHorizontal:spacing.sm, paddingVertical:spacing.xs, borderRadius:borderRadius.full, gap:4 },
  liveRedDot: { width:6, height:6, borderRadius:3, backgroundColor:colors.error },
  liveText: { ...typography.captionBold, color:colors.error, fontSize:10 },
  syncBadge: { backgroundColor:'#22c55e20', paddingHorizontal:spacing.sm, paddingVertical:spacing.xs, borderRadius:borderRadius.full, marginLeft:4 },
  syncText: { ...typography.captionBold, color:'#22c55e', fontSize:10 },
  syncingBadge: { backgroundColor:colors.primary+'20', paddingHorizontal:spacing.sm, paddingVertical:spacing.xs, borderRadius:borderRadius.full, marginLeft:4 },
  syncingText: { ...typography.captionBold, color:colors.primary, fontSize:10 },
  dbEarnedBadge: { backgroundColor:'#8B5CF620', paddingHorizontal:spacing.sm, paddingVertical:spacing.xs, borderRadius:borderRadius.full, marginLeft:4 },
  dbEarnedText: { ...typography.captionBold, color:'#8B5CF6', fontSize:10 },

  // Tab Bar
  tabBar: { flexDirection:'row', backgroundColor:colors.surface, borderTopWidth:.5, borderTopColor:colors.border, paddingBottom:Platform.OS==='ios'?spacing.lg:spacing.sm, paddingTop:spacing.sm },
  tabItem: { flex:1, alignItems:'center', gap:2, position:'relative' },
  tabLabel: { ...typography.tab, color:colors.textMuted },
  tabBadge: { position:'absolute', top:-4, right:'20%', backgroundColor:colors.primary, borderRadius:8, minWidth:16, height:16, justifyContent:'center', alignItems:'center', paddingHorizontal:3 },
  tabBadgeT: { color:colors.background, fontSize:9, fontWeight:'700' },

  // Role badge
  roleBadge: { paddingHorizontal:6, paddingVertical:2, borderRadius:borderRadius.full },
  roleBadgeText: { fontSize:10, fontWeight:'700' },

  // Player
  artWrap: { width:200, height:200, borderRadius:borderRadius.xl, overflow:'hidden', marginBottom:spacing.md, shadowColor:colors.primary, shadowOffset:{width:0,height:8}, shadowOpacity:0.4, shadowRadius:24, elevation:16 },
  artImg: { width:'100%', height:'100%' },
  artGlow: { position:'absolute', bottom:0, left:0, right:0, height:60, backgroundColor:colors.background, opacity:0.3 },
  pTitle: { ...typography.h1, color:colors.textPrimary, textAlign:'center' },
  pArtist: { ...typography.h3, color:colors.primary, textAlign:'center', marginTop:4 },
  pAlbum: { ...typography.bodySmall, color:colors.textMuted, textAlign:'center', marginTop:2 },
  progWrap: { width:'85%', marginTop:spacing.xl },
  progTrack: { height:4, backgroundColor:colors.progressTrack, borderRadius:2, overflow:'visible' },
  progFill: { height:'100%', backgroundColor:colors.progressBar, borderRadius:2 },
  progThumb: { position:'absolute', top:-5, width:14, height:14, borderRadius:7, backgroundColor:colors.primary, marginLeft:-7 },
  progTimes: { flexDirection:'row', justifyContent:'space-between', marginTop:6 },
  progTime: { ...typography.caption, color:colors.textMuted, fontSize:12 },
  ctrlRow: { flexDirection:'row', alignItems:'center', gap:spacing['2xl'], marginTop:spacing.xl },
  playBtn: { width:64, height:64, borderRadius:32, backgroundColor:colors.primary, justifyContent:'center', alignItems:'center' },
  reactLabel: { ...typography.captionBold, color:colors.textMuted, marginTop:spacing['2xl'], letterSpacing:1 },
  reactRow: { flexDirection:'row', gap:spacing.md, marginTop:spacing.sm },
  reactBtn: { width:52, height:52, borderRadius:26, backgroundColor:colors.surface, justifyContent:'center', alignItems:'center', borderWidth:1, borderColor:colors.border },
  tipButton: { flexDirection:'column', alignItems:'center', justifyContent:'center', backgroundColor:'#4CAF50', paddingHorizontal:spacing.lg, paddingVertical:spacing.md, borderRadius:borderRadius.lg, gap:4 },
  tipButtonText: { ...typography.buttonSmall, color:'#FFF' },
  upNext: { width:'90%', marginTop:spacing['2xl'], backgroundColor:colors.surface, borderRadius:borderRadius.lg, padding:spacing.md },
  upNextLabel: { ...typography.captionBold, color:colors.textMuted, letterSpacing:.5, marginBottom:spacing.sm },
  upNextItem: { flexDirection:'row', alignItems:'center', gap:spacing.sm, paddingVertical:spacing.sm, borderBottomWidth:.5, borderBottomColor:colors.divider },
  upNextNum: { ...typography.caption, color:colors.textMuted, width:20, textAlign:'center' },
  upNextArt: { width:36, height:36, borderRadius:borderRadius.sm },
  upNextTitle: { ...typography.bodySmall, color:colors.textPrimary, fontWeight:'600' },
  upNextArtist: { ...typography.caption, color:colors.textSecondary },

  // Chat
  bRow: { flexDirection:'row', marginVertical:2 },
  bRowMine: { justifyContent:'flex-end' },
  bRowOther: { justifyContent:'flex-start' },
  bub: { borderRadius:12, paddingHorizontal:spacing.md, paddingVertical:spacing.sm, maxWidth:'80%' },
  bubMine: { backgroundColor:colors.bubbleOwn, borderTopRightRadius:4, borderRightWidth:3, borderRightColor:colors.primary },
  bubOther: { backgroundColor:colors.bubbleOther, borderTopLeftRadius:4, borderLeftWidth:3, borderLeftColor:colors.accent },
  bubHead: { flexDirection:'row', alignItems:'center', gap:6, marginBottom:2 },
  bubUser: { ...typography.captionBold, fontSize:12 },
  bubText: { ...typography.body, color:'#e9edef', fontSize:15 },
  bubTime: { ...typography.caption, color:'rgba(255,255,255,0.5)', fontSize:10, alignSelf:'flex-end', marginTop:2 },
  chatBar: { flexDirection:'row', alignItems:'center', paddingHorizontal:spacing.sm, paddingVertical:spacing.sm, backgroundColor:colors.background, gap:spacing.xs, borderTopWidth:.5, borderTopColor:colors.border },
  chatInput: { flex:1, ...typography.body, color:colors.textPrimary, backgroundColor:colors.surface, borderRadius:borderRadius.xl, paddingHorizontal:spacing.base, paddingVertical:spacing.sm, fontSize:15, maxHeight:100 },
  chatSend: { width:40, height:40, borderRadius:20, backgroundColor:colors.primary, justifyContent:'center', alignItems:'center' },

  // Queue
  qNowRow: { flexDirection:'row', alignItems:'center', gap:spacing.xs, paddingHorizontal:spacing.base, paddingVertical:spacing.sm },
  qNowDot: { width:8, height:8, borderRadius:4, backgroundColor:colors.primary },
  qNowText: { ...typography.captionBold, color:colors.primary, letterSpacing:.5 },
  qCurrent: { flexDirection:'row', alignItems:'center', paddingHorizontal:spacing.base, paddingVertical:spacing.md, gap:spacing.md, backgroundColor:colors.primary+'10' },
  qCurArt: { width:48, height:48, borderRadius:borderRadius.md },
  qCurTitle: { ...typography.bodyBold, color:colors.primary, fontSize:15 },
  qCurArtist: { ...typography.bodySmall, color:colors.textSecondary },
  qBars: { flexDirection:'row', alignItems:'flex-end', gap:2, height:24 },
  qBar: { width:3, backgroundColor:colors.primary, borderRadius:1.5 },
  qDivRow: { flexDirection:'row', alignItems:'center', gap:spacing.xs, paddingHorizontal:spacing.base, paddingVertical:spacing.sm },
  qDivText: { ...typography.captionBold, color:colors.textMuted, letterSpacing:.5 },
  qItem: { flexDirection:'row', alignItems:'center', paddingHorizontal:spacing.base, paddingVertical:spacing.md, gap:spacing.md, borderBottomWidth:.5, borderBottomColor:colors.divider },
  qNum: { ...typography.caption, color:colors.textMuted, width:32, textAlign:'center', fontSize:14 },
  qArt: { width:44, height:44, borderRadius:borderRadius.md },
  qTitle: { ...typography.bodyBold, color:colors.textPrimary, fontSize:15 },
  qArtist: { ...typography.bodySmall, color:colors.textSecondary },
  qMeta: { ...typography.caption, color:colors.textMuted },
  qVote: { alignItems:'center', minWidth:40 },
  qVoteN: { ...typography.captionBold, color:colors.textMuted, marginTop:2 },
  fab: { position:'absolute', bottom:spacing.base, right:spacing.base, flexDirection:'row', alignItems:'center', gap:spacing.sm, backgroundColor:colors.primary, paddingHorizontal:spacing.lg, paddingVertical:spacing.md, borderRadius:borderRadius.full, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:8, elevation:8 },
  fabText: { ...typography.buttonSmall, color:colors.background },

  // People
  pStats: { flexDirection:'row', justifyContent:'space-around', paddingVertical:spacing.xl, paddingHorizontal:spacing.base, backgroundColor:colors.surface, marginBottom:spacing.sm },
  pStat: { alignItems:'center' },
  pStatN: { ...typography.h2, color:colors.primary },
  pStatL: { ...typography.caption, color:colors.textMuted, marginTop:2 },
  pStatDiv: { width:1, backgroundColor:colors.border },
  person: { flexDirection:'row', alignItems:'center', paddingHorizontal:spacing.base, paddingVertical:spacing.md, gap:spacing.md, borderBottomWidth:.5, borderBottomColor:colors.divider },
  pAvatar: { width:44, height:44, borderRadius:22, backgroundColor:colors.surfaceLight, justifyContent:'center', alignItems:'center' },
  pAvatarT: { ...typography.captionBold, color:colors.primary, fontSize:14 },
  pOnline: { position:'absolute', bottom:0, right:0, width:12, height:12, borderRadius:6, borderWidth:2, borderColor:colors.background },
  pName: { ...typography.bodyBold, color:colors.textPrimary, fontSize:15 },
  pStatus: { ...typography.caption, color:colors.textMuted },
});
export default styles;
