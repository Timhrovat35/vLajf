import React, { useEffect, useState, useRef } from 'react';
import { Image, Modal, StyleSheet, Text,Keyboard,  PanResponder ,Animated, Easing, TouchableOpacity, View, PermissionsAndroid, ScrollView, TextInput, TouchableWithoutFeedback, useColorScheme, Alert,  } from 'react-native';
import ReactNativeCalendarEvents from 'react-native-calendar-events';
import MapView, { Marker } from 'react-native-maps';
import { AntDesign, Entypo, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import EventType from '../Components/EventType';
import { useTheme } from '../Components/ThemeContext';
import { MotiView } from 'moti';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseConfig }from "../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { db } from '../firebaseConfig';
import {LinearGradient} from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import DateRangePicker from "react-native-daterange-picker";
import * as Calendar from 'expo-calendar';


const Logo = require('../Images/images.png');
const customMap = require('../customMap.json');
const customMapDark = require('../customMapDark.json')

const MapScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageRadius, setImageRadius] = useState(16);
  const navigation = useNavigation(); // Initialize the navigation hook
  const [calendarPermission, setCalendarPermission] = useState(false);
  const [eventsFromDb, setEventsFromDb] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event
  const [eventsAtSameLocation, setEventsAtSameLocation] = useState([]); // State to store events with the same coordinates
  const [currentIndex, setCurrentIndex] = useState(0); // Index to track the currently displayed event
  const [selectedType, setSelectedType] = useState('All');
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);
  const datePickerY = useRef(new Animated.Value(0)).current;
  const eventTypePickerY = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const gradientColors = isDarkMode ? ['black', 'transparent'] : ['white', 'transparent'];

  const getCalendarPermission = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
      // Permission granted, you can now add events to the calendar.
      return true;
    } else {
      // Permission denied, handle accordingly.
      return false;
    }
  };
  const getDefaultCalendarId = async () => {
    const defaultCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

    // Assuming the first calendar is the default, you might want to improve this logic
    return defaultCalendars.length !== 0 ? defaultCalendars[0].id : null;
  };

  const addEventToCalendar = async (event) => {
    const calendarId = await getDefaultCalendarId();
    if (calendarId && (await getCalendarPermission())) {
      const eventDetails = {
        title: event.title,
        startDate: event.datetime.toDate(),
        endDate: new Date(event.datetime.toDate().getTime() + 60 * 60 * 1000), // Event duration (1 hour in this example)
        timeZone: 'GMT',
        location: event.location,
      };
  
       try {
      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      console.log(`Event added to calendar with ID: ${eventId}`);

      // Show a success message
      Alert.alert('Success', 'Event added to calendar successfully!');
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      // Show an error message
      Alert.alert('Error', 'Failed to add event to calendar. Please try again.');
    }
    }
  };

  const toggleButtons = () => {
    setShowDatePicker(!showDatePicker);
    setShowEventTypePicker(!showEventTypePicker);
  };

  const getDateString = (datetime) => {
    const day = datetime.getDate().toString().padStart(2, '0');
    const month = (datetime.getMonth() + 1).toString().padStart(2, '0'); // Note: Month is zero-based
    const year = datetime.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getTimeString = (datetime) => {
    const hours = datetime.getHours().toString().padStart(2, '0');
    const minutes = datetime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Events'));
        const eventsData = [];
        querySnapshot.forEach((doc) => {
          eventsData.push(doc.data());
        });
        setEventsFromDb(eventsData);
      } catch (error) {
        console.error('Error fetching events from the database:', error);
      }
    };

    fetchData();
  }, []);
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Filter events based on the search query
    const filtered = eventsFromDb.filter((event) =>
      event.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const handleRegionChange = (newRegion) => {
    // Calculate the circle radius based on the zoom level (latitudeDelta)
    const zoomLevel = 0.0922 / newRegion.latitudeDelta;
    let newImageRadius = 24 / zoomLevel;

    if (zoomLevel < 9.353108923406904) {
      newImageRadius = 16;
    } else if (zoomLevel > 9.353108923406904 && zoomLevel < 18) {
      newImageRadius = 18;
    } else if (zoomLevel > 18) {
      newImageRadius = 22;
    }

    setImageRadius(newImageRadius);
  };
  const openModal = (event) => {
    const eventsWithSameLocation = eventsFromDb.filter(
      (e) =>
        e.coordinates.latitude === event.coordinates.latitude &&
        e.coordinates.longitude === event.coordinates.longitude
    );
    setEventsAtSameLocation(eventsWithSameLocation);
    setCurrentIndex(eventsWithSameLocation.indexOf(event));
    setModalVisible(true);
    setModalVisible(true);
  };
  /**const addData = async () => {
    console.log("dodajam")
    try {
      // Use await inside the async function
      const docRef = await addDoc(collection(db, 'avents'), {
        first: 'Ada',
        last: 'Lovelace',
        born: 1815,
      });
  
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };*/
  const nextEvent = () => {
    if (eventsAtSameLocation.length > 0) {
      setCurrentIndex((currentIndex + 1) % eventsAtSameLocation.length);
    }
  };

  const prevEvent = () => {
    if (eventsAtSameLocation.length > 0) {
      setCurrentIndex(
        (currentIndex - 1 + eventsAtSameLocation.length) %
          eventsAtSameLocation.length
      );
    }
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    // You can add additional logic here based on the selected type
  };

  const handleContainerPress = () => {
    Keyboard.dismiss();
  };
  
  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        style={isDarkMode ? 'light' : 'dark'}
    />
    <TouchableWithoutFeedback onPress={handleContainerPress}>
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.0569,
          longitude: 14.5058,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={isDarkMode ? customMapDark : customMap}
        onRegionChange={handleRegionChange}
      >   
          {eventsFromDb
          .filter(event => selectedType === 'All' || event.type === selectedType)
          .map((event, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: event.coordinates.latitude, longitude: event.coordinates.longitude }}
            onPress={() => openModal(event)}
          >
            <View style={{
              width: imageRadius * 2,
              height: imageRadius * 2,
              borderRadius: imageRadius,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image
                source={{uri: event.image}}
                style={{
                  width: imageRadius * 2,
                  height: imageRadius * 2,
                  borderRadius: imageRadius,
                }}
              />
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={styles.header}>
      <LinearGradient
                style={styles.topGradient}
                colors={['transparent','black']} // You can adjust the colors as needed
                start={{ x: 0, y: 1 }} // This makes the gradient go from bottom to top
                end={{ x: 0, y: 0 }}
              />
        <View style={styles.headerLine}>
              <Image
                source= {require('../Images/images.png')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                }}
              />
          <TextInput
            style={isDarkMode ? styles.darksearchBar : styles.searchBar}
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
              style={styles.settingButton}
              onPress={() => navigation.navigate('SettingsScreen')}
          >
            <AntDesign name="setting" size={24} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.toggleButton}>
        <TouchableOpacity
          onPress={toggleButtons}
        >
          <Entypo name={showDatePicker ? 'chevron-down' : 'chevron-up'} size={40} color={isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>
        {showDatePicker && (
          <>          
          <Animated.View
          style={[
            styles.datePicker,
            {
              transform: [{ translateY: datePickerY }],
            },
          ]}
          >
          
          </Animated.View>
          </>
        )}
        {searchQuery !== '' && (
        <View style={styles.searchResultView}>
          {filteredEvents.length > 0 ? (
            <ScrollView
              style={isDarkMode ? styles.darksearchResults : styles.searchResults}
              maxHeight={170}
            >
              {filteredEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => openModal(event)}
                  style={styles.searchline}
                > 
                  <Image
                    source={{ uri: event.image }}
                    style={styles.searchImage}
                  />
                  <View>
                    <Text style={styles.searchResultText}>
                      {event.title}
                    </Text>
                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.searchDetails}>
                        {getDateString(event.datetime.toDate())}{', '}
                      </Text>
                      <Text style={styles.searchDetails}>
                        {event.location}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={ isDarkMode ? styles.darknoEventsText : styles.noEventsText}>No events found.</Text>
          )}
          <TouchableOpacity
            style={styles.closeResults}
            onPress={() => {
              setSearchQuery(''); // Set searchQuery to an empty string
              prevEvent(); // Call prevEvent function
            }}
          >
            <AntDesign name="closecircle" size={29} color={"white"} />
          </TouchableOpacity>
        </View>
      )}
        {showEventTypePicker && (
          <Animated.View
          style={[
            styles.typePicker,
            {
              transform: [{ translateY: eventTypePickerY }],
            },
          ]}
        >
            <EventType onSelect={handleTypeSelect} selectedType={selectedType} />
          </Animated.View>
        )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >{eventsAtSameLocation.length > 0 && (
        <View style={styles.modalContainer}>
          <View style={isDarkMode ? styles.darkmodalContent : styles.modalContent}>
            <Image
              source={{ uri: eventsAtSameLocation[currentIndex].image }}
              style={styles.modalImage}
            />
              <LinearGradient
                style={styles.modalGradient}
                colors={gradientColors} // You can adjust the colors as needed
                start={{ x: 0, y: 1 }} // This makes the gradient go from bottom to top
                end={{ x: 0, y: 0 }}
              />
            {eventsAtSameLocation.length > 1 && (
                <View style={styles.prevnext}>
                  <TouchableOpacity
                    style={styles.prevButton}
                    onPress={prevEvent}
                  >
                    <AntDesign name="left" size={29} color={isDarkMode ? "white" : "black"}   />
                  </TouchableOpacity>
                  <MaterialCommunityIcons name="cards" size={29} color={isDarkMode ? "white" : "black"} />
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={nextEvent}
                  >
                    <AntDesign name="right" size={29} color={isDarkMode ? "white" : "black"} />
                  </TouchableOpacity>
                </View>
              )}
            <Text style={isDarkMode ? styles.darkmodalTitle : styles.modalTitle}>
              {eventsAtSameLocation[currentIndex].title}
            </Text>
            <View style={{flexDirection:'row', alignItems:'center', top:10, justifyContent:'space-between'}}>
              <View style={{alignItems:'center', justifyContent:'center', width:"33%"}}>
                <Entypo name="location" size={25} color={isDarkMode ? "white" : "black"} />
                <Text style={isDarkMode ? styles.darkmodalDetails : styles.modalDetails}>
                  {eventsAtSameLocation[currentIndex].location}{' '}
                </Text>
              </View>
              <View style={isDarkMode ? styles.darkline : styles.lightline } />
                <View style={{alignItems:'center', justifyContent:'center', width:"33%"}}>
                  <Entypo name="calendar" size={25} color={isDarkMode ? "white" : "black"} />
                  <Text style={isDarkMode ? styles.darkmodalDetails : styles.modalDetails}>
                  {getDateString(eventsAtSameLocation[currentIndex].datetime.toDate())}{' '}
                  </Text>
                </View>
                <View style={isDarkMode ? styles.darkline : styles.lightline } />
                <View style={{alignItems:'center', justifyContent:'center', width:"33%"}}>
                  <Entypo name="clock" size={25} color={isDarkMode ? "white" : "black"} />
                  <Text style={isDarkMode ? styles.darkmodalDetails : styles.modalDetails}>
                  {getTimeString(eventsAtSameLocation[currentIndex].datetime.toDate())}{' '}
                  </Text>
                </View>
            </View>
            <ScrollView style={styles.descriptionScrollView} maxHeight={115}>
              <Text style={isDarkMode ? styles.darkmodalDescription :styles.modalDescription}>
                {eventsAtSameLocation[currentIndex].description}
              </Text>
            </ScrollView>
            <View style={styles.modalButtons}>
            <TouchableOpacity
                style={isDarkMode ? styles.darkcloseButton : styles.closeButton}
                onPress={() => {
                  setEventsAtSameLocation([]); // Clear the list of events with the same coordinates
                  setCurrentIndex(0); // Reset the index
                  setModalVisible(false);
                }}
              >
              <Entypo name="chevron-left" size={35} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  addEventToCalendar(eventsAtSameLocation[currentIndex]); // Call the function when the button is pressed
                }}
                style={isDarkMode ? styles.darkaddButton : styles.addButton}
              >
                <View style={styles.addbuttonContent}>
                  <FontAwesome5 name="calendar-plus" size={27} color={isDarkMode ? "white" : "black"} />
                </View>
              </TouchableOpacity>
          </View>
          </View>
        </View>
      )}
      </Modal>
    </View>
    </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height:"100%",
    flex: 1,
  },
  topGradient:{
    position: 'absolute',
    width: '100%',
    height: '50%',
    opacity:0.7
  },
  header:{
    width:"100%",
    top:0,
    //backgroundColor: "rgba(255,255,255, 0.8)",
    position: 'absolute',
    borderBottomLeftRadius:30,
    borderBottomRightRadius:30,
    height:"13%",
  },
  map: {
    flex: 1,
  },
  customMarkerImage: {
    width: 48,
    height: 48,
    borderRadius: 16.11597260646612,
  },
  descriptionScrollView: {
    marginTop:10,
    padding: 10, // Add padding for better readability
    borderRadius: 5, // Add some border radius for style
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },

  modalContent: {
    borderRadius:100,
    flex: 0.96,
    width: "100%",
    backgroundColor: 'white',
    borderRadius: 15,
  },
  darkmodalContent: {
    borderRadius:100,
    flex: 0.96,
    width: "100%",
    backgroundColor: 'black',
    borderRadius: 15,
  },
  modalImage: {
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    width:"100%",
    height:"60%",
    resizeMode: 'cover'
  },
  modalTitle: {
    paddingLeft:15,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
  },
  darkmodalTitle: {
    color: "white",
    paddingLeft:15,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 5,
  },
  modalDetails: {
    paddingLeft:15,
    fontSize: 16,
    marginBottom: 5,
    fontWeight:"600"
  },
  darkmodalDetails: {
    color: "white",
    paddingLeft:15,
    fontSize: 16,
    marginBottom: 5,
    fontWeight:"600"
  },
  modalDescription: {
    paddingLeft:15,
    fontSize: 14,
    marginVertical: 10,
  },
  modalGradient: {
    position: 'absolute',
    width: '100%',
    height: '20%',
    top: '40%',
  },
  darkmodalDescription: {
    color: "white",
    paddingLeft:15,
    fontSize: 14,
    marginVertical: 10,
  },
  modalButtons: {
    marginTop:14,
    width:"75%",
    flexDirection: 'row',
    justifyContent:'space-between',
    alignSelf:'center',
  },
  addButton: {
    backgroundColor: "rgba(0,0,0, 0.04)",
    height:40,
    borderRadius: 40,
    width: 50,
    alignItems: 'center',
    justifyContent:'center',
  },
  closeButton: {
    backgroundColor: "rgba(0,0,0, 0.04)",
    justifyContent:'center',
    borderRadius: 35,
    width: 50,
    alignItems: 'center',
  },
  darkaddButton: {
    backgroundColor: "rgba(255,255,255, 0.1)",
    height:40,
    borderRadius: 40,
    width: 50,
    alignItems: 'center',
    justifyContent:'center',
  },
  darkcloseButton: {
    backgroundColor: "rgba(255,255,255, 0.1)",
    justifyContent:'center',
    borderRadius: 25,
    width: 50,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
  },
  prevnext: {
    width:"100%",
    position:'absolute',
    padding:10,
    paddingBottom:0,
    justifyContent: 'space-between',
    flexDirection:'row',
    marginBottom:5,
  },
  prevnextText:{
    fontWeight:'bold',
    fontSize: 17,
    color:'black',
  },
  headerLine: {
    marginHorizontal:"5%",
    marginTop: "10%",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: "white", // Set the background color to white
    borderRadius: 30,
    padding: 5,
    flex: 1, // Take up available space, pushing the settings button to the right
    maxWidth: "60%", // Limit the search bar width to 60% of available space
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Adjust the shadow opacity as needed
    shadowRadius: 2,
    elevation: 2, // On Android, use elevation for shadow
  },
  darksearchBar: {
    backgroundColor: "white", // Set the background color to white
    borderRadius: 30,
    padding: 5,
    flex: 1, // Take up available space, pushing the settings button to the right
    maxWidth: "60%", // Limit the search bar width to 60% of available space
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Adjust the shadow opacity as needed
    shadowRadius: 2,
    elevation: 2, // On Android, use elevation for shadow
  },
  searchResultView:{
    position:'absolute',
    marginTop:"20%",
    backgroundColor:"transparent",
    marginLeft:"15%",
    width: "70%",
    alignContent:'center',
  },
  searchImage:{
    marginRight:15,
    width:50,
    height:50,
    borderTopLeftRadius:10,
    borderBottomLeftRadius:10,
  },
  searchline:{
    flexDirection:'row', 
    alignItems:'center',
    width: "90%",
    marginLeft: "5%",
    marginTop:"5%",
    backgroundColor: "white",
    borderRadius:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Adjust the shadow opacity as needed
    shadowRadius: 2,
    elevation: 2, // On Android, use elevation for shadow
  },
  darksearchline:{
    flexDirection:'row', 
    alignItems:'center',
    width: "90%",
    marginLeft: "5%",
    marginTop:"5%",
    backgroundColor: "black",
    borderRadius:10,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Adjust the shadow opacity as needed
    shadowRadius: 2,
    elevation: 2, // On Android, use elevation for shadow
  },
  searchResultText:{
    fontSize:17,
    fontWeight: 'bold'
  },
  darksearchResultText:{
    fontSize:17,
    fontWeight: 'bold',
    color:"white",
  },
  closeResults:{
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    alignSelf:'center',
    backgroundColor:"black",
    borderRadius:20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Adjust the shadow opacity as needed
    shadowRadius: 2,
    elevation: 2, // On Android, use elevation for shadow
  },
  darkcloseResults:{
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    alignSelf:'center',
    backgroundColor:"white",
    borderRadius:30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Adjust the shadow opacity as needed
    shadowRadius: 2,
    elevation: 2, // On Android, use elevation for shadow
  },
  noEventsText:{
    fontSize:16,
    fontWeight:'bold',
    marginTop:"5%",
    marginBottom:"3%",
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    alignSelf:'center',
  },
  darknoEventsText:{
    color:"white",
    fontSize:16,
    fontWeight:'bold',
    marginTop:"5%",
    marginBottom:"3%",
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center',
    alignSelf:'center',
  },
  datePicker: {
    top:"60%",
    left:20,
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
  },
  typePicker: {
    top: "67%",
    left:20,
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
  },
  datesButton: {
    justifyContent:'center',
    alignItems:'center',
    height: 40,
    width: 40,
    borderRadius:25,
    backgroundColor: "rgba(0,0,0, 0.1)",
  },
  settingButton: {
  },
  toggleButton: {
    top: "86%",
    left:20,
    position:'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0, 0.1)',
  },
  typeText: {
    left:"40%",
    right:"40%",
    top:"12%",
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerModal:{

  }

});

export default MapScreen;
