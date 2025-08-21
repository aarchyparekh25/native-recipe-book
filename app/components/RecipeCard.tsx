import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Recipe = {
  id: string;
  title: string;
  category?: string;
  description?: string;
  ingredients?: { name: string; quantity: number; unit?: string }[];
  steps?: string[];
  prepTimeMins?: number;
  cookTimeMins?: number;
  servings?: number;
  createdBy: { id: string; email: string };
};

type RecipeCardProps = {
  recipe: Recipe;
  userId: string | null;
  onShowMore: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function RecipeCard({ recipe, userId, onShowMore, onEdit, onDelete }: RecipeCardProps) {
  const isOwner = userId && userId === recipe.createdBy.id;
  const totalTime = (recipe.prepTimeMins || 0) + (recipe.cookTimeMins || 0);
  
  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(240, 253, 252, 0.8)']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {recipe.title}
            </Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryEmoji}>🍽️</Text>
              <Text style={styles.cardCategory}>
                {recipe.category || "Uncategorized"}
              </Text>
            </View>
          </View>
          
          {/* Recipe Stats */}
          <View style={styles.statsContainer}>
            {totalTime > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>⏱️</Text>
                <Text style={styles.statText}>{totalTime}m</Text>
              </View>
            )}
            {recipe.servings && (
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>👥</Text>
                <Text style={styles.statText}>{recipe.servings}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <Text style={styles.cardDescription} numberOfLines={2}>
          {recipe.description || "A delicious recipe waiting to be discovered! 🍴"}
        </Text>

        {/* Ingredients Preview */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <View style={styles.ingredientsPreview}>
            <Text style={styles.ingredientsLabel}>Key ingredients:</Text>
            <Text style={styles.ingredientsText} numberOfLines={1}>
              {recipe.ingredients.slice(0, 3).map(ing => ing.name).join(', ')}
              {recipe.ingredients.length > 3 && '...'}
            </Text>
          </View>
        )}

        {/* Creator Info */}
        <View style={styles.creatorSection}>
          <View style={styles.creatorInfo}>
            <Text style={styles.creatorEmoji}>👨‍🍳</Text>
            <Text style={styles.cardCreatedBy}>
              {recipe.createdBy.email.split('@')[0]}
            </Text>
          </View>
          {isOwner && (
            <View style={styles.ownerBadge}>
              <Text style={styles.ownerBadgeText}>Your Recipe</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={onShowMore}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>View Recipe</Text>
            <Text style={styles.buttonEmoji}>👀</Text>
          </TouchableOpacity>

          {isOwner && (
            <View style={styles.ownerActions}>
              <TouchableOpacity 
                style={styles.editButton} 
                onPress={onEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={onDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 2,
    marginVertical: 1,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 128, 128, 0.1)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  
  // Header Section
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#008080',
    marginBottom: 6,
    lineHeight: 22,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  cardCategory: {
    fontSize: 12,
    color: '#20B2AA',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  
  // Stats
  statsContainer: {
    alignItems: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statEmoji: {
    fontSize: 10,
    marginRight: 3,
  },
  statText: {
    fontSize: 10,
    color: '#008080',
    fontWeight: '600',
  },
  
  // Description
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 10,
    fontWeight: '400',
  },
  
  // Ingredients Preview
  ingredientsPreview: {
    backgroundColor: 'rgba(32, 178, 170, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#20B2AA',
  },
  ingredientsLabel: {
    fontSize: 11,
    color: '#008080',
    fontWeight: '600',
    marginBottom: 2,
  },
  ingredientsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  
  // Creator Section
  creatorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 128, 128, 0.1)',
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorEmoji: {
    fontSize: 12,
    marginRight: 6,
  },
  cardCreatedBy: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  ownerBadge: {
    backgroundColor: '#008080',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ownerBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  // Buttons Section
  buttonSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#008080',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 6,
  },
  buttonEmoji: {
    fontSize: 12,
  },
  
  // Owner Actions
  ownerActions: {
    flexDirection: 'row',
    gap: 6,
  },
  editButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.15)',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 165, 0, 0.3)',
  },
  editButtonText: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: 'rgba(211, 47, 47, 0.15)',
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(211, 47, 47, 0.3)',
  },
  deleteButtonText: {
    fontSize: 14,
  },
});