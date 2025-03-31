import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Image,
  ScrollView,
  FlatList,
  SectionList,
  ActivityIndicator,
  Animated,
  StatusBar,
  SafeAreaView,
  Modal,
  Switch,
  Keyboard
} from 'react-native';

const App = () => {
  const [city, setCity] = useState('Kathmandu');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTips, setShowTips] = useState(true);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(-50))[0];
  const headerSlideAnim = useState(new Animated.Value(-100))[0];
  const footerFadeAnim = useState(new Animated.Value(0))[0];
  
  const fetchWeatherData = (cityName) => {
    setLoading(true);
    setError(null);
    

    setTimeout(() => {
      try {
        const mockWeather = {
          city: cityName,
          temperature: Math.floor(Math.random() * 30) + 10,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Thunderstorm'][Math.floor(Math.random() * 5)],
          humidity: Math.floor(Math.random() * 50) + 30, 
          windSpeed: Math.floor(Math.random() * 20) + 5, 
        };
        
        const mockForecast = Array(5).fill().map((_, index) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][(new Date().getDay() + index + 1) % 7],
          highTemp: Math.floor(Math.random() * 15) + 20,
          lowTemp: Math.floor(Math.random() * 10) + 10,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Thunderstorm'][Math.floor(Math.random() * 5)],
        }));
        
        setWeather(mockWeather);
        setForecast(mockForecast);
        setLoading(false);
        
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(headerSlideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(footerFadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          })
        ]).start();
        
      } catch (err) {
        setError('Failed to fetch weather data. Please try again.');
        setLoading(false);
      }
    }, 1500); 
  };
  

  useEffect(() => {
    fetchWeatherData(city);
  }, []);
  
  const handleSearch = () => {
    if (searchInput.trim()) {
      setCity(searchInput);
      fetchWeatherData(searchInput);
      setSearchInput('');
      Keyboard.dismiss();
    }
  };
  
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Sunny':
        return '☀️';
      case 'Cloudy':
        return '☁️';
      case 'Rainy':
        return '🌧️';
      case 'Partly Cloudy':
        return '⛅';
      case 'Thunderstorm':
        return '⛈️';
      default:
        return '🌤️';
    }
  };
  
  const getTempColor = (temp) => {
    if (temp < 15) return '#4287f5'; // cold
    if (temp < 25) return '#42f59e'; // mild
    return '#f54242'; // hot
  };
  
  // Weather tips data for SectionList
  const weatherTipsData = [
    {
      title: "General Tips",
      data: [
        "Check the weather forecast regularly",
        "Keep an emergency kit for severe weather"
      ]
    },
    {
      title: "Seasonal Tips",
      data: [
        "Spring: Be prepared for sudden rain showers",
        "Summer: Stay hydrated and use sunscreen",
        "Fall: Layers are your friend as temperatures vary",
        "Winter: Insulate your home to conserve heat"
      ]
    }
  ];

  const renderSavedLocation = ({ item }) => (
    <TouchableHighlight
      onPress={() => {
        setCity(item);
        fetchWeatherData(item);
        setModalVisible(false);
      }}
      underlayColor="#dddddd"
      style={styles.savedLocationItem}
    >
      <Text style={styles.savedLocationText}>{item}</Text>
    </TouchableHighlight>
  );
  
  const savedLocations = ["New York", "London", "Tokyo", "Sydney", "Paris", "Kathmandu","Delhi"];
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        
        {/* Floating Header */}
        <Animated.View 
          style={[
            styles.floatingHeader,
            {
              transform: [{ translateY: headerSlideAnim }],
              backgroundColor: isDarkMode ? '#2c3e50' : '#4a6ea9'
            }
          ]}
        >
          <Text style={styles.title}>Weather Forecast</Text>
          <View style={styles.headerControls}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.iconButtonText}>📍</Text>
            </TouchableOpacity>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>🌙</Text>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
          </View>
        </Animated.View>
        
        {/* Search Bar */}
        <View style={[styles.searchContainer, isDarkMode && styles.darkSearchContainer]}>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Search for a city..."
            placeholderTextColor={isDarkMode ? "#aaa" : "#999"}
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            style={[styles.searchButton, isDarkMode && styles.darkSearchButton]} 
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        
        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={isDarkMode ? "#81b0ff" : "#4a6ea9"} />
              <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>Fetching weather data...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => fetchWeatherData(city)}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : weather ? (
            <>
              {/* Current Weather */}
              <Animated.View 
                style={[
                  styles.currentWeather,
                  isDarkMode && styles.darkCard,
                  { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <Text style={[styles.cityName, isDarkMode && styles.darkText]}>{weather.city}</Text>
                <Text style={[styles.temperature, isDarkMode && styles.darkText]}>
                  {weather.temperature}°C
                </Text>
                <Text style={[styles.condition, isDarkMode && styles.darkSubText]}>
                  {getWeatherIcon(weather.condition)} {weather.condition}
                </Text>
                <View style={styles.detailsContainer}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.darkSubText]}>Humidity</Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{weather.humidity}%</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.darkSubText]}>Wind</Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>{weather.windSpeed} km/h</Text>
                  </View>
                </View>
              </Animated.View>
              
              {/* Forecast */}
              <View style={[styles.forecastContainer, isDarkMode && styles.darkCard]}>
                <Text style={[styles.forecastTitle, isDarkMode && styles.darkText]}>5-Day Forecast</Text>
                <FlatList
                  data={forecast}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <Animated.View 
                      style={[
                        styles.forecastItem,
                        { 
                          opacity: fadeAnim,
                          transform: [{ 
                            translateX: slideAnim.interpolate({
                              inputRange: [-50, 0],
                              outputRange: [50 * (index + 1), 0]
                            })
                          }]
                        }
                      ]}
                    >
                      <Text style={[styles.forecastDay, isDarkMode && styles.darkText]}>{item.day}</Text>
                      <Text style={styles.forecastIcon}>
                        {getWeatherIcon(item.condition)}
                      </Text>
                      <View>
                        <Text style={[
                          styles.forecastTemp,
                          {color: getTempColor(item.highTemp)}
                        ]}>
                          {item.highTemp}°
                        </Text>
                        <Text style={[
                          styles.forecastTemp,
                          {color: getTempColor(item.lowTemp)}
                        ]}>
                          {item.lowTemp}°
                        </Text>
                      </View>
                    </Animated.View>
                  )}
                  scrollEnabled={false}
                />
              </View>
              
              {/* Toggle for Tips Section */}
              <View style={[styles.toggleContainer, isDarkMode && styles.darkCard]}>
                <Text style={[styles.toggleText, isDarkMode && styles.darkText]}>Show Weather Tips</Text>
                <Switch
                  value={showTips}
                  onValueChange={setShowTips}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={showTips ? "#4a6ea9" : "#f4f3f4"}
                />
              </View>
              
              {/* Tips Section with SectionList */}
              {showTips && (
                <View style={[styles.tipsContainer, isDarkMode && styles.darkCard]}>
                  <Text style={[styles.tipsTitle, isDarkMode && styles.darkText]}>Weather Tips</Text>
                  
                  <Text style={[styles.customTipText, isDarkMode && styles.darkSubText]}>
                    {weather.condition === 'Rainy' ? 
                      "Don't forget your umbrella today!" : 
                      weather.condition === 'Sunny' && weather.temperature > 25 ?
                      "It's hot! Stay hydrated and wear sunscreen." :
                      weather.condition === 'Thunderstorm' ?
                      "Stay indoors if possible during the storm." :
                      "Have a great day!"}
                  </Text>
                  
                  <SectionList
                    sections={weatherTipsData}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                      <Text style={[styles.tipItem, isDarkMode && styles.darkSubText]}>• {item}</Text>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                      <Text style={[styles.sectionHeader, isDarkMode && styles.darkText]}>{title}</Text>
                    )}
                  />
                </View>
              )}
            </>
          ) : null}
        </ScrollView>
        
        {/* Footer */}
        <Animated.View style={[
          styles.footer, 
          isDarkMode && styles.darkFooter,
          { opacity: footerFadeAnim }
        ]}>
          <Text style={[styles.footerText, isDarkMode && styles.darkFooterText]}>
            Developed by Sandip Rai © {new Date().getFullYear()}
          </Text>
        </Animated.View>
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
              <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>Saved Locations</Text>
              
              <FlatList
                data={savedLocations}
                renderItem={renderSavedLocation}
                keyExtractor={item => item}
                style={styles.savedLocationsList}
              />
              
              <TouchableOpacity
                style={[styles.closeModalButton, isDarkMode && styles.darkCloseButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8ff',
  },
  darkContainer: {
    backgroundColor: '#1a1a2e',
  },
  floatingHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a6ea9',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
    padding: 5,
  },
  iconButtonText: {
    fontSize: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 5,
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    marginTop: 5,
  },
  darkSearchContainer: {
    backgroundColor: '#16213e',
    borderBottomColor: '#2c3e50',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    color: '#333',
  },
  darkInput: {
    backgroundColor: '#2c3e50',
    color: 'white',
  },
  searchButton: {
    backgroundColor: '#4a6ea9',
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkSearchButton: {
    backgroundColor: '#3498db',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 70, // Space for footer
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  currentWeather: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#16213e',
    shadowColor: '#fff',
    shadowOpacity: 0.1,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  darkText: {
    color: 'white',
  },
  darkSubText: {
    color: '#a0a0a0',
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  condition: {
    fontSize: 20,
    color: '#666',
    marginBottom: 15,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  forecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    width: 60,
  },
  forecastIcon: {
    fontSize: 24,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  customTipText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
    padding: 8,
    marginTop: 10,
    borderRadius: 5,
    color: '#333',
  },
  tipItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4a6ea9',
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  darkFooter: {
    backgroundColor: '#2c3e50',
  },
  footerText: {
    color: 'white',
    fontWeight: '500',
  },
  darkFooterText: {
    color: '#ddd',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: '#16213e',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  savedLocationsList: {
    maxHeight: 300,
  },
  savedLocationItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  savedLocationText: {
    fontSize: 16,
    color: '#333',
  },
  closeModalButton: {
    backgroundColor: '#4a6ea9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  darkCloseButton: {
    backgroundColor: '#3498db',
  },
  closeModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;