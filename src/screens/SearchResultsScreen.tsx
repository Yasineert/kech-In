import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, typography } from '../theme/theme';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import InternshipCard, { Internship } from '../components/InternshipCard';
import FilterModal, { Filters } from '../components/FilterModal';

// Mock data for search results
const ALL_INTERNSHIPS: Internship[] = [
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
    id: '2',
    title: 'Analyste de données éducatives',
    company: 'École Nationale Supérieure',
    location: 'Casablanca',
    duration: '3 mois',
    contractType: 'internship',
    postedDate: 'Il y a 5 jours',
  },
  {
    id: '3',
    title: 'Ingénieur logiciel en alternance',
    company: 'Université Mohammed V',
    location: 'Rabat',
    duration: '12 mois',
    contractType: 'apprenticeship',
    postedDate: 'Il y a 1 semaine',
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
    id: '5',
    title: 'Chargé de communication',
    company: 'Office de la Formation Professionnelle',
    location: 'Tanger',
    duration: '6 mois',
    contractType: 'internship',
    postedDate: 'Hier',
  },
  {
    id: '6',
    title: 'Développeur Mobile React Native',
    company: 'Ministère des Sports',
    location: 'Rabat',
    duration: '6 mois',
    contractType: 'apprenticeship',
    postedDate: 'Il y a 3 jours',
  },
  {
    id: '7',
    title: 'Assistant RH',
    company: 'Direction Régionale de l\'Éducation',
    location: 'Fès',
    duration: '3 mois',
    contractType: 'internship',
    postedDate: 'Il y a 1 jour',
  },
  {
    id: '8',
    title: 'Concepteur pédagogique',
    company: 'Académie Régionale d\'Éducation',
    location: 'Agadir',
    duration: '6 mois',
    contractType: 'internship',
    postedDate: 'Il y a 4 jours',
  },
  {
    id: '9',
    title: 'Développeur Backend Node.js',
    company: 'Laboratoire National du Sport',
    location: 'Rabat',
    duration: '6 mois',
    contractType: 'apprenticeship',
    postedDate: 'Il y a 2 jours',
  },
  {
    id: '10',
    title: 'Responsable logistique sportive',
    company: 'Fédération Royale Marocaine des Sports',
    location: 'Casablanca',
    duration: '12 mois',
    contractType: 'apprenticeship',
    postedDate: 'Il y a 1 semaine',
  },
];

interface SearchResultsScreenProps {
  route: {
    params: {
      searchQuery?: string;
      filters?: Filters;
      featured?: boolean;
      recent?: boolean;
    };
  };
  navigation: any;
}

const SearchResultsScreen = ({ route, navigation }: SearchResultsScreenProps) => {
  const { searchQuery: initialQuery, filters: initialFilters, featured, recent } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [filters, setFilters] = useState<Filters>(initialFilters || {
    sector: [],
    location: '',
    duration: '',
    contractType: [],
  });
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<Internship[]>([]);

  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    
    setTimeout(() => {
      let filteredResults = [...ALL_INTERNSHIPS];
      
      // Apply featured filter
      if (featured) {
        filteredResults = filteredResults.slice(0, 5);
      }
      
      // Apply recent filter
      if (recent) {
        filteredResults = filteredResults.filter(
          (internship) => 
            internship.postedDate.includes('Aujourd\'hui') || 
            internship.postedDate.includes('Hier') || 
            internship.postedDate.includes('1 jour')
        );
      }
      
      // Apply search query
      if (searchQuery) {
        filteredResults = filteredResults.filter(
          (internship) =>
            internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            internship.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply sector filter
      if (filters.sector && filters.sector.length > 0) {
        // Mock sector filtering (in a real app, internships would have sector data)
        if (filters.sector.includes('tech')) {
          filteredResults = filteredResults.filter(
            (internship) => 
              internship.title.toLowerCase().includes('développeur') ||
              internship.title.toLowerCase().includes('ingénieur') ||
              internship.title.toLowerCase().includes('analyste')
          );
        }
        
        if (filters.sector.includes('education')) {
          filteredResults = filteredResults.filter(
            (internship) => 
              internship.company.toLowerCase().includes('éducation') ||
              internship.company.toLowerCase().includes('école') ||
              internship.company.toLowerCase().includes('université')
          );
        }
      }
      
      // Apply location filter
      if (filters.location) {
        filteredResults = filteredResults.filter(
          (internship) =>
            internship.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      // Apply duration filter
      if (filters.duration) {
        filteredResults = filteredResults.filter(
          (internship) =>
            internship.duration.toLowerCase().includes(filters.duration.toLowerCase())
        );
      }
      
      // Apply contract type filter
      if (filters.contractType && filters.contractType.length > 0) {
        filteredResults = filteredResults.filter(
          (internship) => filters.contractType.includes(internship.contractType)
        );
      }
      
      setInternships(filteredResults);
      setLoading(false);
    }, 1000);
  }, [searchQuery, filters, featured, recent]);

  const handleInternshipPress = (internship: Internship) => {
    navigation.navigate('InternshipDetail', { internship });
  };

  const handleSearch = () => {
    // The useEffect will handle the search when searchQuery changes
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const renderItem = ({ item }: { item: Internship }) => (
    <InternshipCard internship={item} onPress={handleInternshipPress} />
  );

  const getScreenTitle = () => {
    if (featured) return 'Stages à la une';
    if (recent) return 'Stages récents';
    return 'Résultats de recherche';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={getScreenTitle()}
        leftIcon={<Text style={styles.backIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Rechercher un stage ou une alternance..."
          filterIcon={<Text>🔍</Text>}
          onFilterPress={() => setFilterModalVisible(true)}
          searchIcon={<Text>🔎</Text>}
          clearIcon={<Text>✕</Text>}
        />
      </View>

      {/* Active Filters */}
      {(filters.sector.length > 0 || 
       filters.location || 
       filters.duration || 
       filters.contractType.length > 0) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersTitle}>Filtres actifs:</Text>
          <View style={styles.filterChips}>
            {filters.sector.length > 0 && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  Secteur: {filters.sector.length} sélectionné(s)
                </Text>
              </View>
            )}
            {filters.location && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  Lieu: {filters.location}
                </Text>
              </View>
            )}
            {filters.duration && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  Durée: {filters.duration}
                </Text>
              </View>
            )}
            {filters.contractType.length > 0 && (
              <View style={styles.filterChip}>
                <Text style={styles.filterChipText}>
                  Contrat: {filters.contractType.length} sélectionné(s)
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement des résultats...</Text>
        </View>
      ) : internships.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Aucun résultat trouvé. Essayez de modifier vos critères de recherche.
          </Text>
        </View>
      ) : (
        <FlatList
          data={internships}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

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
  searchContainer: {
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContainer: {
    padding: spacing.m,
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
  emptyText: {
    fontSize: typography.fontSizes.m,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  backIcon: {
    fontSize: typography.fontSizes.xl,
    color: colors.white,
  },
  activeFiltersContainer: {
    padding: spacing.m,
    backgroundColor: colors.card,
  },
  activeFiltersTitle: {
    fontSize: typography.fontSizes.s,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginRight: spacing.s,
    marginBottom: spacing.xs,
  },
  filterChipText: {
    fontSize: typography.fontSizes.xs,
    color: colors.white,
  },
});

export default SearchResultsScreen; 