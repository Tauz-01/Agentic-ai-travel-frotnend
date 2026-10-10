import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from './theme';
import { DemoHeader, StatusPill } from './components';

export function Screen4Top4Results({ options, onSelectOption, language, onToggleLanguage }) {
  const isTe = language === 'te';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DemoHeader
        title={isTe ? '4. టాప్ 4 ప్రయాణ ఎంపికలు' : '4. Top 4 Evaluated Options'}
        subtitle={isTe ? 'సిఫార్సు ఇంజిన్ ర్యాంకింగ్ స్కోరు' : 'Weighted Recommendation Scoring & Hard-Constraint Validation'}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          {isTe 
            ? 'విశాఖపట్నం ➔ హైదరాబాద్ • గడువు: 09:00 AM • బడ్జెట్: ₹1,500'
            : 'Visakhapatnam ➔ Hyderabad • Deadline: 09:00 AM • Max Budget: ₹1,500'}
        </Text>
      </View>

      {options.map((opt, index) => {
        const isFeasible = opt.feasibility.isFeasible;
        const isRecommended = index === 0 && isFeasible; // Top 1 option badge

        return (
          <TouchableOpacity
            key={opt.id}
            style={[
              styles.optionCard,
              isRecommended && styles.recommendedCard,
              !isFeasible && styles.infeasibleCard
            ]}
            onPress={() => onSelectOption(opt)}
          >
            {/* Recommendation / Violation Badge Header */}
            <View style={styles.cardHeader}>
              {isRecommended ? (
                <View style={styles.recBadge}>
                  <Text style={styles.recBadgeText}>🌟 {isTe ? 'ఉత్తమ సిఫార్సు' : 'RECOMMENDED BEST CHOICE'}</Text>
                </View>
              ) : isFeasible ? (
                <StatusPill type="INFO" label={opt.type === 'DIRECT' ? 'DIRECT' : 'CONNECTING'} />
              ) : (
                <StatusPill type="VIOLATION" label={isTe ? 'నిబంధన ఉల్లంఘన' : 'CONSTRAINT VIOLATED'} />
              )}
              
              <Text style={styles.scoreText}>Score: {opt.score}/100</Text>
            </View>

            {/* Operator and Bus Type */}
            <Text style={styles.operatorTitle}>{opt.operator}</Text>
            <Text style={styles.coachSubtitle}>{opt.coachType} • Rating: ⭐ {opt.rating}</Text>

            {/* Time / Duration / Route visual row */}
            <View style={styles.routeRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.clockTime}>{opt.departureTime}</Text>
                <Text style={styles.cityName}>Vizag</Text>
              </View>

              <View style={styles.durationBlock}>
                <Text style={styles.durationText}>{opt.duration}</Text>
                <View style={styles.routeLine} />
                <Text style={styles.transferText}>
                  {opt.type === 'DIRECT' ? 'Non-Stop' : '1 Transfer @ Vijayawada'}
                </Text>
              </View>

              <View style={styles.timeBlock}>
                <Text style={[styles.clockTime, !isFeasible && styles.lateClock]}>{opt.arrivalTime}</Text>
                <Text style={styles.cityName}>Hyderabad</Text>
              </View>
            </View>

            {/* Fare and Action Row */}
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.fareLabel}>{isTe ? 'మొత్తం ఛార్జీ' : 'Total Fare'}</Text>
                <Text style={[styles.fareValue, opt.totalFare > 1500 && styles.overBudgetFare]}>
                  ₹{opt.totalFare}
                </Text>
              </View>

              <View style={styles.selectBtn}>
                <Text style={styles.selectBtnText}>{isTe ? 'వివరాలు చూడు ➔' : 'View Itinerary ➔'}</Text>
              </View>
            </View>

            {/* Detailed Explanation / Violations Box */}
            <View style={styles.reasonBox}>
              <Text style={styles.reasonText}>
                {isFeasible ? opt.recommendationReason : opt.feasibility.violations[0]}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 30 },
  summaryBar: {
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  summaryText: { fontSize: 12, color: '#38BDF8', fontWeight: '600' },
  optionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  recommendedCard: {
    borderColor: '#0284C7',
    borderWidth: 2,
    backgroundColor: '#FAFDFM',
  },
  infeasibleCard: {
    borderColor: '#FF8A8A',
    backgroundColor: '#FFF8F8',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  recBadgeText: { fontSize: 11, fontWeight: '700', color: '#0369A1' },
  scoreText: { fontSize: 12, fontWeight: '700', color: theme.colors.textMuted },
  operatorTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary },
  coachSubtitle: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 12 },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  timeBlock: { alignItems: 'center', flex: 1 },
  clockTime: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary },
  lateClock: { color: theme.colors.error },
  cityName: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  durationBlock: { alignItems: 'center', flex: 1.5 },
  durationText: { fontSize: 11, fontWeight: '600', color: theme.colors.textMuted },
  routeLine: { width: '80%', height: 2, backgroundColor: '#CBD5E1', marginVertical: 4 },
  transferText: { fontSize: 10, color: theme.colors.secondary, fontWeight: '600' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  fareLabel: { fontSize: 10, color: theme.colors.textMuted },
  fareValue: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary },
  overBudgetFare: { color: theme.colors.error },
  selectBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.lg,
  },
  selectBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  reasonBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: theme.radius.md,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reasonText: { fontSize: 11, color: theme.colors.textSecondary, lineHeight: 15 }
});
