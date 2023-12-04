import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header, Icon } from 'react-native-elements';
import { MotiView, SafeAreaView } from 'moti';
import { Ionicons, AntDesign, MaterialIcons  } from '@expo/vector-icons'; 


const SettingsScreen = () => {
  const navigation = useNavigation();
  const [selectedView, setSelectedView] = useState('visual'); // Initial selected view

  const handleBack = () => {
    navigation.goBack();
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
    // You can add logic here to navigate or render different views based on the selected view
  };

  return (
    <SafeAreaView style={{backgroundColor:"white"}}>
    <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Home</Text>
    </View>
    <View style={{flexDirection:'row', height: "100%",marginTop:10}}>
      <View style={{ flexDirection: 'column', padding: 5, height: "100%",marginHorizontal:10, marginTop:20 }}>
        <TouchableOpacity onPress={() => handleViewChange('visual')}>
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: selectedView === 'visual' ? 1.2 : 1 }}
          transition={{ type: 'spring' }}
        >
            <MaterialIcons name="design-services" size={26} style={{color: selectedView === 'visual' ? 'blue' : 'black',marginTop:30, marginBottom: 20}} />
        </MotiView>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleViewChange('notification')}>
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: selectedView === 'notification' ? 1.2 : 1 }}
          transition={{ type: 'spring' }}
        >
            <Ionicons name="notifications-outline" size={26}  style={{color: selectedView === 'notification' ? 'blue' : 'black', marginBottom: 20 }}/>
        </MotiView>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleViewChange('terms')}>
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: selectedView === 'terms' ? 1.2 : 1 }}
          transition={{ type: 'spring' }}
        >
            <AntDesign name="filetext1" size={26} style={{color: selectedView === 'terms' ? 'blue' : 'black', marginBottom: 12 }} />
        </MotiView>
        </TouchableOpacity>
      </View>

      {/* Render different views based on the selectedView state */}
      {selectedView === 'visual' && <VisualView />}
      {selectedView === 'notification' && <NotificationView />}
      {selectedView === 'terms' && <TermsView />}
    </View>
    </SafeAreaView>
  );
};

const VisualView = () => (
    <View style={styles.contentView}>
        <Text style={styles.contentHeaderText}>Default settings</Text>
      <View style={styles.contentLine} />
    </View>
);

const NotificationView = () => (
    <View style={styles.contentView}>
    <Text style={styles.contentHeaderText}>Notifications setttings</Text>
    <View style={styles.contentLine} />
  </View>
);

const TermsView = () => (
    <View style={styles.contentView}>
    <Text style={styles.contentHeaderText}>Terms of use</Text>
    <View style={styles.contentLine} />
  </View>
);

const styles = {
    header: {
      paddingTop: 50,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white', // Set your desired header background color
      padding: 10,
    },
    backButton: {
      marginRight: 10,
    },
    headerText: {
      color: 'black', // Set your desired header text color
      fontSize: 20,
    }, 
    contentView: {
      paddingRight: "15%",
        width:"90%",
        alignItems: 'center',
        marginTop: 5,
      },
      contentHeaderText: {
        fontSize: 15,
      },
      contentLine: {
        width: 100,
        height: 2,
        backgroundColor: 'blue',
        marginTop: 10,
      },


  };

export default SettingsScreen;