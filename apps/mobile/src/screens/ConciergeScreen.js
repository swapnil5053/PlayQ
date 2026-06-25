import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../theme';
import { api } from '../services/api';

export default function ConciergeScreen() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: '1', role: 'model', text: 'Hello! I am your Virtual Concierge. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now().toString(), role: 'user', text: inputText.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      const history = newMessages.map(msg => ({ role: msg.role, text: msg.text }));
      const response = await api.post('/concierge/chat', { 
        message: userMessage.text,
        history: history.slice(0, -1) // Send all but the very last message as history
      });

      const botMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response.text };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      
      // Fallback local logic if backend is unavailable
      const msg = userMessage.text.toLowerCase();
      let responseText = "I'm your Virtual Concierge! I'm here to help you navigate the arcade. Try asking me about our current games or wait times!";
      
      if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
        responseText = "Hey there! Ready to hit the arcade? I can help you find games or check queue times.";
      } else if (msg.includes("game") || msg.includes("play")) {
        responseText = "We have some awesome games today! Neon Racer and Zombie Blast are super popular right now. Have you tried them?";
      } else if (msg.includes("wait") || msg.includes("queue") || msg.includes("time")) {
        responseText = "Wait times are pretty chill right now! Pixel Punch has absolutely no wait, while Zombie Blast is about 15 minutes. Want me to add you to a queue?";
      } else if (msg.includes("yes") || msg.includes("sure")) {
        responseText = "Awesome! Just head over to the Discovery tab and tap on a game to join its queue.";
      } else if (msg.includes("map") || msg.includes("where")) {
        responseText = "You can find all games on the Map screen! Neon Racer is in Zone A, and Zombie Blast is down in Zone C.";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText }]);
      }, 800);
      
    } finally {
      setTimeout(() => setLoading(false), 800); // Simulate network delay
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, loading]);

  const renderMessage = ({ item }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={COLORS.whiteTextPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Virtual Concierge</Text>
          <Text style={styles.headerSubtitle}>Always here to help</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primaryPurple} />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={COLORS.greyTextSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && { opacity: 0.5 }]} 
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
            activeOpacity={0.7}
          >
            <Feather name="send" size={20} color={COLORS.whiteTextPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
    backgroundColor: COLORS.cardBackground,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.whiteTextPrimary,
  },
  headerSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: COLORS.primaryPurple,
    marginTop: 2,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messageList: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.cards,
    marginBottom: SPACING.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primaryPurple,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.whiteTextPrimary,
  },
  botText: {
    color: COLORS.whiteTextPrimary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  loadingText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    color: COLORS.greyTextSecondary,
    marginLeft: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.backgroundBase,
    color: COLORS.whiteTextPrimary,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    borderRadius: 20,
    paddingHorizontal: SPACING.lg,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryPurple,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
