import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { colors, spacing, typography, shadows, borderRadius } from '../theme/theme';
import Header from '../components/Header';
import InternshipCard, { Internship } from '../components/InternshipCard';
import SearchBar from '../components/SearchBar';
import FilterModal, { Filters } from '../components/FilterModal';

// Mock data for saved internships
const SAVED_INTERNSHIPS: Internship[] = [
  {
    id: '1',
    title: 'Développeur Frontend React',
    company: 'Ministère de l\'Éducation',
    location: 'Rabat',
    duration: '6 mois',
    contractType: 'internship',
    postedDate: 'Il y a 2 jours',
  },
  {
    id: '4',
    title: 'Assistant comptable',
    company: 'Ministère des Finances',
    location: 'Marrakech',
    duration: '4 mois',
    contractType: 'internship',
    postedDate: 'Aujourd\'hui',
  },
  {
    id: '7',
    title: 'Développeur Back-end Java',
    company: 'Direction Générale des Impôts',
    location: 'Casablanca',
    duration: '5 mois',
    contractType: 'internship',
    postedDate: 'Il y a 3 jours',
  },
  {
    id: '9',
    title: 'Designer UX/UI',
    company: 'Agence de Développement Digital',
    location: 'Rabat',
    duration: '6 mois',
    contractType: 'apprenticeship',
    postedDate: 'Il y a 1 semaine',
  },
];

interface SavedInternshipsScreenProps {
  navigation: any;
}

const SavedInternshipsScreen = ({ navigation }: SavedInternshipsScreenProps) => {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    sector: [],
    location: '',
    duration: '',
    contractType: [],
  });
  
  // Animation
  const fadeAnim = new Animated.Value(0);
  
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    
    setTimeout(() => {
      setInternships(SAVED_INTERNSHIPS);
      setFilteredInternships(SAVED_INTERNSHIPS);
      setLoading(false);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, []);
  
  useEffect(() => {
    filterInternships();
  }, [searchQuery, filters, internships]);
  
  const filterInternships = () => {
    let filtered = [...internships];
    
    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (internship) =>
          internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          internship.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(
        (internship) => 
          internship.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Apply contract type filter
    if (filters.contractType.length > 0) {
      filtered = filtered.filter(
        (internship) => 
          filters.contractType.includes(internship.contractType)
      );
    }
    
    // Apply duration filter (simple contains check)
    if (filters.duration) {
      filtered = filtered.filter(
        (internship) => 
          internship.duration.toLowerCase().includes(filters.duration.toLowerCase())
      );
    }
    
    setFilteredInternships(filtered);
  };
  
  const handleInternshipPress = (internship: Internship) => {
    navigation.navigate('InternshipDetail', { internship });
  };
  
  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };
  
  const handleSearch = () => {
    filterInternships();
  };
  
  const handleRemoveSaved = (id: string) => {
    // Remove from saved list
    const updatedInternships = internships.filter(item => item.id !== id);
    setInternships(updatedInternships);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Aucune offre sauvegardée</Text>
      <Text style={styles.emptyText}>
        Vous n'avez pas encore sauvegardé d'offres. Parcourez les offres et ajoutez-les à vos favoris.
      </Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.browseButtonText}>Parcourir les offres</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderInternshipItem = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={styles.internshipItemContainer}>
        <InternshipCard
          internship={item}
          onPress={() => handleInternshipPress(item)}
        />
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveSaved(item.id)}
        >
          <Text style={styles.removeButtonText}>Retirer</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Offres sauvegardées"
        leftIcon={<Text style={styles.headerIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={handleSearch}
            placeholder="Rechercher dans vos offres sauvegardées..."
            filterIcon={<Text>🔍</Text>}
            onFilterPress={() => setFilterModalVisible(true)}
            searchIcon={<Text>🔎</Text>}
            clearIcon={<Text>✕</Text>}
          />
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Chargement de vos offres sauvegardées...</Text>
          </View>
        ) : internships.length === 0 ? (
          renderEmptyState()
        ) : filteredInternships.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              Aucune offre ne correspond à votre recherche.
            </Text>
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setFilters({
                sector: [],
                location: '',
                duration: '',
                contractType: [],
              });
            }}>
              <Text style={styles.resetText}>Réinitialiser les filtres</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredInternships}
            renderItem={renderInternshipItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />
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
  content: {
    flex: 1,
    padding: spacing.m,
  },
  searchSection: {
    marginBottom: spacing.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.m,
    fontSize: typography.fontSizes.m,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.fontSizes.m,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.l,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.m,
    ...shadows.small,
  },
  browseButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.l,
  },
  noResultsText: {
    fontSize: typography.fontSizes.m,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  resetText: {
    fontSize: typography.fontSizes.m,
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
  },
  listContainer: {
    paddingBottom: 80, // For tab bar
  },
  internshipItemContainer: {
    marginBottom: spacing.m,
  },
  removeButton: {
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
    backgroundColor: `${colors.error}CC`,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderRadius: borderRadius.s,
  },
  removeButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semiBold,
  },
});

export default SavedInternshipsScreen; 