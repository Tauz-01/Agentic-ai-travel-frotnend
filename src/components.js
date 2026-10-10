import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from './theme';

export function DemoHeader({ title, subtitle, language, onToggleLanguage }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.brandTitle}>RoamAgent AI</Text>
          <View style={styles.demoPill}>
            <Text style={styles.demoPillText}>Demo · Simulated travel data</Text>
          </View>
        </View>
        <Text style={styles.langBadge} onPress={onToggleLanguage}>
          {language === 'te' ? 'తెలుగు (TE)' : 'English (EN)'}
        </Text>
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

export function StatusPill({ type, label }) {
  let bg = theme.colors.surfaceSubtle;
  let text = theme.colors.textSecondary;
  let border = theme.colors.outline;
  let dotColor = null;

  if (type === 'SUCCESS' || type === 'ON_TIME' || type === 'CONFIRMED') {
    bg = theme.colors.successContainer;
    text = theme.colors.onSuccessContainer;
    border = '#86EFAC';
    dotColor = theme.colors.success;
  } else if (type === 'WARNING' || type === 'DELAYED' || type === 'AT_RISK') {
    bg = theme.colors.actionContainer;
    text = theme.colors.onActionContainer;
    border = '#FED7AA';
    dotColor = theme.colors.action;
  } else if (type === 'INFO' || type === 'DIRECT') {
    bg = theme.colors.secondaryContainer;
    text = theme.colors.onSecondaryContainer;
    border = '#BAE6FD';
  } else if (type === 'VIOLATION') {
    bg = theme.colors.errorContainer;
    text = theme.colors.onErrorContainer;
    border = '#FF8A8A';
  }

  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: border }]}>
      {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
      <Text style={[styles.pillText, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  demoPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  demoPillText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '500',
  },
  langBadge: {
    color: '#38BDF8',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    fontSize: 12,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    gap: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  }
});
