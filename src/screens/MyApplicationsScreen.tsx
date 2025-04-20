import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { colors, spacing, typography, shadows, borderRadius } from '../theme/theme';
import Header from '../components/Header';
import InternshipCard, { Internship } from '../components/InternshipCard';

// Application status types
type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

// Application item type
interface Application extends Internship {
  status: ApplicationStatus;
  applicationDate: string;
  interviewDate?: string;
  feedback?: string;
}

// Mock data for user applications
const USER_APPLICATIONS: Application[] = [
  {
    id: '1',
    title: 'Développeur Frontend React',
    company: 'Ministère de l\'Éducation',
    location: 'Rabat',
    duration: '6 mois',
    contractType: 'internship',
    postedDate: 'Il y a 2 jours',
    status: 'pending',
    applicationDate: '12/06/2023',
  },
  {
    id: '5',
    title: 'Chargé de communication',
    company: 'Office de la Formation Professionnelle',
    location: 'Tanger',
    duration: '6 mois',
    contractType: 'internship',
    postedDate: 'Hier',
    status: 'accepted',
    applicationDate: '08/06/2023',
    interviewDate: '20/06/2023',
    feedback: 'Profil correspondant parfaitement à nos besoins.',
  },
  {
    id: '3',
    title: 'Ingénieur logiciel en alternance',
    company: 'Université Mohammed V',
    location: 'Rabat',
    duration: '12 mois',
    contractType: 'apprenticeship',
    postedDate: 'Il y a 1 semaine',
    status: 'rejected',
    applicationDate: '01/06/2023',
    feedback: 'Nous recherchons un profil avec plus d\'expérience.',
  },
];

interface MyApplicationsScreenProps {
  navigation: any;
}

const MyApplicationsScreen = ({ navigation }: MyApplicationsScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | ApplicationStatus>('all');

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    
    setTimeout(() => {
      setApplications(USER_APPLICATIONS);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter applications based on active tab
  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  // Navigation to internship details
  const handleInternshipPress = (internship: Internship) => {
    navigation.navigate('InternshipDetail', { internship });
  };

  // Status UI helpers
  const getStatusInfo = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'En attente',
          color: colors.warning,
          icon: '⏳',
        };
      case 'accepted':
        return {
          label: 'Acceptée',
          color: colors.success,
          icon: '✅',
        };
      case 'rejected':
        return {
          label: 'Refusée',
          color: colors.error,
          icon: '❌',
        };
      default:
        return {
          label: 'Inconnu',
          color: colors.muted,
          icon: '❓',
        };
    }
  };

  // Tab button component
  const TabButton = ({ tab, label }: { tab: 'all' | ApplicationStatus, label: string }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tab && styles.activeTabButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={{ uri: 'https://img.icons8.com/cotton/256/000000/filing-cabinet.png' }}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>
        Aucune candidature
      </Text>
      <Text style={styles.emptyText}>
        {activeTab !== 'all' 
          ? `Vous n'avez pas de candidature ${getStatusInfo(activeTab as ApplicationStatus).label.toLowerCase()}`
          : 'Commencez à postuler aux offres de stage pour voir vos candidatures ici'}
      </Text>
      {activeTab !== 'all' && (
        <TouchableOpacity 
          onPress={() => setActiveTab('all')}
          style={styles.viewAllButton}
        >
          <Text style={styles.viewAllText}>Voir toutes les candidatures</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Loading component
  const LoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Chargement de vos candidatures...</Text>
    </View>
  );

  // Application details component
  const ApplicationDetails = ({ item }: { item: Application }) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <View style={styles.applicationDetailsCard}>
        <View style={styles.applicationHeader}>
          <Text style={styles.applicationDate}>Candidature du {item.applicationDate}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
            <Text style={styles.statusText}>{statusInfo.label}</Text>
          </View>
        </View>
        
        {item.status === 'accepted' && item.interviewDate && (
          <View style={styles.interviewInfo}>
            <Text style={styles.interviewLabel}>Entretien prévu:</Text>
            <Text style={styles.interviewDate}>{item.interviewDate}</Text>
          </View>
        )}
        
        {item.feedback && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackLabel}>Retour:</Text>
            <Text style={styles.feedbackText}>{item.feedback}</Text>
          </View>
        )}
      </View>
    );
  };

  // Application item component
  const ApplicationItem = ({ item }: { item: Application }) => {
    return (
      <View style={styles.applicationItem}>
        <InternshipCard
          internship={item}
          onPress={() => handleInternshipPress(item)}
        />
        <ApplicationDetails item={item} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Mes candidatures"
        leftIcon={<Text style={styles.headerIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.tabContainer}>
        <TabButton tab="all" label="Toutes" />
        <TabButton tab="pending" label="En attente" />
        <TabButton tab="accepted" label="Acceptées" />
        <TabButton tab="rejected" label="Refusées" />
      </View>

      {loading ? (
        <LoadingState />
      ) : filteredApplications.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredApplications}
          renderItem={({ item }) => <ApplicationItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerIcon: {
    fontSize: typography.fontSizes.xl,
    color: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.s,
    borderRadius: borderRadius.m,
    marginHorizontal: spacing.m,
    ...shadows.small,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.s,
    alignItems: 'center',
    borderRadius: borderRadius.s,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabButtonText: {
    fontSize: typography.fontSizes.s,
    color: colors.muted,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: colors.white,
  },
  listContainer: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.xl,
  },
  applicationItem: {
    marginBottom: spacing.m,
  },
  applicationDetailsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginTop: spacing.xs,
    ...shadows.small,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  applicationDate: {
    fontSize: typography.fontSizes.s,
    color: colors.textLight,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: borderRadius.s,
  },
  statusIcon: {
    fontSize: typography.fontSizes.s,
    marginRight: 4,
  },
  statusText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: 'bold',
  },
  interviewInfo: {
    flexDirection: 'row',
    marginTop: spacing.s,
    marginBottom: spacing.s,
    padding: spacing.s,
    backgroundColor: colors.lightBackground,
    borderRadius: borderRadius.s,
  },
  interviewLabel: {
    fontSize: typography.fontSizes.s,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: spacing.xs,
  },
  interviewDate: {
    fontSize: typography.fontSizes.s,
    color: colors.primary,
    fontWeight: 'bold',
  },
  feedbackContainer: {
    marginTop: spacing.s,
    padding: spacing.s,
    backgroundColor: colors.lightBackground,
    borderRadius: borderRadius.s,
  },
  feedbackLabel: {
    fontSize: typography.fontSizes.s,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  feedbackText: {
    fontSize: typography.fontSizes.s,
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.m,
    fontSize: typography.fontSizes.m,
    color: colors.text,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: spacing.l,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.s,
  },
  emptyText: {
    fontSize: typography.fontSizes.m,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  viewAllButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: borderRadius.m,
    backgroundColor: colors.primary,
  },
  viewAllText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  separator: {
    height: spacing.m,
  },
});

export default MyApplicationsScreen; 