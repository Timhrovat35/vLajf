import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header, Icon } from 'react-native-elements';
import { MotiView, SafeAreaView, ScrollView } from 'moti';
import { Ionicons, AntDesign, MaterialIcons, FontAwesome  } from '@expo/vector-icons'; 
import { Switch } from 'react-native';
import { useTheme } from '../Components/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { height } from 'react-native-daterange-picker/src/modules';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [selectedView, setSelectedView] = useState('visual'); // Initial selected view

  const handleBack = () => {
    navigation.goBack();
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
    // You can add logic here to navigate or render different views based on the selected view
  };

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        style={isDarkMode ? 'light' : 'dark'}
    />
    <SafeAreaView style={isDarkMode ? styles.darkView : styles.normalView}>
    <View style={isDarkMode ? styles.darkheader : styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={ isDarkMode ? 'white' : 'black'} />
        </TouchableOpacity>
        <Text style={isDarkMode ? styles.darkheaderText : styles.headerText}>Home</Text>
    </View>
    <View style={{flexDirection:'row', height: "100%",marginTop:10}}>
      <View style={{ flexDirection: 'column', padding: 5, height: "100%", width:"10%",alignContent:'center',alignItems:'center'}}>
        <TouchableOpacity onPress={() => handleViewChange('visual')}>
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: selectedView === 'visual' ? 1.2 : 1 }}
          transition={{ type: 'spring' }}
        >
            <MaterialIcons name="design-services" size={26} style={{color: selectedView === 'visual' ? 'blue' : isDarkMode ? 'white' : 'black',marginTop:30, marginBottom: 20}} />
        </MotiView>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => handleViewChange('terms')}>
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: selectedView === 'terms' ? 1.2 : 1 }}
          transition={{ type: 'spring' }}
        >
            <AntDesign name="filetext1" size={26} style={{color: selectedView === 'terms' ? 'blue' : isDarkMode ? 'white' : 'black', marginBottom: 12 }} />
        </MotiView>
        </TouchableOpacity>
      </View>

      {/* Render different views based on the selectedView state */}
      {selectedView === 'visual' && <VisualView />}
      {selectedView === 'notification' && <NotificationView />}
      {selectedView === 'terms' && <TermsView />}
    </View>
  </ SafeAreaView>
  </>
  );
};


const VisualView = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <View style={styles.contentView}>
      <Text style={isDarkMode ? styles.darkcontentHeaderText : styles.contentHeaderText}>Default settings</Text>
      <View style={styles.contentLine} />
      {/* Add the switch for dark mode */}
      <View style={{flexDirection: "row", width: "90%", alignItems: 'center', paddingLeft: 10, justifyContent:'space-between'}}>
        <View style={{flexDirection:"row",alignItems: 'center'}}>
          <Ionicons name="moon" size={24} color={isDarkMode ? '#FFC75F' : '#C1C1C1'} style={{marginRight: 10,}} />
          <Text style={isDarkMode ? styles.darkswitchtext : styles.switchtext}>Dark mode</Text>
        </View>
          <Switch
          style={{marginRight:10}}
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          thumbColor={isDarkMode ? 'white' : '#C1C1C1'}
          trackColor={{ false: 'gray', true: 'lightgray' }}
           />
      </View>
    </View>
  );
};

const NotificationView = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <View style={styles.contentView}>
    <Text style={isDarkMode ? styles.darkcontentHeaderText : styles.contentHeaderText}>Notifications setttings</Text>
    <View style={styles.contentLine} />
  </View>
  );
  };

