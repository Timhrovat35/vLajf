import React, { useEffect, useState, useRef } from 'react';
import { Image, Modal, StyleSheet, Text,Keyboard,  PanResponder ,Animated, Easing, TouchableOpacity, View, PermissionsAndroid, ScrollView, TextInput, TouchableWithoutFeedback,  } from 'react-native';
import ReactNativeCalendarEvents from 'react-native-calendar-events';
import MapView, { Marker } from 'react-native-maps';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import EventType from '../Components/EventType';
import { useTheme } from '../Components/ThemeContext';
import { MotiView } from 'moti';


const Logo = require('../Images/images.png');
const customMap = require('../customMap.json');
const customMapDark = require('../customMapDark.json')

const MapScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageRadius, setImageRadius] = useState(16);
  const navigation = useNavigation(); // Initialize the navigation hook
  const [calendarPermission, setCalendarPermission] = useState(false);
  const eventList = require('../eventList.json'); // Import the event list
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event
  const [eventsAtSameLocation, setEventsAtSameLocation] = useState([]); // State to store events with the same coordinates
  const [currentIndex, setCurrentIndex] = useState(0); // Index to track the currently displayed event
  const [selectedType, setSelectedType] = useState('All');
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEventTypePicker, setShowEventTypePicker] = useState(false);
  const datePickerY = useRef(new Animated.Value(0)).current;
  const eventTypePickerY = useRef(new Animated.Value(0)).current;

  const toggleButtons = () => {
    setShowDatePicker(!showDatePicker);
    setShowEventTypePicker(!showEventTypePicker);
  };

  useEffect(() => {
    checkCalendarPermission();
    Animated.timing(datePickerY, {
      toValue: showDatePicker ? 0 : 70,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();

    // Animate eventTypePicker when showDatePicker changes
    Animated.timing(eventTypePickerY, {
      toValue: showDatePicker ? 0 : 70,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [showDatePicker]);

   const checkCalendarPermission = async () => {
    try {
      const status = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_CALENDAR
      );

      setCalendarPermission(status === PermissionsAndroid.RESULTS.GRANTED);

      if (status !== PermissionsAndroid.RESULTS.GRANTED) {
        // Permission is not granted, request it
        const permissionStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALENDAR
        );

        if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission granted, you can now use the calendar
          setCalendarPermission(true);
        }
      }
    } catch (err) {
      console.error('Error checking calendar permission:', err);
    }
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

  const addToCalendar = async () => {
    if (!calendarPermission) {
      console.error('Calendar permission not granted.');
      return;
    }
  
    try {
      const startDate = new Date().getFullYear(); // Replace with your event start date
      const endDate = new Date().getFullYear();   // Replace with your event end date
      const eventDetails = {
        title: 'Event Title',      // Replace with your event title
        location: 'Event Location', // Replace with your event location
        notes: 'Event Description', // Replace with your event description
      };
      console.log(startDate,endDate,eventDetails)
      await ReactNativeCalendarEvents.saveEvent(eventDetails.title, {
        startDate,
        endDate,
        details: eventDetails, // Ensure that 'details' is defined
      });
  
      console.log('Event added to the calendar!');
    } catch (error) {
      console.error('Error adding event to the calendar:', error);
    }
  };

  const openModal = (event) => {
    const eventsWithSameLocation = eventList.filter(
      (e) =>
        e.coordinates.latitude === event.coordinates.latitude &&
        e.coordinates.longitude === event.coordinates.longitude
    );
    setEventsAtSameLocation(eventsWithSameLocation);
    setCurrentIndex(eventsWithSameLocation.indexOf(event));
    setModalVisible(true);
    setModalVisible(true);
  };
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
          {eventList
          .filter(event => selectedType === 'All' || event.type === selectedType)
          .map((event, index) => (
          <Marker
            key={index}
            coordinate={event.coordinates} // Replace with the coordinates from your eventList
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
            <TouchableOpacity
              style={styles.datesButton}
              /* Add your date picker logic here */
            >
              <MaterialIcons name="date-range" size={27} color={isDarkMode ? 'white' : 'black'} />
            </TouchableOpacity>
          </Animated.View>
          </>
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
            <Image
              source={{ uri: eventsAtSameLocation[currentIndex].image }}
              style={styles.modalImage}
            />
            <Text style={isDarkMode ? styles.darkmodalTitle : styles.modalTitle}>
              {eventsAtSameLocation[currentIndex].title}
            </Text>
            <Text style={isDarkMode ? styles.darkmodalDetails : styles.modalDetails}>
              {eventsAtSameLocation[currentIndex].location},{' '}
              {eventsAtSameLocation[currentIndex].startDate} ob{' '}
              {eventsAtSameLocation[currentIndex].startTime}
            </Text>
            <ScrollView style={styles.descriptionScrollView} maxHeight={502}>
              <Text style={isDarkMode ? styles.darkmodalDescription :styles.modalDescription}>
                {eventsAtSameLocation[currentIndex].description}
              </Text>
            </ScrollView>
          </View>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={addToCalendar}
            >
              <View style={styles.addbuttonContent}>
                <Text style={styles.modalButtonText}>Add to </Text>
                <AntDesign name="calendar" size={19} color={"white"} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setEventsAtSameLocation([]); // Clear the list of events with the same coordinates
                setCurrentIndex(0); // Reset the index
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      </Modal>
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    maxHeight: 502, // Set the maximum height for the ScrollView
    padding: 10, // Add padding for better readability
    borderRadius: 5, // Add some border radius for style
    marginBottom:20,
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },

  modalContent: {
    borderRadius:100,
    flex: 0.85,
    width: "100%",
    backgroundColor: 'white',
    borderRadius: 15,
  },
  darkmodalContent: {
    borderRadius:100,
    flex: 0.85,
    width: "100%",
    backgroundColor: 'black',
    borderRadius: 15,
  },
  modalImage: {
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    width: "100%",
    height: "40%",
  },
  modalTitle: {
    paddingLeft:15,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  darkmodalTitle: {
    color: "white",
    paddingLeft:15,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalDetails: {
    paddingLeft:15,
    fontSize: 16,
    marginBottom: 5,
  },
  darkmodalDetails: {
    color: "white",
    paddingLeft:15,
    fontSize: 16,
    marginBottom: 5,
  },
  modalDescription: {
    paddingLeft:15,
    fontSize: 14,
    marginVertical: 10,
  },
  darkmodalDescription: {
    color: "white",
    paddingLeft:15,
    fontSize: 14,
    marginVertical: 10,
  },
  modalButtons: {
    width:"75%",
    flexDirection: 'row',
    justifyContent:'space-between',
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: '#8ACB88',
    padding: 10,
    height:40,
    borderRadius: 5,
    width: 90,
    alignItems: 'center',
    justifyContent:'space-between',
  },
  addbuttonContent:{
    flexDirection: 'row',
  },
  closeButton: {
    backgroundColor: '#575761',
    padding: 10,
    borderRadius: 5,
    width: 90,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
  },
  prevnext: {
    width:"100%",
    padding:10,
    justifyContent: 'space-between',
    flexDirection:'row',
    marginBottom:10,
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

});

export default MapScreen;
