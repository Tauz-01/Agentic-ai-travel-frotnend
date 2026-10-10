import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from './theme';
import { DemoHeader, StatusPill } from './components';

export function Screen6Checkout({ option, onConfirmJourney, language, onToggleLanguage }) {
  const isTe = language === 'te';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DemoHeader
        title={isTe ? '6. డెమో చెక్‌అవుట్ & ధృవీకరణ' : '6. Simulated Checkout & Journey Activation'}
        subtitle={isTe ? 'ఉచిత సిమ్యులేషన్ ధృవీకరణ (ఏ విధమైన అసలు రుసుము ఉండదు)' : 'Demonstration Payment Flow (No real cards or transactions)'}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      <View style={styles.noticeBox}>
        <Text style={styles.noticeTitle}>🛡️ {isTe ? 'సిమ్యులేషన్ నోటీసు' : 'Simulated Checkout Environment'}</Text>
        <Text style={styles.noticeText}>
          {isTe
            ? 'ఈ ప్రక్రియ డెమో ప్రయోజనాల కోసం మాత్రమే. అసలు పేమెంట్ గేట్‌వే లేదా డబ్బు విత్‌డ్రా కావు.'
            : 'Per Architectural Constraint: This screen demonstrates the state machine transition from ITINERARY_SELECTED to DEMO_CONFIRMED.'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionHeader}>{isTe ? 'టికెట్ సారాంశం' : 'Trip Summary & Passengers'}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'ప్రయాణీకుల సంఖ్య:' : 'Passengers:'}</Text>
          <Text style={styles.val}>1 Adult (Single Berth)</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'ఎంచుకున్న బస్సు:' : 'Selected Service:'}</Text>
          <Text style={styles.val}>{option.operator}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'మొత్తం చెల్లించాల్సిన మొత్తం:' : 'Total Amount Due:'}</Text>
          <Text style={styles.fareVal}>₹{option.totalFare}</Text>
        </View>
      </View>

      <View style={styles.paymentMethodCard}>
        <Text style={styles.sectionHeader}>{isTe ? 'సిమ్యులేటెడ్ పేమెంట్ మోడ్' : 'Select Demo Payment Method'}</Text>
        
        <TouchableOpacity style={styles.radioRow}>
          <Text style={styles.radioDot}>🔘</Text>
          <Text style={styles.radioText}>Simulated UPI (RoamPay Demo Wallet)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.radioRow}>
          <Text style={styles.radioDot}>⚪</Text>
          <Text style={styles.radioText}>Demo Credit/Debit Card</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.confirmBtn} onPress={onConfirmJourney}>
        <Text style={styles.confirmBtnText}>
          {isTe ? 'సిమ్యులేటెడ్ ప్రయాణాన్ని ప్రారంభించు ➔' : 'Confirm & Start Simulated Journey ➔'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 30 },
  noticeBox: {
    backgroundColor: '#F1F5F9',
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 4 },
  noticeText: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: 12,
  },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, color: theme.colors.textSecondary },
  val: { fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary },
  fareVal: { fontSize: 20, fontWeight: '700', color: theme.colors.secondary },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: 12,
  },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  radioDot: { fontSize: 16 },
  radioText: { fontSize: 13, color: theme.colors.textPrimary, fontWeight: '600' },
  confirmBtn: {
    backgroundColor: theme.colors.success,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  confirmBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
