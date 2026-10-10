import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { theme } from './theme';
import { sendChatMessage } from './services/api';

export function Screen1ConversationalIntake({ onExtractTrip, onOpenStays, language, onToggleLanguage }) {
  const isTe = language === 'te';
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const scrollViewRef = useRef(null);

  const handleSend = async (customPrompt) => {
    const promptToSend = customPrompt || inputText;
    if (!promptToSend.trim()) return;

    setErrorMsg(null);
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      // Call Spring Boot backend API service
      const response = await sendChatMessage(promptToSend, language);
      setIsLoading(false);

      if (response && response.status === 'SUCCESS') {
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: response.message,
          intent: response.intent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(response?.message || 'Failed to process request');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(isTe ? 'అభ్యర్థన పంపడంలో విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.' : 'Failed to connect to assistant. Please try again.');
    }
  };

  const handleMicPress = () => {
    Alert.alert(
      isTe ? 'వాయిస్ ఇన్పుట్' : 'Voice Input',
      isTe
        ? 'వాయిస్ రికార్డింగ్ సక్రియం చేయబడింది: "విశాఖపట్నం నుండి హైదరాబాద్ రేపు ఉదయం 9 గంటల లోపు"'
        : 'Microphone active: Speaking travel destination and arrival deadline.',
      [
        {
          text: isTe ? 'వచనంగా మార్చు' : 'Use Speech Result',
          onPress: () => {
            const speechText = isTe
              ? 'రేపు ఉదయం 9 గంటలలోపు విశాఖపట్నం నుంచి హైదరాబాద్ చేరాలి. నా బడ్జెట్ ₹1,500. ఏసీ స్లీపర్ బస్సు కావాలి.'
              : 'I need to travel from Vizag to Hyderabad tomorrow. I must reach before 9 AM. My budget is ₹1,500, and I prefer an AC sleeper.';
            setInputText(speechText);
            handleSend(speechText);
          }
        },
        { text: isTe ? 'రద్దు చేయి' : 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Light-Theme Header Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>RoamAgent</Text>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onToggleLanguage}
          accessibilityLabel="Controls and Language"
        >
          <Text style={styles.controlIconText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Main Conversation or Landing State */}
      {messages.length === 0 ? (
        /* Empty / Landing Page State */
        <View style={styles.landingCenterContainer}>
          <Text style={styles.landingTitle}>
            {isTe ? 'ఈరోజు ఎక్కడికి వెళ్లాలి?' : 'Where to today?'}
          </Text>
          <Text style={styles.landingSubtitle}>
            {isTe ? 'మీరు ఎక్కడికి వెళ్లాలని ప్లాన్ చేస్తున్నారు?' : 'Where are you planning to go?'}
          </Text>

          {/* Quick Stays / Restaurants Recommendation Badge */}
          {onOpenStays && (
            <TouchableOpacity style={styles.topStaysCardBadge} onPress={onOpenStays}>
              <View style={styles.topStaysBadgeLeft}>
                <Text style={styles.topStaysBadgeEmoji}>🛏️</Text>
                <View>
                  <Text style={styles.topStaysBadgeTitle}>Top 3 Recommended Stays</Text>
                  <Text style={styles.topStaysBadgeSub}>Based on real guest reviews & proximity</Text>
                </View>
              </View>
              <Text style={styles.topStaysBadgeArrow}>›</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        /* Message Stream */
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.messagesList}>
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.msgWrapper,
                  msg.sender === 'user' ? styles.userMsgWrapper : styles.assistantMsgWrapper
                ]}
              >
                {msg.sender === 'assistant' && (
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>🤖</Text>
                  </View>
                )}

                <View
                  style={[
                    styles.msgBubble,
                    msg.sender === 'user' ? styles.userBubble : styles.assistantBubble
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      msg.sender === 'user' ? styles.userMsgText : styles.assistantMsgText
                    ]}
                  >
                    {msg.text}
                  </Text>

                  {/* Extracted Travel Intent Card */}
                  {msg.sender === 'assistant' && msg.intent && (
                    <View style={styles.intentCardContainer}>
                      <View style={styles.intentSummaryRow}>
                        <Text style={styles.intentLabel}>
                          📍 {msg.intent.origin} ➔ {msg.intent.destination}
                        </Text>
                        <Text style={styles.intentSub}>
                          🕒 Before {msg.intent.arrivalDeadline} AM • Max ₹{msg.intent.maxBudgetINR}
                        </Text>
                      </View>

                      <View style={styles.intentActionsRow}>
                        <TouchableOpacity
                          style={styles.reviewTripBtn}
                          onPress={() => onExtractTrip(msg.intent.rawInput || msg.text)}
                        >
                          <Text style={styles.reviewTripBtnText}>
                            {isTe ? 'ప్రయాణ వివరాలు సమీక్షించు ➔' : 'Review & Search Routes ➔'}
                          </Text>
                        </TouchableOpacity>

                        {onOpenStays && (
                          <TouchableOpacity
                            style={styles.staysBtnSecondary}
                            onPress={onOpenStays}
                          >
                            <Text style={styles.staysBtnSecondaryText}>🛏️ Top Stays</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  )}

                  <Text style={styles.msgTime}>{msg.timestamp}</Text>
                </View>
              </View>
            ))}

            {isLoading && (
              <View style={styles.loadingWrapper}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>🤖</Text>
                </View>
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color="#0F172A" />
                  <Text style={styles.loadingText}>
                    {isTe ? 'సమాధానం ప్లాన్ చేస్తోంది...' : 'Searching travel options...'}
                  </Text>
                </View>
              </View>
            )}

            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => handleSend(messages[messages.length - 1]?.text)}
                >
                  <Text style={styles.retryBtnText}>{isTe ? 'మళ్ళీ ప్రయత్నించు' : 'Retry'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Bottom Message Composer */}
      <View style={styles.composerContainer}>
        <View style={styles.inputCardPill}>
          <TextInput
            style={styles.input}
            multiline
            placeholder={isTe ? 'మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారో చెప్పండి...' : 'Tell me where you want to go...'}
            placeholderTextColor="#64748B"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
          />

          <View style={styles.actionButtonsRow}>
            {inputText.trim().length > 0 && (
              <TouchableOpacity
                style={styles.sendButtonDark}
                onPress={() => handleSend()}
              >
                <Text style={styles.sendButtonText}>➔</Text>
              </TouchableOpacity>
            )}

            {/* Orange Microphone Button */}
            <TouchableOpacity
              style={styles.micButtonOrange}
              onPress={handleMicPress}
              accessibilityLabel="Voice microphone input"
            >
              <Text style={styles.micIconText}>🎙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Plan smarter. Travel with confidence.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Pure clean light-theme canvas
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  controlIconText: {
    fontSize: 18,
  },
  landingCenterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  landingSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  topStaysCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    maxWidth: 340,
  },
  topStaysBadgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  topStaysBadgeEmoji: {
    fontSize: 22,
  },
  topStaysBadgeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  topStaysBadgeSub: {
    fontSize: 11,
    color: '#3B82F6',
  },
  topStaysBadgeArrow: {
    fontSize: 20,
    color: '#2563EB',
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
  },
  messagesList: {
    gap: 16,
  },
  msgWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 4,
  },
  userMsgWrapper: {
    justifyContent: 'flex-end',
  },
  assistantMsgWrapper: {
    justifyContent: 'flex-start',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 16,
  },
  msgBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    padding: 14,
  },
  userBubble: {
    backgroundColor: '#0F172A',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMsgText: {
    color: '#FFFFFF',
  },
  assistantMsgText: {
    color: '#0F172A',
  },
  intentCardContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  intentSummaryRow: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  intentLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  intentSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  intentActionsRow: {
    gap: 8,
  },
  reviewTripBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewTripBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  staysBtnSecondary: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  staysBtnSecondaryText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  msgTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'right',
  },
  loadingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#991B1B',
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  composerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#F8FAFC',
  },
  inputCardPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 6,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    maxHeight: 100,
    paddingRight: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendButtonDark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  micButtonOrange: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EA580C', // Vibrant orange contrast matching reference
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIconText: {
    fontSize: 18,
  },
  tagline: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
});
