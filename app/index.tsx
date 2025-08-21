import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Dimensions, ImageBackground, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const { width} = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#008080" />
      <ImageBackground
        source={require('@/assets/images/recipe-background.jpg')} // Replace with your high-quality recipe image
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0, 128, 128, 0.7)', 'rgba(32, 178, 170, 0.5)', 'rgba(64, 224, 208, 0.3)']}
          style={styles.overlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Animated.View entering={FadeInDown.duration(800)} style={styles.contentContainer}>
              
              {/* Hero Section */}
              <Animated.View style={styles.heroSection}>
                <ThemedText type="title" style={styles.title}>
                  Cook with{'\n'}Passion!
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                  Join Recipe Haven to explore, create, and share delicious recipes with food lovers worldwide.
                </ThemedText>
                <ThemedText style={styles.tagline}>
                  Unleash your inner chef! 🍲
                </ThemedText>
              </Animated.View>

              {/* Icon Section */}
              <Animated.View 
                entering={ZoomIn.duration(1000).delay(200)} 
                style={styles.iconContainer}
              >
                <Animated.View style={styles.iconCard}>
                  <ThemedText style={styles.icon}>🍴</ThemedText>
                </Animated.View>
                <Animated.View style={styles.iconCard}>
                  <ThemedText style={styles.icon}>🥗</ThemedText>
                </Animated.View>
                <Animated.View style={styles.iconCard}>
                  <ThemedText style={styles.icon}>🍰</ThemedText>
                </Animated.View>
              </Animated.View>

              {/* Feature highlights */}
              <Animated.View 
                entering={FadeInDown.duration(800).delay(400)} 
                style={styles.featureContainer}
              >
                <ThemedText style={styles.featureText}>
                  ✨ Thousands of recipes{'\n'}
                  👥 Community of chefs{'\n'}
                  📱 Cook anywhere, anytime
                </ThemedText>
              </Animated.View>

              {/* Button Section */}
              <Animated.View 
                entering={FadeInDown.duration(800).delay(600)} 
                style={styles.buttonContainer}
              >
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => router.push('/signup')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.primaryButtonText}>Get Started Free</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => router.push('/login')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.previewButton}
                  onPress={() => router.push('/home')}
                  activeOpacity={0.9}
                >
                  <Text style={styles.previewButtonText}>Explore Recipes First 🍽️</Text>
                </TouchableOpacity>
              </Animated.View>

            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: width > 400 ? 28 : 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    lineHeight: width > 400 ? 32 : 28,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: width > 400 ? 14 : 13,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: width > 400 ? 20 : 18,
    paddingHorizontal: 10,
  },
  tagline: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  iconCard: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 20,
  },
  featureContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureText: {
    fontSize: 11,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#008080',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  previewButton: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  previewButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
});