import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing
} from 'react-native';

export function LoadingScreen({ message = 'Communicating with backend...' }) {
  const [pulseAnim] = useState(new Animated.Value(1));

  const loadingSubtitles = [
    'Evaluating optimal route graph...',
    'Checking intercity bus & train schedules...',
    'Analyzing transfer safety buffers...',
    'Finding top recommended stays & fares...'
  ];

  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true
        })
      ])
    );
    pulse.start();

    // Rotate subtitle messages
    const timer = setInterval(() => {
      setSubtitleIndex(prev => (prev + 1) % loadingSubtitles.length);
    }, 2200);

    return () => {
      pulse.stop();
      clearInterval(timer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.centerCard}>
        {/* Animated Brand Badge */}
        <Animated.View style={[styles.logoCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.logoEmoji}>🤖</Text>
        </Animated.View>

        {/* Brand Name */}
        <Text style={styles.brandTitle}>RoamAgent AI</Text>
        <Text style={styles.brandBadge}>Async Task Engine Active</Text>

        {/* Main Spinner */}
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#0284C7" />
        </View>

        {/* Primary Message */}
        <Text style={styles.mainMessage}>{message}</Text>

        {/* Dynamic Rotating Subtitle */}
        <View style={styles.subtitleBox}>
          <Text style={styles.subtitleText}>
            {loadingSubtitles[subtitleIndex]}
          </Text>
        </View>

        {/* Footer Reassurance */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>⚡ Powered by RoamAgent Spring Boot API</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centerCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  logoEmoji: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
    marginBottom: 24,
  },
  spinnerContainer: {
    marginVertical: 12,
  },
  mainMessage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitleBox: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    width: '100%',
  },
  subtitleText: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '500',
  },
  footerInfo: {
    marginTop: 24,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
