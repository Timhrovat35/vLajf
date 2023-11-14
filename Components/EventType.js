import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
    MaterialCommunityIcons,
    Ionicons,
    withSequence,
  } from '@expo/vector-icons';
  import Animated, { Easing, useSharedValue, withSpring, useAnimatedStyle,withRepeat } from 'react-native-reanimated';
import { MotiView } from 'moti';

const EventType = ({ onSelect, selectedType }) => {
    return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, selectedType === 'All' && styles.selectedButton]}
        onPress={() => onSelect('All')}
      >
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: selectedType === 'All' ? 1.2 : 1 }}
          transition={{ type: 'spring' }}
        >
          <Text style={styles.buttonText}>All</Text>
        </MotiView>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selectedType === 'Sports' && styles.selectedButton]}
        onPress={() => onSelect('Sports')}
      >
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: selectedType === 'Sports' ? 1.2 : 1 }}
          transition={{ type: 'spring' }}
        >
          <Ionicons name="football-sharp" size={24} color={selectedType === 'Sports' ? 'red' : 'black'} />
        </MotiView>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selectedType === 'Party' && styles.selectedButton]}
        onPress={() => onSelect('Party')}
      >
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: selectedType === 'Party' ? 1.2 : 1 }}
          transition={{ type: 'spring' }}
        >
          <MaterialCommunityIcons name="party-popper" size={24} color={selectedType === 'Party' ? 'red' : 'black'}/>
        </MotiView>
      </TouchableOpacity>
    </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    width:40,
    justifyContent: 'space-between',
    backgroundColor: "rgba(0,0,0, 0.1)",
    borderRadius: 30,
    paddingVertical: 8,
  },
  button: {
    paddingVertical: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedButton:{
    color: "red",
  }
  
});

export default EventType;
