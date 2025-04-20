import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, shadows, borderRadius } from '../theme/theme';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import { Internship } from '../components/InternshipCard';

interface ApplyFormScreenProps {
  route: {
    params: {
      internship: Internship;
    };
  };
  navigation: any;
}

const ApplyFormScreen = ({ route, navigation }: ApplyFormScreenProps) => {
  const { internship } = route.params;
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    education: '',
    coverLetter: '',
  });
  
  // Error state
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    education: '',
    coverLetter: '',
  });
  
  // File attachments state
  const [attachments, setAttachments] = useState({
    cv: null,
    coverLetterFile: null,
    portfolio: null,
  });

  const validate = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Validate first name
    if (!form.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
      isValid = false;
    } else {
      newErrors.firstName = '';
    }
    
    // Validate last name
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
      isValid = false;
    } else {
      newErrors.lastName = '';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'L\'email est invalide';
      isValid = false;
    } else {
      newErrors.email = '';
    }
    
    // Validate phone (optional but must be valid if provided)
    if (form.phone.trim() && !/^\+?\d{8,15}$/.test(form.phone)) {
      newErrors.phone = 'Le numéro de téléphone est invalide';
      isValid = false;
    } else {
      newErrors.phone = '';
    }
    
    // Validate education
    if (!form.education.trim()) {
      newErrors.education = 'Niveau d\'études requis';
      isValid = false;
    } else {
      newErrors.education = '';
    }
    
    // Validate cover letter
    if (!form.coverLetter.trim()) {
      newErrors.coverLetter = 'La lettre de motivation est requise';
      isValid = false;
    } else if (form.coverLetter.length < 100) {
      newErrors.coverLetter = 'La lettre de motivation doit contenir au moins 100 caractères';
      isValid = false;
    } else {
      newErrors.coverLetter = '';
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleAttachment = (type: 'cv' | 'coverLetterFile' | 'portfolio') => {
    // In a real app, this would open a document picker
    Alert.alert(
      'Ajouter un document',
      `Ceci ouvrirait le sélecteur de fichier pour choisir un ${
        type === 'cv' ? 'CV' : type === 'coverLetterFile' ? 'lettre de motivation' : 'portfolio'
      }`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Simuler l\'ajout',
          onPress: () => {
            setAttachments({
              ...attachments,
              [type]: {
                name: `document-${type}.pdf`,
                size: '1.2 MB',
              },
            });
          },
        },
      ]
    );
  };

  const removeAttachment = (type: 'cv' | 'coverLetterFile' | 'portfolio') => {
    setAttachments({
      ...attachments,
      [type]: null,
    });
  };

  const handleSubmit = () => {
    if (validate()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Candidature envoyée',
          `Votre candidature pour le poste de ${internship.title} chez ${internship.company} a été envoyée avec succès. Vous recevrez une confirmation par email.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ApplicationSuccess', { internship }),
            },
          ]
        );
      }, 2000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Postuler"
        leftIcon={<Text style={styles.headerIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.jobInfoContainer}>
          <Text style={styles.jobTitle}>{internship.title}</Text>
          <Text style={styles.companyName}>{internship.company}</Text>
          <Text style={styles.locationText}>{internship.location}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <Input
            label="Prénom *"
            value={form.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
            error={errors.firstName}
            placeholder="Votre prénom"
          />
          
          <Input
            label="Nom *"
            value={form.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
            error={errors.lastName}
            placeholder="Votre nom"
          />
          
          <Input
            label="Email *"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            error={errors.email}
            placeholder="votre.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Téléphone"
            value={form.phone}
            onChangeText={(text) => handleChange('phone', text)}
            error={errors.phone}
            placeholder="+212 XXXXXXXXX"
            keyboardType="phone-pad"
          />
          
          <Input
            label="Niveau d'études *"
            value={form.education}
            onChangeText={(text) => handleChange('education', text)}
            error={errors.education}
            placeholder="Ex: Bac+3 Informatique"
          />
          
          <Text style={styles.sectionTitle}>Documents</Text>
          
          <View style={styles.attachmentSection}>
            <Text style={styles.attachmentLabel}>CV (PDF, DOC) *</Text>
            {attachments.cv ? (
              <View style={styles.attachmentItem}>
                <Text style={styles.attachmentName}>{attachments.cv.name}</Text>
                <Text style={styles.attachmentSize}>{attachments.cv.size}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeAttachment('cv')}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title="Ajouter votre CV"
                variant="outline"
                onPress={() => handleAttachment('cv')}
                icon={<Text>📎</Text>}
              />
            )}
          </View>
          
          <View style={styles.attachmentSection}>
            <Text style={styles.attachmentLabel}>Portfolio (optionnel)</Text>
            {attachments.portfolio ? (
              <View style={styles.attachmentItem}>
                <Text style={styles.attachmentName}>{attachments.portfolio.name}</Text>
                <Text style={styles.attachmentSize}>{attachments.portfolio.size}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeAttachment('portfolio')}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Button
                title="Ajouter un portfolio"
                variant="outline"
                onPress={() => handleAttachment('portfolio')}
                icon={<Text>📎</Text>}
              />
            )}
          </View>
          
          <Input
            label="Lettre de motivation *"
            value={form.coverLetter}
            onChangeText={(text) => handleChange('coverLetter', text)}
            error={errors.coverLetter}
            placeholder="Décrivez pourquoi vous souhaitez rejoindre notre entreprise et pourquoi vous êtes le candidat idéal pour ce poste..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={styles.multilineInput}
          />
          
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              En cliquant sur 'Envoyer ma candidature', vous acceptez que vos données soient traitées conformément à notre politique de confidentialité.
            </Text>
          </View>
          
          <Button
            title="Envoyer ma candidature"
            onPress={handleSubmit}
            loading={loading}
            fullWidth
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  headerIcon: {
    fontSize: typography.fontSizes.xl,
    color: colors.white,
  },
  jobInfoContainer: {
    backgroundColor: colors.white,
    padding: spacing.l,
    ...shadows.small,
  },
  jobTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  companyName: {
    fontSize: typography.fontSizes.m,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  locationText: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
  },
  formContainer: {
    backgroundColor: colors.white,
    padding: spacing.l,
    marginTop: spacing.m,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing.m,
    marginTop: spacing.l,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.s,
  },
  attachmentSection: {
    marginBottom: spacing.m,
  },
  attachmentLabel: {
    fontSize: typography.fontSizes.s,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    marginTop: spacing.s,
  },
  attachmentName: {
    flex: 1,
    fontSize: typography.fontSizes.s,
    color: colors.text,
  },
  attachmentSize: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    marginRight: spacing.m,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
    fontSize: typography.fontSizes.s,
  },
  disclaimerContainer: {
    marginTop: spacing.l,
    marginBottom: spacing.l,
  },
  disclaimerText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.m,
  },
});

export default ApplyFormScreen; 