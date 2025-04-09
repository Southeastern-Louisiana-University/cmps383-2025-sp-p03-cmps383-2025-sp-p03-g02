import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

// Help topics
const HELP_TOPICS = [
  {
    id: '1',
    title: 'Purchasing Tickets',
    content: 'You can purchase tickets by selecting a movie, theater, and showtime. Payment can be made using a credit card, debit card, or gift card.'
  },
  {
    id: '2',
    title: 'Concessions Ordering',
    content: 'Once seated, you can order food and drinks directly from the app. Our staff will deliver your order directly to your seat.'
  },
  {
    id: '3',
    title: 'Ticket Refunds',
    content: 'Ticket refunds are available up to 2 hours before the showtime. To request a refund, go to your tickets section and select the ticket you want to refund.'
  },
  {
    id: '4',
    title: 'Account Management',
    content: 'You can update your profile information, change your password, and manage your payment methods in the Account section.'
  },
  {
    id: '5',
    title: 'Theater Locations',
    content: 'You can find the nearest Lion\'s Den Cinema by using the Theaters tab. We currently have locations in downtown, uptown, and west side.'
  }
];

export default function HelpCenterScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      {}
      <Stack.Screen options={{ 
        title: "Help Center",
        headerShown: true,
        headerStyle: {
          backgroundColor: '#152F3E',
        },
        headerTintColor: '#E8EEF2',
      }} />
      
      <Text style={styles.pageSubtitle}>Frequently Asked Questions</Text>
      
      <ScrollView style={styles.topicsContainer}>
        {HELP_TOPICS.map((topic) => (
          <View key={topic.id} style={styles.topicCard}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicContent}>{topic.content}</Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Need more help?</Text>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => {
            
            alert('Support contact feature coming soon!');
          }}
        >
          <Text style={styles.buttonText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#152F3E',
  },
  pageSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    color: '#E8EEF2',
  },
  topicsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  topicCard: {
    backgroundColor: '#F0F4F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F3A4D',
  },
  topicContent: {
    fontSize: 14,
    color: '#4A6375',
    lineHeight: 20,
  },
  contactContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 16,
    color: '#E8EEF2',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#0C6184',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});