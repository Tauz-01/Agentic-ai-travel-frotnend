import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from './theme';
import { DemoHeader, StatusPill } from './components';

export function Screen8RecoveryApproval({ activeItinerary, proposal, onApprove, onReject, language, onToggleLanguage }) {
  const isTe = language === 'te';

  if (!proposal) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DemoHeader
        title={isTe ? '8. ప్రయాణ మార్పు అనుమతి (Approval Required)' : '8. Explicit Traveler Approval Gate'}
        subtitle={isTe ? 'సవరించిన ప్రయాణ వివరాలు మరియు ఛార్జీ సరిచూడండి' : 'Review Proposed Alternative Itinerary Revision #2'}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      <View style={styles.gateBanner}>
        <Text style={styles.gateTitle}>✋ {isTe ? 'వినియోగదారు అనుమతి తప్పనిసరి' : 'EXPLICIT Traveler Approval Gate'}</Text>
        <Text style={styles.gateText}>
          {isTe
            ? 'ప్రతిపాదిత ప్రయాణ ప్రణాళిక మీ అనుమతి లేనిదే సవరించబడదు. మార్పులను తనిఖీ చేసి ఆమోదించండి.'
            : 'Per Architectural Goal Stage 12: Proposed alternatives remain inactive until explicit traveler consent is granted.'}
        </Text>
      </View>

      {/* Side-by-Side Comparison Card (Diff View) */}
      <View style={styles.diffCard}>
        <Text style={styles.diffCardHeader}>{isTe ? 'పాత మరియు కొత్త ప్రణాళిక పోలిక' : 'Original vs Proposed Itinerary Diff'}</Text>

        <View style={styles.diffGrid}>
          {/* Column 1: Old Active Itinerary */}
          <View style={styles.oldCol}>
            <Text style={styles.colTitle}>{isTe ? 'పాత ప్రణాళిక' : 'Active Plan (Rev 1)'}</Text>
            <Text style={styles.oldText}>Bus B @ Vijayawada PNBS</Text>
            <Text style={styles.strikethrough}>ETA: {proposal.oldEta} AM</Text>
            <Text style={styles.strikethrough}>Fare: ₹{activeItinerary.totalFare}</Text>
            <StatusPill type="WARNING" label="UNSAFE (5m)" />
          </View>

          <View style={styles.vDivider} />

          {/* Column 2: New Proposal */}
          <View style={styles.newCol}>
            <Text style={styles.colTitleNew}>{isTe ? 'ప్రతిపాదిత మార్గం' : 'Proposal (Rev 2)'}</Text>
            <Text style={styles.newText}>Garuda @ Vijayawada Bypass</Text>
            <Text style={styles.newEta}>ETA: {proposal.newEta} AM</Text>
            <Text style={styles.newFare}>Fare: ₹{proposal.newTotalFare}</Text>
            <Text style={styles.fareDiffTag}>+{`₹${proposal.fareDifference}`}</Text>
            <StatusPill type="SUCCESS" label="SAFE (45m)" />
          </View>
        </View>

        {/* AI Localized Explanation Box */}
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>🤖 {isTe ? 'AI ప్రయాణ సలహాదారు విశ్లేషణ' : 'AI Recovery Explanation'}</Text>
          <Text style={styles.explanationText}>
            {isTe ? proposal.recommendationReasonTe : proposal.recommendationReasonEn}
          </Text>
        </View>
      </View>

      {/* Action Buttons (Approve / Reject) */}
      <View style={styles.actionCluster}>
        <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
          <Text style={styles.rejectBtnText}>{isTe ? 'తిరస్కరించు (Keep Original)' : 'Reject Proposal'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.approveBtn} onPress={onApprove}>
          <Text style={styles.approveBtnText}>
            {isTe ? 'ఆమోదించు & అప్‌డేట్ చేయి ➔' : 'Approve & Commit Revision 2 ➔'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 30 },
  gateBanner: {
    backgroundColor: '#FFF7ED',
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  gateTitle: { fontSize: 13, fontWeight: '700', color: '#C2410C', marginBottom: 4 },
  gateText: { fontSize: 11, color: '#EA580C', lineHeight: 16 },
  diffCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: 12,
  },
  diffCardHeader: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  diffGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: theme.radius.lg,
  },
  oldCol: { flex: 1, gap: 4, alignItems: 'flex-start' },
  newCol: { flex: 1, gap: 4, alignItems: 'flex-start' },
  vDivider: { width: 1, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  colTitle: { fontSize: 11, fontWeight: '700', color: theme.colors.textMuted },
  colTitleNew: { fontSize: 11, fontWeight: '700', color: theme.colors.secondary },
  oldText: { fontSize: 11, color: theme.colors.textSecondary },
  newText: { fontSize: 11, fontWeight: '700', color: theme.colors.textPrimary },
  strikethrough: { fontSize: 12, textDecorationLine: 'line-through', color: theme.colors.textMuted },
  newEta: { fontSize: 13, fontWeight: '700', color: theme.colors.success },
  newFare: { fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary },
  fareDiffTag: { fontSize: 11, fontWeight: '700', color: theme.colors.action },
  explanationBox: {
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  explanationTitle: { fontSize: 12, fontWeight: '700', color: '#0369A1', marginBottom: 4 },
  explanationText: { fontSize: 11, color: '#0284C7', lineHeight: 16 },
  actionCluster: { flexDirection: 'row', gap: 10, margin: theme.spacing.md },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rejectBtnText: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary },
  approveBtn: {
    flex: 1.6,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  approveBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' }
});
