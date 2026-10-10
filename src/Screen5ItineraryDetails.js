import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from './theme';
import { DemoHeader, StatusPill } from './components';
import { InteractiveMapView } from './MapView';

export function Screen5ItineraryDetails({ option, onProceedToCheckout, language, onToggleLanguage }) {
  const isTe = language === 'te';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DemoHeader
        title={isTe ? '5. ప్రయాణ మార్గ పటము' : '5. Journey Itinerary & Map'}
        subtitle={isTe ? 'ప్రతి బస్సు మార్గము మరియు మార్పిడి పాయింట్లు' : 'Structured Individual Legs, Fare Split & Route Polyline'}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      {/* Embedded Interactive Map */}
      <View style={styles.mapPadding}>
        <InteractiveMapView legs={option.legs} />
      </View>

      {/* Total Fare & Time Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.summaryLabel}>{isTe ? 'మొత్తం ప్రయాణ ఛార్జీ' : 'Total Calculated Fare'}</Text>
            <Text style={styles.fareHighlight}>₹{option.totalFare}</Text>
          </View>
          <View style={styles.rightAlign}>
            <Text style={styles.summaryLabel}>{isTe ? 'అంచనా సమయం' : 'Projected ETA'}</Text>
            <Text style={styles.etaHighlight}>{option.arrivalTime} AM</Text>
          </View>
        </View>
      </View>

      {/* Vertical Timeline Journey Steps */}
      <View style={styles.timelineContainer}>
        <Text style={styles.sectionTitle}>
          📍 {isTe ? 'ప్రయాణ క్రమము (Vertical Journey Timeline)' : 'Journey Segments & Interchanges'}
        </Text>

        {option.legs.map((leg, idx) => (
          <View key={leg.id} style={styles.legCard}>
            <View style={styles.legHeader}>
              <Text style={styles.legBadge}>LEG {idx + 1}</Text>
              <Text style={styles.legOperator}>{leg.operator.name}</Text>
            </View>

            <View style={styles.timelineStep}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineNode, { backgroundColor: theme.colors.secondary }]} />
                <View style={styles.timelineTrackLine} />
              </View>              <View style={styles.timelineRight}>
                <Text style={styles.stepTime}>{leg.departureTime}</Text>
                <Text style={styles.stepStop}>{leg.originStop.name}</Text>
                <Text style={styles.stepMeta}>{leg.coachType} • Fare: ₹{leg.fare}</Text>
              </View>
            </View>

            <View style={styles.timelineStep}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineNode, { backgroundColor: theme.colors.success }]} />
              </View>              <View style={styles.timelineRight}>
                <Text style={styles.stepTime}>{leg.arrivalTime}</Text>
                <Text style={styles.stepStop}>{leg.destStop.name}</Text>
                <Text style={styles.stepMeta}>Vehicle: {leg.vehicle.model}</Text>
              </View>
            </View>

            {/* Transfer Buffer Banner between Legs */}
            {option.transfers && option.transfers[idx] && (
              <View style={styles.transferBanner}>
                <Text style={styles.transferTitle}>
                  🔁 Interchange Transfer at {option.transfers[idx].stop.name}
                </Text>
                <Text style={styles.transferSubtitle}>
                  Scheduled Buffer: {option.transfers[idx].bufferMinutes} mins (Required Min: {option.transfers[idx].requiredBuffer}m)
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Proceed to Checkout CTA */}
      <TouchableOpacity style={styles.checkoutBtn} onPress={onProceedToCheckout}>
        <Text style={styles.checkoutBtnText}>
          {isTe ? 'బుకింగ్ సిమ్యులేషన్‌కి వెళ్ళు ➔' : 'Proceed to Demo Checkout ➔'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 30 },
  mapPadding: { paddingHorizontal: theme.spacing.md, marginTop: 12 },
  summaryCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.md,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rightAlign: { alignItems: 'flex-end' },
  summaryLabel: { fontSize: 11, color: '#94A3B8' },
  fareHighlight: { fontSize: 24, fontWeight: '700', color: '#38BDF8' },
  etaHighlight: { fontSize: 20, fontWeight: '700', color: '#4ADE80' },
  timelineContainer: { marginHorizontal: theme.spacing.md },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 12 },
  legCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: 12,
  },
  legHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  legBadge: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  legOperator: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  timelineStep: { flexDirection: 'row', marginBottom: 12 },
  timelineLeft: { width: 24, alignItems: 'center' },
  timelineNode: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  timelineTrackLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 2 },
  timelineRight: { flex: 1, paddingLeft: 8 },
  stepTime: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  stepStop: { fontSize: 12, fontWeight: '600', color: theme.colors.secondary },
  stepMeta: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2 },
  transferBanner: {
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#7DD3FC',
    marginTop: 8,
  },
  transferTitle: { fontSize: 12, fontWeight: '700', color: '#0369A1' },
  transferSubtitle: { fontSize: 11, color: '#0284C7', marginTop: 2 },
  checkoutBtn: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  checkoutBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
