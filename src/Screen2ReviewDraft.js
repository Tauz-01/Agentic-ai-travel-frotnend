import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from './theme';
import { DemoHeader, StatusPill } from './components';

export function Screen2ReviewDraft({ intent, onProceedToClarification, onConfirmAndSearch, language, onToggleLanguage }) {
  const isTe = language === 'te';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DemoHeader
        title={isTe ? '2. ప్రయాణ వివరాల సమీక్ష' : '2. Review Extracted Trip Intent'}
        subtitle={isTe ? 'AI వర్గీకరించిన డేటాను సరిచూడండి' : 'AI Concierge Structured Parameter Validation'}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>✨ {isTe ? 'AI అన్వయించిన వివరాలు' : 'AI Extracted Trip Summary'}</Text>
        <Text style={styles.bannerText}>
          {isTe 
            ? 'ప్రతి ఫీల్డ్‌ని రౌట్ సెర్చ్‌కి పంపే ముందు ధృవీకరించండి. ఏవైనా మార్పులు ఉంటే సవరించవచ్చు.'
            : 'Extracted directly from natural conversational text. Validated by backend schema.'}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'ప్రారంభ స్థానం:' : 'Origin:'}</Text>
          <Text style={styles.value}>{intent.origin || 'Not set'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'గమ్యస్థానం:' : 'Destination:'}</Text>
          <Text style={styles.value}>{intent.destination || 'Not set'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'ప్రయాణ తేదీ:' : 'Travel Date:'}</Text>
          <Text style={styles.value}>{intent.travelDate}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'చేరుకోవాల్సిన గడువు:' : 'Arrival Deadline:'}</Text>
          <Text style={styles.valueHighlight}>Before {intent.arrivalDeadline} AM</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'గరిష్ట బడ్జెట్:' : 'Max Budget:'}</Text>
          <Text style={styles.value}>₹{intent.maxBudgetINR || '---'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'కోచ్ ప్రాధాన్యత:' : 'Coach Preference:'}</Text>
          <Text style={styles.value}>{intent.coachPreference}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>{isTe ? 'కనీస మార్పిడి సమయం:' : 'Min Transfer Buffer:'}</Text>
          <Text style={styles.value}>{intent.minimumTransferMinutes} Minutes</Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.label}>{isTe ? 'స్థితి:' : 'Validation Status:'}</Text>
          <StatusPill type="CONFIRMED" label={isTe ? 'సిద్ధంగా ఉంది (VALIDATED)' : 'READY FOR SEARCH'} />
        </View>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.editBtn} onPress={onProceedToClarification}>
          <Text style={styles.editBtnText}>{isTe ? '⚙️ క్లారిఫికేషన్' : '⚙️ Clarifications'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchBtn} onPress={onConfirmAndSearch}>
          <Text style={styles.searchBtnText}>{isTe ? 'బస్సుల శోధన ➔' : 'Search Routes ➔'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 30 },
  banner: {
    backgroundColor: '#E0F2FE',
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: '#0369A1', marginBottom: 4 },
  bannerText: { fontSize: 12, color: '#0284C7', lineHeight: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '500' },
  value: { fontSize: 13, color: theme.colors.textPrimary, fontWeight: '700' },
  valueHighlight: { fontSize: 13, color: theme.colors.action, fontWeight: '700' },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    margin: theme.spacing.md,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: theme.radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  editBtnText: { fontSize: 13, fontWeight: '700', color: theme.colors.primary },
  searchBtn: {
    flex: 1.5,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' }
});