const TermsView = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <View style={styles.contentView}>
    <Text style={isDarkMode ? styles.darkcontentHeaderText : styles.contentHeaderText}>Terms of use</Text>
    <View style={styles.contentLine} />

    <ScrollView maxHeight={"80%"} style={{paddingHorizontal:20, marginTop:10}}>
        <Text style={ isDarkMode ? styles.darktitletext : styles.titletext}>
              1. Use of the App
        </Text>
        <Text style={isDarkMode ? styles.darktermstext : styles.termstext}>
        a. Search for Events: vLjaf allows users to search for events on a map without the need for user accounts or logins.
        {'\n'}
        b. No User Accounts: The App does not require users to create accounts or log in.
        </Text>
        <Text style={ isDarkMode ? styles.darktitletext : styles.titletext}>
        2. User Conduct
        </Text>
        <Text style={isDarkMode ? styles.darktermstext : styles.termstext}>
        a. Responsible Use: Users are expected to use the App responsibly and adhere to any guidelines provided within the App.
        {'\n'}
        b. No Unauthorized Access: Users shall not attempt to gain unauthorized access to any part of the App or its related systems.
        </Text>
        <Text style={ isDarkMode ? styles.darktitletext : styles.titletext}>
        3. Intellectual Property
        </Text>
        <Text style={isDarkMode ? styles.darktermstext : styles.termstext}>
        a. Ownership: The App and its content, including but not limited to text, images, and logos, are owned by [Your Company Name] and are protected by intellectual property laws.
        {'\n'}
        b. License: Users are granted a limited, non-exclusive, non-transferable license to use the App for its intended purpose.
        </Text>
        <Text style={ isDarkMode ? styles.darktitletext : styles.titletext}>
        4. Privacy
        </Text>
        <Text style={isDarkMode ? styles.darktermstext : styles.termstext}>
        a. No Personal Information: The App does not collect or store personal information about users.
        </Text>
        <Text style={ isDarkMode ? styles.darktitletext : styles.titletext}>
        5. Limitation of Liability
        </Text>
        <Text style={isDarkMode ? styles.darktermstext : styles.termstext}>
        a. No Liability: vLajf shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of the App.
        </Text>
        <Text style={ isDarkMode ? styles.darktitletext : styles.titletext}>
        6. Changes to Terms
        </Text>
        <Text style={isDarkMode ? styles.darktermstext : styles.termstext}>
        a. Modification: vLjaf reserves the right to modify or replace these Terms at any time. Your continued use of the App constitutes acceptance of any changes.
        </Text>
    </ScrollView>
  </View>
  );
  };

const styles = {
  darkView:{
    backgroundColor: "black",
  },
  normalView: {
    backgroundColor: "white",
  },
    header: {
      paddingTop: "12%",
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white', // Set your desired header background color
      padding: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, // This is for Android
    },
    darkheader:{
      paddingTop: "10%",
      width: "100%",
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'black', // Set your desired header background color
      padding: 10,
      shadowColor: "#fff",
      shadowOffset: {
        width: 1,
        height: 4.3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 5, // This is for Android
    },
    headerText: { // Set your desired header text color
      fontSize: 20,
    }, 
    darkheaderText: { // Set your desired header text color
      color: "white",
      fontSize: 20,
    }, 
    backButton: {
      marginRight: 10,
    },
    contentView: {
        width:"90%",
        alignItems: 'center',
        marginTop: 5,
      },
      contentHeaderText: {
        fontSize: 16,
        fontWeight:'bold'
      },
      darkcontentHeaderText: {
        color: "white",
        fontSize: 16,
        fontWeight:'bold'
      },
      contentLine: {
        width: 100,
        height: 2,
        backgroundColor: 'blue',
        marginTop: 10,
      },
      darkswitchtext:{
        color: "white",
      },
      titletext:{
        fontWeight: 'bold',
        fontSize:18,
      },
      darktitletext:{
        fontWeight: 'bold',
        fontSize:18,
        color:"white"
      },
      termstext:{
        marginTop:5,
        fontSize:15,
        marginBottom:10
      },
      darktermstext:{
        marginTop:5,
        fontSize:15,
        marginBottom:10,
        color:"white",
      }
  };

export default SettingsScreen;