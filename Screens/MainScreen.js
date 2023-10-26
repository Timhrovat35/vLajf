import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, ScrollView } from 'react-native';
import ReactNativeCalendarEvents from 'react-native-calendar-events';
import MapView, { Marker } from 'react-native-maps';
import { AntDesign } from '@expo/vector-icons'; 


const customMarkerImage = require('../Images/LatinDanceNight.jpg');
const customMap = require('../customMap.json');

const MapScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageRadius, setImageRadius] = useState(16);
  const [calendarPermission, setCalendarPermission] = useState(false);
  const eventList = require('../eventList.json'); // Import the event list
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event

  useEffect(() => {
    checkCalendarPermission();
  }, []);

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
    setSelectedEvent(event);
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 46.0569,
          longitude: 14.5058,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={customMap}
        onRegionChange={handleRegionChange}
      >
          {eventList.map((event, index) => (
          <Marker
            key={index}
            coordinate={event.coordinates} // Replace with the coordinates from your eventList
            onPress={() => openModal(event)}
          >
            <View style={{
              width: imageRadius * 2,
              height: imageRadius * 2,
              borderRadius: imageRadius,
              backgroundColor: 'red',
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >{selectedEvent && ( // Check if a selected event exists
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={{uri: selectedEvent.image}}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
              <Text style={styles.modalDetails}>{selectedEvent.location}, {selectedEvent.startDate} ob {selectedEvent.startTime} </Text>
              <ScrollView style={styles.descriptionScrollView} maxHeight={502}>
                <Text style={styles.modalDescription}>
                  {selectedEvent.description}
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
                  <AntDesign name="calendar" size={19} color="white" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setSelectedEvent(null); // Clear the selected event
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -5 }, // Adjust the values as needed
    shadowOpacity: 0.3, // Adjust the opacity as needed
    shadowRadius: 5, // Adjust the shadow radius as needed
    elevation: 5, // For Android

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
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContent: {
    marginTop:"20%",
    borderRadius:100,
    flex: 0.85,
    width: "100%",
    backgroundColor: 'white',
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
  modalDetails: {
    paddingLeft:15,
    fontSize: 16,
    marginBottom: 5,
  },
  modalDescription: {
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
});

export default MapScreen;