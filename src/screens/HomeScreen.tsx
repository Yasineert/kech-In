import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import InternshipCard, { Internship } from '../components/InternshipCard';
import FilterModal, { Filters } from '../components/FilterModal';

// Mock data for featured internships
const FEATURED_INTERNSHIPS: Internship[] = [
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
];

// Mock data for recent internships
const RECENT_INTERNSHIPS: Internship[] = [
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
];

// Categories for quick search
const CATEGORIES = [
  { id: 'tech', name: 'Technologie', icon: '💻', count: 47 },
  { id: 'education', name: 'Éducation', icon: '📚', count: 32 },
  { id: 'admin', name: 'Administration', icon: '📋', count: 25 },
  { id: 'sport', name: 'Sport', icon: '🏆', count: 14 },
  { id: 'media', name: 'Médias', icon: '📱', count: 21 },
];

// Stats data
const STATS = [
  { id: 'internships', title: 'Stages', value: '250+' },
  { id: 'companies', title: 'Entreprises', value: '75+' },
  { id: 'students', title: 'Étudiants', value: '1,200+' },
];

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = 220;

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    sector: [],
    location: '',
    duration: '',
    contractType: [],
  });
  
  // Animations
  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, BANNER_HEIGHT],
    outputRange: [BANNER_HEIGHT, 60],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, BANNER_HEIGHT / 2, BANNER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const handleInternshipPress = (internship: Internship) => {
    navigation.navigate('InternshipDetail', { internship });
  };

  const handleCategoryPress = (categoryId: string) => {
    setFilters({
      ...filters,
      sector: [categoryId],
    });
    navigation.navigate('Search', {
      filters: {
        ...filters,
        sector: [categoryId],
      },
    });
  };

  const handleSearch = () => {
    navigation.navigate('Search', {
      searchQuery,
      filters,
    });
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setFilterModalVisible(false);
  };
  
  // Section component for better organization
  const Section = ({ title, subtitle, seeAllAction, children }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
        {seeAllAction && (
          <TouchableOpacity onPress={seeAllAction}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );

  // Render single category item
  const CategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item.id)}
    >
      <View style={styles.categoryIconContainer}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.count} offres</Text>
    </TouchableOpacity>
  );
  
  // Stat item
  const StatItem = ({ item }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statTitle}>{item.title}</Text>
    </View>
  );
  
  // Render single internship card
  const renderInternship = (internship) => (
    <InternshipCard
      key={internship.id} 
      internship={internship}
      onPress={() => handleInternshipPress(internship)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      
      {/* Animated header background */}
      <Animated.View
        style={[
          styles.headerBackground,
          {
            height: headerHeight,
            opacity: headerOpacity,
          },
        ]}
      >
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070' }}
          style={styles.headerImage}
          imageStyle={styles.headerImageStyle}
        >
          <View style={styles.headerOverlay}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Trouvez le stage idéal</Text>
              <Text style={styles.headerSubtitle}>
                Des opportunités adaptées à votre parcours académique
              </Text>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
      
      {/* Main content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Top spacer to account for the header */}
        <View style={{ height: BANNER_HEIGHT - 50 }} />
        
        {/* Search Section */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={handleSearch}
            onFilterPress={() => setFilterModalVisible(true)}
            placeholder="Rechercher par poste, entreprise ou lieu..."
          />
        </View>
        
        {/* Stats row */}
        <View style={styles.statsContainer}>
          {STATS.map(stat => (
            <StatItem key={stat.id} item={stat} />
          ))}
        </View>
        
        {/* Categories Section */}
        <Section 
          title="Explorer par domaine" 
          subtitle="Découvrez les opportunités par secteur d'activité"
          seeAllAction={() => navigation.navigate('Search')}
        >
          <FlatList
            data={CATEGORIES}
            renderItem={({ item }) => <CategoryItem item={item} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </Section>
        
        {/* Featured Internships */}
        <Section 
          title="Offres recommandées" 
          subtitle="Sélectionnées selon votre profil"
          seeAllAction={() => navigation.navigate('Search', { featured: true })}
        >
          <FlatList
            data={FEATURED_INTERNSHIPS}
            renderItem={({ item }) => renderInternship(item)}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContainer}
          />
        </Section>
        
        {/* Recent Internships */}
        <Section 
          title="Ajoutées récemment"
          subtitle="Ne manquez pas les dernières opportunités"
          seeAllAction={() => navigation.navigate('Search', { recent: true })}
        >
          <View style={styles.recentInternshipsContainer}>
            {RECENT_INTERNSHIPS.map(internship => renderInternship(internship))}
          </View>
        </Section>
        
        {/* Bottom spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
      
      {/* Floating profile button */}
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.profileButtonText}>👤</Text>
      </TouchableOpacity>
      
      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        filters={filters}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerImageStyle: {
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  headerContent: {
    padding: spacing.l,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSizes.m,
    color: colors.white,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    zIndex: 0,
  },
  searchContainer: {
    paddingHorizontal: spacing.l,
    marginTop: 65,
    marginBottom: spacing.l,
    zIndex: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: spacing.l,
    marginTop: 15,
    marginBottom: spacing.l,
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    ...shadows.medium,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statTitle: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  seeAllText: {
    fontSize: typography.fontSizes.s,
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginRight: spacing.m,
    alignItems: 'center',
    width: 120,
    ...shadows.small,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.lightBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  horizontalListContainer: {
    paddingHorizontal: spacing.l,
  },
  recentInternshipsContainer: {
    paddingHorizontal: spacing.l,
  },
  profileButton: {
    position: 'absolute',
    bottom: spacing.l,
    right: spacing.l,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.large,
    zIndex: 10,
  },
  profileButtonText: {
    fontSize: 24,
    color: colors.white,
  },
});

export default HomeScreen; 