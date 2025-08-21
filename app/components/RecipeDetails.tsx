import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

type Recipe = {
  id: string;
  title: string;
  category?: string;
  description?: string;
  ingredients: { name: string; quantity: number; unit?: string }[];
  steps: string[];
  imageUrl?: string;
  prepTimeMins?: number;
  cookTimeMins?: number;
  servings?: number;
  createdBy: { id: string; email: string };
};

type RecipeDetailsProps = {
  visible: boolean;
  recipe: Recipe | null;
  onClose: () => void;
};

export default function RecipeDetails({ visible, recipe, onClose }: RecipeDetailsProps) {
  if (!recipe) return null;

  const handleImageError = () => {
    Alert.alert("Error", "Failed to load image");
  };

  const totalTime = (recipe.prepTimeMins || 0) + (recipe.cookTimeMins || 0);

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      transparent={false}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="#0D9488" barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recipe Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Recipe Image */}
          {recipe.imageUrl ? (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: recipe.imageUrl }}
                style={styles.heroImage}
                resizeMode="cover"
                onError={handleImageError}
              />
              <View style={styles.imageOverlay} />
            </View>
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🍽️</Text>
            </View>
          )}

          {/* Main Content */}
          <View style={styles.content}>
            {/* Title and Category */}
            <View style={styles.titleSection}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {recipe.category || "Uncategorized"}
                </Text>
              </View>
            </View>

            {/* Quick Info Cards */}
            <View style={styles.quickInfoContainer}>
              <View style={styles.quickInfoCard}>
                <Text style={styles.quickInfoNumber}>{totalTime}</Text>
                <Text style={styles.quickInfoLabel}>Total mins</Text>
              </View>
              <View style={styles.quickInfoCard}>
                <Text style={styles.quickInfoNumber}>{recipe.servings || 1}</Text>
                <Text style={styles.quickInfoLabel}>Servings</Text>
              </View>
              <View style={styles.quickInfoCard}>
                <Text style={styles.quickInfoNumber}>{recipe.ingredients.length}</Text>
                <Text style={styles.quickInfoLabel}>Ingredients</Text>
              </View>
            </View>

            {/* Description */}
            {recipe.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{recipe.description}</Text>
              </View>
            )}

            {/* Time Breakdown */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Time Breakdown</Text>
              <View style={styles.timeContainer}>
                <View style={styles.timeItem}>
                  <View style={styles.timeIcon}>
                    <Text style={styles.timeIconText}>⏱️</Text>
                  </View>
                  <View style={styles.timeDetails}>
                    <Text style={styles.timeLabel}>Prep Time</Text>
                    <Text style={styles.timeValue}>{recipe.prepTimeMins || 0} mins</Text>
                  </View>
                </View>
                <View style={styles.timeItem}>
                  <View style={styles.timeIcon}>
                    <Text style={styles.timeIconText}>🔥</Text>
                  </View>
                  <View style={styles.timeDetails}>
                    <Text style={styles.timeLabel}>Cook Time</Text>
                    <Text style={styles.timeValue}>{recipe.cookTimeMins || 0} mins</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredients</Text>
              <View style={styles.ingredientsContainer}>
                {recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.ingredientBullet} />
                      <Text style={styles.ingredientText}>
                        <Text style={styles.ingredientName}>{ing.name}</Text>
                        <Text style={styles.ingredientQuantity}>
                          {" "}- {ing.quantity} {ing.unit || ""}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No ingredients listed</Text>
                )}
              </View>
            </View>

            {/* Steps */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <View style={styles.stepsContainer}>
                {recipe.steps.length > 0 ? (
                  recipe.steps.map((step, index) => (
                    <View key={index} style={styles.stepItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No steps provided</Text>
                )}
              </View>
            </View>

            {/* Creator Info */}
            <View style={styles.creatorSection}>
              <Text style={styles.creatorLabel}>Recipe by</Text>
              <Text style={styles.creatorName}>{recipe.createdBy.email}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0D9488',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
  },
  placeholderImage: {
    height: 180,
    backgroundColor: '#E6FFFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#B2F5EA',
  },
  placeholderText: {
    fontSize: 48,
    opacity: 0.5,
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#134E4A',
    marginBottom: 6,
    lineHeight: 28,
  },
  categoryBadge: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 3,
    elevation: 2,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickInfoNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D9488',
    marginBottom: 2,
  },
  quickInfoLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#134E4A',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4B5563',
  },
  timeContainer: {
    gap: 8,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  timeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6FFFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timeIconText: {
    fontSize: 18,
  },
  timeDetails: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D9488',
  },
  ingredientsContainer: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#14B8A6',
    marginTop: 5,
    marginRight: 10,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
  ingredientName: {
    fontWeight: '600',
    color: '#134E4A',
  },
  ingredientQuantity: {
    color: '#0D9488',
    fontWeight: '500',
  },
  stepsContainer: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  creatorSection: {
    backgroundColor: '#E6FFFA',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  creatorLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  creatorName: {
    fontSize: 13,
    color: '#0D9488',
    fontWeight: '600',
  },
});