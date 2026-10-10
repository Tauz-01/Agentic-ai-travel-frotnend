import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { theme } from './src/theme';
import {
  getInitialData,
  sendChatMessage,
  fetchTripSearchResults,
  fetchDisruptionStatus,
  fetchRecoveryOptions,
  approveItineraryChange
} from './src/services/api';
import { parseIntentFromInput } from './src/transportEngine';

// Execution Screens
import { Screen1ConversationalIntake } from './src/Screen1ConversationalIntake';
import { Screen2ReviewDraft } from './src/Screen2ReviewDraft';
import { Screen3Clarification } from './src/Screen3Clarification';
import { Screen4Top4Results } from './src/Screen4Top4Results';
import { Screen5ItineraryDetails } from './src/Screen5ItineraryDetails';
import { Screen6Checkout } from './src/Screen6Checkout';
import { Screen7DisruptionMonitor } from './src/Screen7DisruptionMonitor';
import { Screen8RecoveryApproval } from './src/Screen8RecoveryApproval';
import { TopRecommendedStays } from './src/TopRecommendedStays';
import { LoadingScreen } from './src/LoadingScreen';

export default function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing async backend task...');

  // Authoritative State
  const [tripIntent, setTripIntent] = useState(parseIntentFromInput('', 'en'));
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeItinerary, setActiveItinerary] = useState(null);
  const [disruption, setDisruption] = useState(null);
  const [recoveryProposals, setRecoveryProposals] = useState([]);
  const [activeProposal, setActiveProposal] = useState(null);

  // Load initial system data on app boot
  useEffect(() => {
    async function loadAppConfig() {
      try {
        await getInitialData();
      } catch (err) {
        console.warn('Initial data load warning:', err);
      }
    }
    loadAppConfig();
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'te' : 'en'));
  };

  // Stage 1 -> 2: Extract Trip Intent via API
  const handleExtractTrip = async (inputPrompt) => {
    setLoadingMessage('AI Concierge processing query...');
    setIsLoading(true);
    try {
      const res = await sendChatMessage(inputPrompt, language);
      if (res && res.intent) {
        setTripIntent(res.intent);
      } else {
        const extracted = parseIntentFromInput(inputPrompt, language);
        setTripIntent(extracted);
      }
    } catch (e) {
      const extracted = parseIntentFromInput(inputPrompt, language);
      setTripIntent(extracted);
    } finally {
      setIsLoading(false);
      setCurrentStage(2);
    }
  };

  // Stage 2 -> 4: Confirm Draft & Search Routes via API
  const handleConfirmDraftAndSearch = async () => {
    setLoadingMessage('Searching route options across operators...');
    setIsLoading(true);
    try {
      const res = await fetchTripSearchResults(tripIntent);
      setSearchResults(res.results || []);
    } catch (e) {
      console.warn('Error fetching route search results:', e);
    } finally {
      setIsLoading(false);
      setCurrentStage(4);
    }
  };

  // Stage 2 -> 3: Go to Clarification Gate
  const handleGoToClarification = () => {
    setCurrentStage(3);
  };

  // Stage 3 -> 4: Save Clarification & Search via API
  const handleSaveClarification = async (updatedIntent) => {
    setTripIntent(updatedIntent);
    setLoadingMessage('Applying constraints & calculating fares...');
    setIsLoading(true);
    try {
      const res = await fetchTripSearchResults(updatedIntent);
      setSearchResults(res.results || []);
    } catch (e) {
      console.warn('Error searching routes:', e);
    } finally {
      setIsLoading(false);
      setCurrentStage(4);
    }
  };

  // Stage 4 -> 5: Select Option
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setCurrentStage(5);
  };

  // Stage 5 -> 6: Proceed to Checkout
  const handleProceedToCheckout = () => {
    setCurrentStage(6);
  };

  // Stage 6 -> 7: Confirm Payment & Activate Journey
  const handleConfirmJourney = () => {
    setActiveItinerary(selectedOption);
    setCurrentStage(7);
  };

  // Stage 7: Trigger Predefined Delay Scenario via API
  const handleTriggerDelay = async () => {
    setLoadingMessage('Analyzing disruption corridor & ETA impact...');
    setIsLoading(true);
    try {
      const res = await fetchDisruptionStatus(activeItinerary || selectedOption, 50);
      setDisruption(res.disruption);
    } catch (e) {
      console.warn('Error fetching disruption status:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 7 -> 8: Start Recovery Search via API
  const handleStartRecovery = async () => {
    setLoadingMessage('Generating alternative recovery proposals...');
    setIsLoading(true);
    try {
      const res = await fetchRecoveryOptions(activeItinerary || selectedOption, disruption, tripIntent);
      const proposals = res.proposals || [];
      setRecoveryProposals(proposals);
      setActiveProposal(proposals[0]);
    } catch (e) {
      console.warn('Error fetching recovery options:', e);
    } finally {
      setIsLoading(false);
      setCurrentStage(8);
    }
  };

  // Stage 8 -> 7: Approve Recovery Proposal via API
  const handleApproveProposal = async () => {
    setLoadingMessage('Committing itinerary revision to backend...');
    setIsLoading(true);
    try {
      await approveItineraryChange(activeProposal?.proposalId, activeItinerary?.id);
    } catch (e) {
      console.warn('Error approving proposal:', e);
    } finally {
      setIsLoading(false);
    }

    // Commit Itinerary Revision #2
    const currentItin = activeItinerary || selectedOption;
    const updatedLegs = [currentItin.legs[0], activeProposal.replacementLeg];
    const revisedItinerary = {
      ...currentItin,
      revision: 2,
      legs: updatedLegs,
      totalFare: activeProposal.newTotalFare,
      arrivalTime: activeProposal.newEta,
      transfers: [
        {
          stop: { name: 'Vijayawada Bypass' },
          bufferMinutes: 45,
          requiredBuffer: 45,
          isSafe: true
        }
      ]
    };
    setActiveItinerary(revisedItinerary);
    setDisruption(null); // Resolved!
    setCurrentStage(7);
  };

  // Stage 8 -> 7: Reject Recovery Proposal
  const handleRejectProposal = () => {
    alert(language === 'te' ? 'ప్రతిపాదన తిరస్కరించబడింది. పాత మార్గం నిలిచి ఉంది.' : 'Proposal rejected. Original itinerary retained with disruption alert.');
    setCurrentStage(7);
  };

  const stageLabels = [
    { stage: 1, label: 'Stage 1 (Chat)' },
    { stage: 2, label: 'Stage 2 (Review)' },
    { stage: 3, label: 'Stage 3 (Clarify)' },
    { stage: 4, label: 'Stage 4 (Routes)' },
    { stage: 5, label: 'Stage 5 (Details)' },
    { stage: 6, label: 'Stage 6 (Checkout)' },
    { stage: 7, label: 'Stage 7 (Monitor)' },
    { stage: 8, label: 'Stage 8 (Approval)' },
    { stage: 9, label: 'Top 3 Stays' },
  ];

  // Render Full Screen Loading Page when async tasks are processing
  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Stage Navigation Stepper Bar */}
      <View style={styles.stepperBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stepperScroll}>
          {stageLabels.map((item) => (
            <TouchableOpacity
              key={item.stage}
              style={[
                styles.stepChip,
                currentStage === item.stage && styles.stepChipActive,
                currentStage > item.stage && currentStage !== 9 && styles.stepChipCompleted,
                item.stage === 9 && styles.stepChipSpecial
              ]}
              onPress={() => setCurrentStage(item.stage)}
            >
              <Text style={[
                styles.stepChipText,
                currentStage === item.stage && styles.stepChipTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Viewport Router */}
      <View style={styles.container}>
        {currentStage === 1 && (
          <Screen1ConversationalIntake
            onExtractTrip={handleExtractTrip}
            onOpenStays={() => setCurrentStage(9)}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 2 && (
          <Screen2ReviewDraft
            intent={tripIntent}
            onProceedToClarification={handleGoToClarification}
            onConfirmAndSearch={handleConfirmDraftAndSearch}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 3 && (
          <Screen3Clarification
            intent={tripIntent}
            onSaveAndSearch={handleSaveClarification}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 4 && (
          <Screen4Top4Results
            options={searchResults}
            onSelectOption={handleSelectOption}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 5 && selectedOption && (
          <Screen5ItineraryDetails
            option={selectedOption}
            onProceedToCheckout={handleProceedToCheckout}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 6 && selectedOption && (
          <Screen6Checkout
            option={selectedOption}
            onConfirmJourney={handleConfirmJourney}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 7 && (
          <Screen7DisruptionMonitor
            option={activeItinerary || selectedOption}
            disruption={disruption}
            TriggerDelay={handleTriggerDelay}
            onStartRecovery={handleStartRecovery}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 8 && activeProposal && (
          <Screen8RecoveryApproval
            activeItinerary={activeItinerary || selectedOption}
            proposal={activeProposal}
            onApprove={handleApproveProposal}
            onReject={handleRejectProposal}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 9 && (
          <TopRecommendedStays
            onBack={() => setCurrentStage(1)}
            onSelectStay={(stay) => alert(`Selected ${stay.name} (₹${stay.price}/night).`)}
            onChangePreferences={() => setCurrentStage(1)}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, backgroundColor: theme.colors.background },
  stepperBar: {
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  stepperScroll: { paddingHorizontal: 12, gap: 6 },
  stepChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepChipActive: { backgroundColor: '#0284C7', borderColor: '#38BDF8' },
  stepChipCompleted: { backgroundColor: '#064E3B', borderColor: '#059669' },
  stepChipSpecial: { backgroundColor: '#1E3A8A', borderColor: '#3B82F6' },
  stepChipText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  stepChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
});
