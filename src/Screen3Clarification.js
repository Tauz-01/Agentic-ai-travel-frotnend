import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { theme } from './theme';
import { DemoHeader } from './components';

export function Screen3Clarification({ intent, onSaveAndSearch, language, onToggleLanguage }) {
  const isTe = language === 'te';

  const [budget, setBudget] = useState(intent.maxBudgetINR ? String(intent.maxBudgetINR) : '1500');
  const [deadline, setDeadline] = useState(intent.arrivalDeadline || '09:00');
  const [transferBuffer, setTransferBuffer] = useState(String(intent.minimumTransferMinutes || 45));
  const [coachType, setCoachType] = useState(intent.coachPreference || 'AC sleeper');

  const handleSave = () => {
    const updated = {
      ...intent,
      maxBudgetINR: parseInt(budget) || 1500,
      arrivalDeadline: deadline,
      minimumTransferMinutes: parseInt(transferBuffer) || 45,
      coachPreference: coachType
    };
    onSaveAndSearch(updated);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DemoHeader
        title={isTe ? '3. క్లారిఫికేషన్ ఏజెంట్' : '3. Clarification Agent Gate'}
        subtitle={isTe ? 'అవసరమైన వివరాలు సరిచూడడం' : 'Ensure all mandatory constraints are resolved before search'}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      <View style={styles.alertCard}>
        <Text style={styles.alertTitle}>💡 {isTe ? 'శోధన నియమ నిబంధనలు' : 'Mandatory Field Gate Requirement'}</Text>
        <Text style={styles.alertText}>
          {isTe
            ? 'ఆర్కిటెక్చర్ ప్రకారం: అవసరమైన వివరాలు భర్తీ చేయకుండా సిస్టమ్ బస్సుల శోధన ప్రారంభించదు.'
            : 'Per Architectural Goal Stage 2: The system strictly avoids executing route graph searches until missing fields are confirmed.'}
        </Text>
      </View>

      <View style={styles.formCard}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{isTe ? 'గరిష్ట బడ్జెట్ (₹ INR):' : 'Max Budget (₹ INR):'}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{isTe ? 'గమ్యం చేరుకోవాల్సిన సమయం:' : 'Arrival Deadline:'}</Text>
          <TextInput
            style={styles.input}
            value={deadline}
            onChangeText={setDeadline}
            placeholder="09:00"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{isTe ? 'కనీస మార్పిడి సమయం (నిమిషాలు):' : 'Min Transfer Buffer (Minutes):'}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={transferBuffer}
            onChangeText={setTransferBuffer}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>{isTe ? 'కోచ్ రకం:' : 'Coach Type Preference:'}</Text>
          <View style={styles.optionRow}>
            {['AC sleeper', 'AC Semi-Sleeper', 'Non-AC'].map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, coachType === opt && styles.activeChip]}
                onPress={() => setCoachType(opt)}
              >
                <Text style={[styles.chipText, coachType === opt && styles.activeChipText]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{isTe ? 'వివరాలు సేవ్ చేసి శోధించు ➔' : 'Confirm Requirements & Search ➔'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 30 },
  alertCard: {
    backgroundColor: '#FFF7ED',
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  alertTitle: { fontSize: 13, fontWeight: '700', color: '#C2410C', marginBottom: 4 },
  alertText: { fontSize: 12, color: '#EA580C', lineHeight: 18 },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: 16,
  },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  optionRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F1F5F9',
  },
  activeChip: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary },
  activeChipText: { color: '#FFFFFF' },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' }
});
