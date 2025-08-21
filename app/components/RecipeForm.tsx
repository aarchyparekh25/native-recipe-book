import React, { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet, StatusBar } from "react-native";
import Toast from 'react-native-toast-message';

type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

type RecipeInput = {
  title: string;
  description?: string;
  category?: string;
  ingredients: { name: string; quantity: number; unit?: string }[];
  steps: string[];
  imageUrl?: string;
  prepTimeMins?: number;
  cookTimeMins?: number;
  servings?: number;
};

type RecipeFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: RecipeInput) => Promise<void>;
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
    category?: string;
    ingredients?: { name: string; quantity: number; unit?: string }[];
    steps?: string[];
    imageUrl?: string;
    prepTimeMins?: number;
    cookTimeMins?: number;
    servings?: number;
  };
};

export default function RecipeForm({ visible, onClose, onSubmit, initialData = {} }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData.ingredients && initialData.ingredients.length > 0
      ? initialData.ingredients.map((ing) => ({
          name: ing.name || "",
          quantity: ing.quantity?.toString() || "",
          unit: ing.unit || "",
        }))
      : [{ name: "", quantity: "", unit: "" }]
  );
  const [steps, setSteps] = useState(initialData.steps && initialData.steps.length > 0 ? initialData.steps : [""]);
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [prepTimeMins, setPrepTimeMins] = useState(initialData.prepTimeMins?.toString() || "");
  const [cookTimeMins, setCookTimeMins] = useState(initialData.cookTimeMins?.toString() || "");
  const [servings, setServings] = useState(initialData.servings?.toString() || "");

  // Reset form when modal opens (for edit mode or new recipe)
  React.useEffect(() => {
    if (visible) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setCategory(initialData.category || "");
      setIngredients(
        initialData.ingredients && initialData.ingredients.length > 0
          ? initialData.ingredients.map((ing) => ({
              name: ing.name || "",
              quantity: ing.quantity?.toString() || "",
              unit: ing.unit || "",
            }))
          : [{ name: "", quantity: "", unit: "" }]
      );
      setSteps(initialData.steps && initialData.steps.length > 0 ? initialData.steps : [""]);
      setImageUrl(initialData.imageUrl || "");
      setPrepTimeMins(initialData.prepTimeMins?.toString() || "");
      setCookTimeMins(initialData.cookTimeMins?.toString() || "");
      setServings(initialData.servings?.toString() || "");
    }
  }, [
    visible,
    initialData.title,
    initialData.description,
    initialData.category,
    initialData.ingredients,
    initialData.steps,
    initialData.imageUrl,
    initialData.prepTimeMins,
    initialData.cookTimeMins,
    initialData.servings
  ]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    const isEditMode = !!initialData.id;

    // Check if title is provided
    if (!title.trim()) {
      errors.push("Recipe title is required");
    }

    // Check ingredients
    const validIngredients = ingredients.filter(ing => 
      ing.name.trim() && ing.quantity.trim()
    );

    if (validIngredients.length === 0) {
      errors.push("At least one ingredient with name and quantity is required");
    }

    // Check for incomplete ingredients (partial data)
    const incompleteIngredients = ingredients.some(ing => 
      (ing.name.trim() && !ing.quantity.trim()) || 
      (!ing.name.trim() && ing.quantity.trim())
    );

    if (incompleteIngredients) {
      errors.push("Please complete all ingredient fields or remove empty ones");
    }

    // Check steps (at least one non-empty step)
    const validSteps = steps.filter(step => step.trim());
    if (validSteps.length === 0) {
      errors.push("At least one instruction step is required");
    }

    // Validate numeric fields if provided
    if (prepTimeMins && isNaN(parseInt(prepTimeMins))) {
      errors.push("Prep time must be a valid number");
    }

    if (cookTimeMins && isNaN(parseInt(cookTimeMins))) {
      errors.push("Cook time must be a valid number");
    }

    if (servings && isNaN(parseInt(servings))) {
      errors.push("Servings must be a valid number");
    }

    // Validate quantities are numbers
    const invalidQuantities = ingredients.some(ing => 
      ing.quantity.trim() && isNaN(parseFloat(ing.quantity))
    );

    if (invalidQuantities) {
      errors.push("All ingredient quantities must be valid numbers");
    }

    // For add mode, show more specific empty form guidance
    if (!isEditMode && validIngredients.length === 0 && validSteps.length === 0 && !title.trim()) {
      return ["Please fill out the recipe form before submitting:\n• Add a recipe title\n• Add at least one ingredient\n• Add at least one instruction step"];
    }

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: validationErrors.join('\n'),
        position: 'top',
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
      });
      return;
    }

    // Filter out empty ingredients and steps
    const validIngredients = ingredients.filter(ing => 
      ing.name.trim() && ing.quantity.trim()
    );

    const validSteps = steps.filter(step => step.trim());

    const input: RecipeInput = {
      title: title.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      ingredients: validIngredients.map((ing) => ({
        name: ing.name.trim(),
        quantity: parseFloat(ing.quantity),
        unit: ing.unit.trim() || undefined,
      })),
      steps: validSteps,
      imageUrl: imageUrl.trim() || undefined,
      prepTimeMins: prepTimeMins ? parseInt(prepTimeMins) : undefined,
      cookTimeMins: cookTimeMins ? parseInt(cookTimeMins) : undefined,
      servings: servings ? parseInt(servings) : undefined,
    };

    try {
      await onSubmit(input);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Recipe ${initialData.id ? 'updated' : 'added'} successfully!`,
        position: 'top',
        topOffset: 60,
        visibilityTime: 3000,
        autoHide: true,
      });
      onClose();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to ${initialData.id ? 'update' : 'add'} recipe: ${error.message}`,
        position: 'top',
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

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
          <Text style={styles.headerTitle}>
            {initialData.id ? "Edit Recipe" : "New Recipe"}
          </Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Recipe Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter recipe title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Dessert, Main Course, Appetizer"
                value={category}
                onChangeText={setCategory}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your recipe..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Recipe Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipe Details</Text>
            
            <View style={styles.timeServingsRow}>
              <View style={styles.timeServingsItem}>
                <Text style={styles.inputLabel}>Prep (mins)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="30"
                  value={prepTimeMins}
                  onChangeText={setPrepTimeMins}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.timeServingsItem}>
                <Text style={styles.inputLabel}>Cook (mins)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="45"
                  value={cookTimeMins}
                  onChangeText={setCookTimeMins}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.timeServingsItem}>
                <Text style={styles.inputLabel}>Servings</Text>
                <TextInput
                  style={styles.input}
                  placeholder="4"
                  value={servings}
                  onChangeText={setServings}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Image URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholderTextColor="#9CA3AF"
                keyboardType="url"
              />
            </View>
          </View>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ingredients *</Text>
              <TouchableOpacity style={styles.addButtonSmall} onPress={handleAddIngredient}>
                <Text style={styles.addButtonSmallText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientCard}>
                <View style={styles.ingredientHeader}>
                  <Text style={styles.ingredientNumber}>{index + 1}</Text>
                  {ingredients.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveIngredient(index)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={[styles.input, styles.ingredientInput]}
                  placeholder="Ingredient name *"
                  value={ingredient.name}
                  onChangeText={(text) =>
                    setIngredients(
                      ingredients.map((ing, i) => (i === index ? { ...ing, name: text } : ing))
                    )
                  }
                  placeholderTextColor="#9CA3AF"
                />
                <View style={styles.quantityUnitRow}>
                  <TextInput
                    style={[styles.input, styles.quantityInput]}
                    placeholder="Amount *"
                    value={ingredient.quantity}
                    onChangeText={(text) =>
                      setIngredients(
                        ingredients.map((ing, i) => (i === index ? { ...ing, quantity: text } : ing))
                      )
                    }
                    keyboardType="numeric"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TextInput
                    style={[styles.input, styles.unitInput]}
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChangeText={(text) =>
                      setIngredients(
                        ingredients.map((ing, i) => (i === index ? { ...ing, unit: text } : ing))
                      )
                    }
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Steps Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <TouchableOpacity style={styles.addButtonSmall} onPress={handleAddStep}>
                <Text style={styles.addButtonSmallText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            
            {steps.map((step, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  {steps.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemoveStep(index)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={[styles.input, styles.textArea, styles.stepInput]}
                  placeholder={`Describe step ${index + 1}...`}
                  value={step}
                  onChangeText={(text) =>
                    setSteps(steps.map((s, i) => (i === index ? text : s)))
                  }
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            ))}
          </View>

          {/* Bottom spacing for keyboard */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
        <Toast />
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
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
  },
  saveButtonText: {
    color: '#0D9488',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#134E4A',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  timeServingsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  timeServingsItem: {
    flex: 1,
  },
  addButtonSmall: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonSmallText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ingredientCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D9488',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ingredientInput: {
    marginBottom: 8,
  },
  quantityUnitRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quantityInput: {
    flex: 2,
  },
  unitInput: {
    flex: 1,
  },
  stepCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stepInput: {
    marginBottom: 0,
  },
  bottomSpacing: {
    height: 40,
  },
});