import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline, Circle, Marker, Text as SvgText, Rect, Line } from 'react-native-svg';
import { theme } from './theme';

export function InteractiveMapView({ legs = [], highlightedLegIndex = null, isDisrupted = false, simulatedBusLocation = null }) {
  // SVG canvas geometry mapping Visakhapatnam -> Vijayawada -> Hyderabad
  // Vizag: (40, 60), Vijayawada: (170, 150), Vijayawada Bypass: (185, 120), Hyd: (320, 60)
  
  const width = 360;
  const height = 210;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.mapTitle}>Route Geometry & Transit Map</Text>
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeText}>Simulated GPS</Text>
        </View>
      </View>
      
      <View style={styles.svgContainer}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background Map Grid Styling */}
          <Rect width={width} height={height} fill="#0F172A" rx={12} />
          
          {/* Grid lines */}
          <Line x1="0" y1="70" x2={width} y2="70" stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />
          <Line x1="0" y1="140" x2={width} y2="140" stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />
          <Line x1="120" y1="0" x2="120" y2={height} stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />
          <Line x1="240" y1="0" x2="240" y2={height} stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />

          {/* NH-16 Highway Corridor Line (Vizag -> Vijayawada) */}
          <Polyline
            points="40,60 170,150"
            stroke={isDisrupted ? theme.colors.action : theme.colors.secondary}
            strokeWidth={isDisrupted ? "4" : "3"}
            strokeDasharray={isDisrupted ? "6,3" : "none"}
          />

          {/* NH-65 Highway Corridor Line (Vijayawada -> Hyderabad) */}
          <Polyline
            points="170,150 320,60"
            stroke={theme.colors.success}
            strokeWidth="3"
          />

          {/* Alternate Bypass Highway Corridor (Vijayawada Bypass -> Hyd) */}
          <Polyline
            points="170,150 185,120 320,60"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="3,3"
          />

          {/* Node 1: Visakhapatnam RTC */}
          <Circle cx="40" cy="60" r="7" fill={theme.colors.secondary} stroke="#FFFFFF" strokeWidth="2" />
          <SvgText x="15" y="42" fill="#E2E8F0" fontSize="10" fontWeight="bold">Vizag RTC</SvgText>

          {/* Node 2: Vijayawada PNBS */}
          <Circle cx="170" cy="150" r="8" fill={isDisrupted ? theme.colors.action : theme.colors.secondary} stroke="#FFFFFF" strokeWidth="2" />
          <SvgText x="125" y="172" fill={isDisrupted ? "#FF8A8A" : "#E2E8F0"} fontSize="10" fontWeight="bold">Vijayawada PNBS</SvgText>

          {/* Node 2b: Vijayawada Bypass */}
          <Circle cx="185" cy="120" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
          <SvgText x="195" y="124" fill="#38BDF8" fontSize="9">Bypass Point</SvgText>

          {/* Node 3: Hyderabad MGBS */}
          <Circle cx="320" cy="60" r="7" fill={theme.colors.success} stroke="#FFFFFF" strokeWidth="2" />
          <SvgText x="280" y="42" fill="#E2E8F0" fontSize="10" fontWeight="bold">Hyd MGBS</SvgText>

          {/* Active Simulated Vehicle Marker */}
          <Circle 
            cx={simulatedBusLocation ? simulatedBusLocation.x : 125} 
            cy={simulatedBusLocation ? simulatedBusLocation.y : 118} 
            r="10" 
            fill={theme.colors.action} 
            stroke="#FFFFFF" 
            strokeWidth="2" 
          />
          <SvgText 
            x={(simulatedBusLocation ? simulatedBusLocation.x : 125) - 4} 
            y={(simulatedBusLocation ? simulatedBusLocation.y : 118) + 4} 
            fill="#FFFFFF" 
            fontSize="9" 
            fontWeight="bold"
          >
            🚌
          </SvgText>
        </Svg>
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.secondary }]} />
          <Text style={styles.legendText}>Leg 1 (Vizag-VJA)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.success }]} />
          <Text style={styles.legendText}>Leg 2 (VJA-Hyd)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.action }]} />
          <Text style={styles.legendText}>Simulated Bus</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  demoBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  svgContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  }
});
