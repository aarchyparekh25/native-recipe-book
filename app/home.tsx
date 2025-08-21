import { ApolloClient, ApolloProvider, gql, InMemoryCache, useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { FlatList, Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';
import RecipeCard from "./components/RecipeCard";
import RecipeDetails from "./components/RecipeDetails";
import RecipeForm from "./components/RecipeForm";

const client = new ApolloClient({
  uri: "http://192.168.1.201:4000/graphql",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

const GET_RECIPES = gql`
  query {
    recipes(page: 1, pageSize: 20) {
      nodes {
        id
        title
        category
        description
        ingredients {
          name
          quantity
          unit
        }
        steps
        imageUrl
        prepTimeMins
        cookTimeMins
        servings
        createdBy {
          id
          email
        }
      }
    }
  }
`;

const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: RecipeInput!) {
    addRecipe(input: $input) {
      id
      title
      category
      description
      ingredients {
        name
        quantity
        unit
      }
      steps
      imageUrl
      prepTimeMins
      cookTimeMins
      servings
      createdBy {
        id
        email
      }
    }
  }
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!, $input: RecipeUpdateInput!) {
    updateRecipe(id: $id, input: $input) {
      id
      title
      category
      description
      ingredients {
        name
        quantity
        unit
      }
      steps
      imageUrl
      prepTimeMins
      cookTimeMins
      servings
      createdBy {
        id
        email
      }
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;

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

const categories = [
  { label: "Select a category", value: "" },
  { label: "Appetizer", value: "Appetizer" },
  { label: "Main Course", value: "Main Course" },
  { label: "Dessert", value: "Dessert" },
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "Snack", value: "Snack" },
  { label: "Soup", value: "Soup" },
  { label: "Salad", value: "Salad" },
  { label: "Beverage", value: "Beverage" },
  { label: "Side Dish", value: "Side Dish" },
];

function HomeContent() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { loading, error, data, refetch } = useQuery(GET_RECIPES, {
    context: {
      headers: {
        authorization: userToken ? `Bearer ${userToken}` : "",
      },
    },
  });
  
  const [createRecipe] = useMutation(CREATE_RECIPE, {
    onCompleted: () => {
      refetch();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Recipe added successfully!',
        position: 'top',
        topOffset: 60,
        visibilityTime: 3000,
        autoHide: true,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to add recipe: ${error.message}`,
        position: 'top',
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
      });
    },
    context: {
      headers: {
        authorization: userToken ? `Bearer ${userToken}` : "",
      },
    },
  });
  
  const [updateRecipe] = useMutation(UPDATE_RECIPE, {
    onCompleted: () => {
      refetch();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Recipe updated successfully!',
        position: 'top',
        topOffset: 60,
        visibilityTime: 3000,
        autoHide: true,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to update recipe: ${error.message}`,
        position: 'top',
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
      });
    },
    context: {
      headers: {
        authorization: userToken ? `Bearer ${userToken}` : "",
      },
    },
  });
  
  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    onCompleted: () => {
      refetch();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Recipe deleted successfully!',
        position: 'top',
        topOffset: 60,
        visibilityTime: 3000,
        autoHide: true,
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to delete recipe: ${error.message}`,
        position: 'top',
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
      });
    },
    context: {
      headers: {
        authorization: userToken ? `Bearer ${userToken}` : "",
      },
    },
  });
  
  const router = useRouter();

  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setUserToken(token);
        if (token) {
          const decoded: { id: string; email?: string } = jwtDecode(token);
          setUserId(decoded.id);
          setUserEmail(decoded.email || null);
        } else {
          setUserId(null);
          setUserEmail(null);
        }
      } catch (error: any) {
        console.error("Error decoding token:", error.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: `Failed to fetch user token: ${error.message}`,
          position: 'top',
          topOffset: 60,
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    };
    fetchUserToken();
  }, []);

  const handleAddRecipe = () => {
    if (!userToken) {
      Toast.show({
        type: 'error',
        text1: 'Please Log In',
        text2: 'You must be logged in to add a recipe.',
        position: 'top',
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
        onPress: () => router.push("/login"),
      });
      return;
    }
    setShowForm(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setUserToken(null);
      setUserId(null);
      setUserEmail(null);
      setShowDropdown(false);
      router.replace("/login");
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged out successfully!',
        position: 'top',
        topOffset: 60,
        visibilityTime: 3000,
        autoHide: true,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to log out: ${error.message}`,
        position: 'top',
        topOffset: 60,
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const handleCreateRecipe = async (input: any) => {
    await createRecipe({
      variables: { input },
      context: { headers: { authorization: userToken ? `Bearer ${userToken}` : "" } },
    });
    setShowForm(false);
  };

  const handleUpdateRecipe = async (input: any) => {
    if (!editRecipe) return;
    await updateRecipe({
      variables: { id: editRecipe.id, input },
      context: { headers: { authorization: userToken ? `Bearer ${userToken}` : "" } },
    });
    setEditRecipe(null);
  };

  const handleDeleteRecipe = async (id: string) => {
    Toast.show({
      type: 'info',
      text1: 'Confirm Delete',
      text2: 'Are you sure you want to delete this recipe?',
      position: 'top',
      topOffset: 60,
      visibilityTime: 5000,
      autoHide: true,
      onPress: async () => {
        await deleteRecipe({
          variables: { id },
          context: { headers: { authorization: userToken ? `Bearer ${userToken}` : "" } },
        });
      },
      bottomOffset: 40,
      text1Style: { fontSize: 16, fontWeight: '600' },
      text2Style: { fontSize: 14 },
    });
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#F0FDFC', '#E0F7FA', '#B2EBF2']}
        style={styles.centerContainer}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#F0FDFC" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🍳</Text>
          <Text style={styles.loadingText}>Cooking up something delicious...</Text>
        </View>
      </LinearGradient>
    );
  }
  
  if (error) {
    return (
      <LinearGradient
        colors={['#F0FDFC', '#E0F7FA', '#B2EBF2']}
        style={styles.centerContainer}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#F0FDFC" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😔</Text>
          <Text style={styles.errorText}>Oops! Something went wrong</Text>
          <Text style={styles.errorSubtext}>{error.message}</Text>
        </View>
      </LinearGradient>
    );
  }

  const filteredRecipes = data?.recipes?.nodes?.filter(
    (recipe: Recipe) =>
      (recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        (recipe.category && recipe.category.toLowerCase().includes(search.toLowerCase()))) &&
      (!selectedCategory || (recipe.category && recipe.category === selectedCategory))
  ) || [];

  // Limit to 3 recipes for non-logged-in users
  const displayedRecipes = userToken ? filteredRecipes : filteredRecipes.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0FDFC" />
      <LinearGradient
        colors={['#F0FDFC', '#E0F7FA']}
        style={styles.container}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Recipe Haven</Text>
            <Text style={styles.subtitle}>🍴 Discover & Create Amazing Recipes</Text>
          </View>
          
          {userToken && (
            <TouchableOpacity 
              style={styles.profileContainer} 
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.profileButtonText}>👤</Text>
              <Text style={styles.userName}>
                {userEmail ? userEmail.split('@')[0] : 'User'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dropdown Menu */}
        <Modal
          visible={showDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <TouchableOpacity 
            style={styles.dropdownOverlay} 
            onPress={() => setShowDropdown(false)}
          >
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                <Text style={styles.dropdownItemText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Search and Filter Section */}
        <View style={styles.actionSection}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue: string) => setSelectedCategory(itemValue)}
              style={styles.categoryPicker}
            >
              {categories.map((category) => (
                <Picker.Item
                  key={category.value}
                  label={category.label}
                  value={category.value}
                />
              ))}
            </Picker>
          </View>
          
          <TouchableOpacity
            style={[styles.addButton, !userToken && styles.disabledButton]}
            onPress={handleAddRecipe}
            disabled={!userToken}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Auth Status */}
        {!userToken && (
          <View style={styles.authPrompt}>
            <Text style={styles.authPromptText}>
              Sign in to create and save your own recipes! 👨‍🍳
            </Text>
            <TouchableOpacity 
              style={styles.authButton}
              onPress={() => router.push("/login")}
              activeOpacity={0.8}
            >
              <Text style={styles.authButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Recipes List */}
        <View style={styles.recipesContainer}>
          {displayedRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>🍽️</Text>
              <Text style={styles.emptyStateText}>No recipes found</Text>
              <Text style={styles.emptyStateSubtext}>
                {search || selectedCategory ? "Try a different search term or category" : "Be the first to add a recipe!"}
              </Text>
            </View>
          ) : (
            <>
              <FlatList
                data={displayedRecipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <RecipeCard
                    recipe={item}
                    userId={userId}
                    onShowMore={() => setSelectedRecipe(item)}
                    onEdit={() => setEditRecipe(item)}
                    onDelete={() => handleDeleteRecipe(item.id)}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.recipesList}
                ItemSeparatorComponent={() => <View style={styles.recipeSeparator} />}
              />
              {!userToken && filteredRecipes.length > 3 && (
                <TouchableOpacity
                  style={styles.seeMoreButton}
                  onPress={() => {
                    Toast.show({
                      type: 'error',
                      text1: 'Please Sign In',
                      text2: 'Sign in to view more recipes!',
                      position: 'top',
                      topOffset: 60,
                      visibilityTime: 4000,
                      autoHide: true,
                      onPress: () => router.push("/login"),
                    });
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.seeMoreButtonText}>See More Recipes</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        
        <RecipeForm
          visible={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateRecipe}
          initialData={undefined}
        />
        
        <RecipeForm
          visible={!!editRecipe}
          onClose={() => setEditRecipe(null)}
          onSubmit={handleUpdateRecipe}
          initialData={editRecipe || undefined}
        />
        
        <RecipeDetails
          visible={!!selectedRecipe}
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
        
        <Toast />
      </LinearGradient>
    </SafeAreaView>
  );
}

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <HomeContent />
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0FDFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header Styles
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#008080',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    marginLeft: 12,
  },
  profileButtonText: {
    fontSize: 16,
    marginRight: 6,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#008080',
    maxWidth: 120,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '600',
  },

  // Action Section
  actionSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#008080', // Changed to teal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  filterContainer: {
    width: 120, // Fixed width for dropdown
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Matches search bar
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#008080', // Teal border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryPicker: {
    height: 50,
    color: '#008080', // Teal text
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#008080',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Auth Prompt
  authPrompt: {
    backgroundColor: 'rgba(0, 128, 128, 0.05)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 128, 128, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authPromptText: {
    flex: 1,
    fontSize: 12,
    color: '#008080',
    fontWeight: '500',
    marginRight: 12,
  },
  authButton: {
    backgroundColor: '#008080',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  authButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Recipes Section
  recipesContainer: {
    flex: 1,
  },
  recipesList: {
    paddingBottom: 20,
  },
  recipeSeparator: {
    height: 12,
  },

  // See More Button
  seeMoreButton: {
    backgroundColor: '#008080',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  seeMoreButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#008080',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Loading State
  loadingContainer: {
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#008080',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Error State
  errorContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
});