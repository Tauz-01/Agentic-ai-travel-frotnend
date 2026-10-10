import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

export function TopRecommendedStays({ onBack, onSelectStay, onChangePreferences }) {
  const [selectedSort, setSelectedSort] = useState('Top Rated');

  const stays = [
    {
      id: 'stay-1',
      rank: 1,
      name: 'Hotel Grand Plaza',
      price: '1,200',
      rating: '4.6',
      reviewCount: '1.2k',
      distance: '1.2 km from Hyderabad Bus Station',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      tags: ['Free Wi-Fi', 'AC Rooms', 'Breakfast', '24/7 Front Desk'],
      isTopPick: true,
      highlight: 'Highly rated for cleanliness, service and location',
      highlightIcon: '👍'
    },
    {
      id: 'stay-2',
      rank: 2,
      name: 'Comfort Inn Residency',
      price: '1,050',
      rating: '4.4',
      reviewCount: '856',
      distance: '2.8 km from Hyderabad Bus Station',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      tags: ['Free Wi-Fi', 'AC Rooms', 'Parking', 'Room Service'],
      isTopPick: false,
      highlight: 'Great value for money with excellent reviews',
      highlightIcon: '⭐'
    },
    {
      id: 'stay-3',
      rank: 3,
      name: 'Hotel Sunshine',
      price: '980',
      rating: '4.2',
      reviewCount: '642',
      distance: '3.5 km from Hyderabad Bus Station',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
      tags: ['Free Wi-Fi', 'AC Rooms', 'Breakfast', 'Laundry Service'],
      isTopPick: false,
      highlight: 'Popular choice among travelers',
      highlightIcon: '🏷️'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backArrowText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerBrandCenter}>
          <View style={styles.planeCircleIcon}>
            <Text style={styles.planeEmoji}>✈️</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>RoamAgent</Text>
            <Text style={styles.brandSubtitle}>AI Travel Concierge • Demo mode</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.controlsBtn} onPress={() => Alert.alert('Sort & Filter', 'Filter by price, distance or rating.')}>
          <Text style={styles.controlsIconText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Card */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerTextCol}>
            <View style={styles.bannerIconBadge}>
              <Text style={styles.bannerIconText}>🛏️</Text>
            </View>
            <Text style={styles.bannerTitle}>Top 3 Recommended Stays</Text>
            <Text style={styles.bannerSubtitle}>
              Based on real guest reviews, ratings and proximity to your bus station.
            </Text>
          </View>
          <View style={styles.bannerGraphicBox}>
            <Text style={styles.hotelGraphicEmoji}>🏢📍</Text>
          </View>
        </View>

        {/* Filters / Sort Strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersStrip}>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipIcon}>📍</Text>
            <View>
              <Text style={styles.filterChipTitle}>Near Hyderabad Bus Station</Text>
              <Text style={styles.filterChipSub}>(0.5 – 5 km)</Text>
            </View>
          </View>

          <View style={styles.filterChip}>
            <Text style={styles.filterChipIcon}>📅</Text>
            <View>
              <Text style={styles.filterChipTitle}>Tonight</Text>
              <Text style={styles.filterChipSub}>(1 night)</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.filterChipSort}
            onPress={() => Alert.alert('Sort Options', 'Top Rated | Lowest Price | Nearest')}
          >
            <Text style={styles.filterChipIcon}>🎛️</Text>
            <View>
              <Text style={styles.filterChipTitle}>Sort</Text>
              <Text style={styles.filterChipSub}>{selectedSort} ▾</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Top 3 Stay Cards */}
        <View style={styles.cardsList}>
          {stays.map((item) => (
            <View key={item.id} style={styles.stayCard}>
              <View style={styles.cardHeaderRow}>
                {/* Left Thumbnail Image */}
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: item.image }} style={styles.hotelImage} />
                  
                  {/* Rank Badge */}
                  <View style={[
                    styles.rankBadge,
                    item.rank === 1 ? styles.rank1 : item.rank === 2 ? styles.rank2 : styles.rank3
                  ]}>
                    <Text style={styles.rankBadgeText}>{item.rank}</Text>
                  </View>

                  {/* Top Pick Tag */}
                  {item.isTopPick && (
                    <View style={styles.topPickTag}>
                      <Text style={styles.topPickTagText}>★ Top Pick</Text>
                    </View>
                  )}
                </View>

                {/* Right Details Overview */}
                <View style={styles.hotelInfoCol}>
                  <View style={styles.titlePriceRow}>
                    <Text style={styles.hotelName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceText}>₹{item.price}</Text>
                      <Text style={styles.perNightText}>per night</Text>
                    </View>
                  </View>

                  {/* Rating Badge & Reviews */}
                  <View style={styles.ratingRow}>
                    <View style={styles.ratingBadge}>
                      <Text style={styles.ratingStar}>★</Text>
                      <Text style={styles.ratingVal}>{item.rating}</Text>
                    </View>
                    <Text style={styles.reviewCountText}>({item.reviewCount} reviews)</Text>
                  </View>

                  {/* Location Distance */}
                  <View style={styles.locationRow}>
                    <Text style={styles.locationPinEmoji}>📍</Text>
                    <Text style={styles.distanceText} numberOfLines={1}>{item.distance}</Text>
                  </View>
                </View>
              </View>

              {/* Tags Row */}
              <View style={styles.tagsWrapRow}>
                {item.tags.map((tag, tIdx) => (
                  <View key={tIdx} style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Review Highlight Banner */}
              <View style={styles.highlightBanner}>
                <Text style={styles.highlightText}>
                  {item.highlightIcon} {item.highlight}
                </Text>
              </View>

              {/* Action Button */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.viewDetailsBtn}
                  onPress={() => onSelectStay ? onSelectStay(item) : Alert.alert(item.name, `Selected ${item.name} for ₹${item.price}/night.`)}
                >
                  <Text style={styles.viewDetailsBtnText}>View Details ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Change Preferences Footer Banner */}
        <View style={styles.footerBanner}>
          <View style={styles.footerBannerLeft}>
            <View style={styles.compassIconCircle}>
              <Text style={styles.compassEmoji}>🗺️</Text>
            </View>
            <View style={styles.footerTextWrap}>
              <Text style={styles.footerTitle}>Need a different location or budget?</Text>
              <Text style={styles.footerSub}>Tell me your preferences and I'll find more options for you.</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.changePrefBtn}
            onPress={onChangePreferences || (() => Alert.alert('Preferences', 'Enter custom budget or location.'))}
          >
            <Text style={styles.changePrefBtnText}>Change Preferences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 12,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrowText: {
    fontSize: 28,
    color: '#0F172A',
    fontWeight: '300',
  },
  headerBrandCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planeCircleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planeEmoji: {
    fontSize: 18,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  controlsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsIconText: {
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 16,
  },
  bannerCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  bannerIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerIconText: {
    fontSize: 18,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 16,
  },
  bannerGraphicBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotelGraphicEmoji: {
    fontSize: 28,
  },
  filtersStrip: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    gap: 8,
  },
  filterChipSort: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 8,
  },
  filterChipIcon: {
    fontSize: 14,
  },
  filterChipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  filterChipSub: {
    fontSize: 10,
    color: '#64748B',
  },
  cardsList: {
    gap: 16,
  },
  stayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  hotelImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rankBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rank1: { backgroundColor: '#F59E0B' },
  rank2: { backgroundColor: '#64748B' },
  rank3: { backgroundColor: '#94A3B8' },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  topPickTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  topPickTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  hotelInfoCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingRight: 6,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  perNightText: {
    fontSize: 10,
    color: '#64748B',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingStar: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  ratingVal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  reviewCountText: {
    fontSize: 11,
    color: '#64748B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationPinEmoji: {
    fontSize: 11,
  },
  distanceText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  tagsWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tagPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  highlightBanner: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  actionRow: {
    alignItems: 'flex-end',
  },
  viewDetailsBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewDetailsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  footerBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 12,
  },
  footerBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compassIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassEmoji: {
    fontSize: 20,
  },
  footerTextWrap: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  footerSub: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 2,
  },
  changePrefBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  changePrefBtnText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
});
