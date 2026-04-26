import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Dimensions } from 'react-native';
import { collection, query, where, onSnapshot, addDoc } from "firebase/firestore";
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from "../../config/firebase";

interface Module {
  id: string;
  name: string;
  color: string;
  userId: string;
}

const { width } = Dimensions.get('window');
const CIRCLE_LENGTH = 800; // Length of the circle border
const R = CIRCLE_LENGTH / (2 * Math.PI); // Radius of the circle

export default function TimerScreen() {
  // States
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [goal, setGoal] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isGoalModalVisible, setGoalModalVisible] = useState(false);
  const [isModuleListVisible, setIsModuleListVisible] = useState(false); //  For Module Picker
  const [tempGoal, setTempGoal] = useState('');
  const [totalTime, setTotalTime] = useState(1500);
  const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [isReflectionModalVisible, setIsReflectionModalVisible] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const moods = ['😊', '😐', '😫', '😴'];

  const [userModules, setUserModules] = useState<Module[]>([]);

  // Function to change time from picker
  const selectTime = (mins: number) => {
    setCustomMinutes(mins);
    setSeconds(mins * 60);
    setTotalTime(mins * 60); 
    setIsTimeModalVisible(false);
    setIsActive(false); // Ensure it's paused when changing time
  };

  // Fetch Modules
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "modules"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || "Untitled",
        color: doc.data().color || "#FF71CE",
        userId: doc.data().userId
      })) as Module[];
      setUserModules(list);
      
    });
    return () => unsubscribe();
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      setIsReflectionModalVisible(true);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  //ssave session function

  const saveSession = async () => {

  if (!mood) return; // Don't save until they pick a mood



  try {

    await addDoc(collection(db, "sessions"), {

      userId: auth.currentUser?.uid,

      moduleName: selectedModule || "General",

      goal: goal || "No goal set",

      duration: totalTime / 60, // Minutes spent

      mood: mood,

      createdAt: Date.now(),

    });



    // Reset everything for the next round
    setIsReflectionModalVisible(false);
    setSeconds(totalTime); // Reset timer
    setGoal('');
    setMood(null);
    alert("Session Saved! Check your Dashboard.");
  } catch (error) {
    console.error("Error saving session:", error);
  }

};

  return (
    
    <View style={[styles.container, { backgroundColor: Colors.dark.background }]}>
      <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
        
        {/* for the qoute  */}
        <View style={styles.topHeader}>
          <Text style={{ color: 'white', opacity: 0.5 }}>Study Session</Text>
        </View>

        <Text style={styles.quote}>Focus on the goal, not the struggle</Text>

        {/* GOAL DISPLAY */}
        <View style={styles.goalContainer}>
          {goal ? (
            <TouchableOpacity onPress={() => setGoalModalVisible(true)} style={styles.goalDisplay}>
              <Text style={{ color: Colors.dark.textSecondary, fontSize: 12 }}>CURRENT GOAL</Text>
              <Text style={{ color: Colors.dark.primary, fontSize: 18, fontWeight: 'bold' }}>{goal}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.setGoalBtn} onPress={() => setGoalModalVisible(true)}>
              <Ionicons name="flag-outline" size={20} color={Colors.dark.primary} />
              <Text style={{ color: Colors.dark.primary, marginLeft: 8, fontWeight: '600' }}>Set a Goal</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* TIMER CIRCLE */}
        <View style={styles.timerContainer}>
          <Svg style={styles.svg}>
            <Circle cx={width / 2} cy={140} r={R} stroke="rgba(255,255,255,0.1)" strokeWidth={15} />
            <Circle
              cx={width / 2} cy={140} r={R}
              stroke={Colors.dark.primary}
              strokeWidth={15}
              strokeDasharray={CIRCLE_LENGTH}
              strokeDashoffset={CIRCLE_LENGTH * (1 - (seconds / totalTime))}
              strokeLinecap="round"
            />
          </Svg>
          <TouchableOpacity onPress={() => setIsTimeModalVisible(true)}>
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          </TouchableOpacity>
        </View>

        

   {/* MODULE PICKER */}
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.subjectPicker} 
            onPress={() => setIsModuleListVisible(true)}
          >
            <View style={[styles.dot, { backgroundColor: Colors.dark.primary }]} />
            <Text style={styles.subjectText}>
              {selectedModule || "Select Module"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* DYNAMIC BUTTONS */}
        <View style={styles.buttonContainer}>
          {/* Check against totalTime instead of 1500 so it works for all presets */}
          {!isActive && seconds === totalTime ? (
            <TouchableOpacity style={styles.mainStartBtn} onPress={() => setIsActive(true)}>
              <Text style={styles.startText}>START</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.activeButtonRow}>
              <TouchableOpacity 
                style={styles.pauseBtn} 
                onPress={() => setIsActive(!isActive)}
              >
                <Text style={styles.startText}>{isActive ? "PAUSE" : "RESUME"}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => { 
                  setIsActive(false); 
                  setSeconds(totalTime); 
                }}
              >
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* --- ALL MODALS --- */}

        {/* MODULE SELECTION LIST MODAL */}
        <Modal visible={isModuleListVisible} transparent animationType="fade" onRequestClose={() => setIsModuleListVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: Colors.dark.surface }]}>
              <Text style={[styles.modalHeader, { color: Colors.dark.text }]}>Your Modules</Text>
              {userModules.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: Colors.dark.border, flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => {
                    setSelectedModule(item.name);
                    setIsModuleListVisible(false);
                  }}
                >
                  <View style={[styles.dot, { backgroundColor: item.color, marginRight: 10 }]} />
                  <Text style={{ color: 'white', fontSize: 16 }}>{item.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setIsModuleListVisible(false)} style={{ marginTop: 15, alignSelf: 'center' }}>
                <Text style={{ color: Colors.dark.textSecondary }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* GOAL MODAL */}
        <Modal visible={isGoalModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: Colors.dark.surface }]}>
              <Text style={styles.modalHeader}>What is your goal?</Text>
              <TextInput 
                style={[styles.input, { color: 'white', borderBottomColor: Colors.dark.primary }]}
                placeholder="e.g. Solve 5 problems"
                placeholderTextColor="#999"
                onChangeText={setTempGoal}
                autoFocus
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity onPress={() => setGoalModalVisible(false)}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setGoal(tempGoal); setGoalModalVisible(false); }}>
                  <Text style={{ color: Colors.dark.primary, fontWeight: 'bold' }}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* TIME PICKER MODAL */}
        <Modal visible={isTimeModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: Colors.dark.surface }]}>
              <Text style={[styles.modalHeader, { color: Colors.dark.text }]}>Set Timer</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
                {[1, 25, 45, 60].map((time) => (
                  <TouchableOpacity 
                    key={time}
                    onPress={() => selectTime(time)}
                    style={{
                      backgroundColor: customMinutes === time ? Colors.dark.primary : Colors.dark.border,
                      padding: 10, borderRadius: 10, width: 50, alignItems: 'center'
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={() => setIsTimeModalVisible(false)} style={{ alignSelf: 'center' }}>
                <Text style={{ color: Colors.dark.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* REFLECTION MODAL */}
        <Modal visible={isReflectionModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: Colors.dark.surface, alignItems: 'center' }]}>
              <Text style={[styles.modalTitle, { color: Colors.dark.text }]}>Session Complete!</Text>
              <Text style={{ color: Colors.dark.textSecondary, marginBottom: 20 }}>How do you feel about your progress?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 30 }}>
                {moods.map((m) => (
                  <TouchableOpacity 
                    key={m} 
                    onPress={() => setMood(m)}
                    style={{ 
                      padding: 10, borderRadius: 15, 
                      backgroundColor: mood === m ? Colors.dark.primary : 'transparent',
                      borderWidth: 1, borderColor: Colors.dark.border
                    }}
                  >
                    <Text style={{ fontSize: 30 }}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity 
                style={[styles.saveBtn, { width: '100%', backgroundColor: mood ? Colors.dark.primary : '#555' }]} 
                onPress={saveSession}
                disabled={!mood}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Complete Reflection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1135' },
  topHeader: { width: '100%', alignItems: 'flex-end', paddingRight: 20, paddingTop: 10 },
  toggleContainer: { borderWidth: 2, borderColor: 'white', borderRadius: 20, padding: 5, width: 60, alignItems: 'center' },
  quote: { color: 'white', fontSize: 16, marginVertical: 30, opacity: 0.9 },
  timerContainer: {
    width: width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  timerText: { fontSize: 80, color: 'white', fontWeight: 'bold', top: -10 },
  presetRow: { flexDirection: 'row', gap: 15, marginBottom: 40 },
  presetBtn: { backgroundColor: '#332950', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  activePreset: { backgroundColor: '#FF71CE' },
  presetText: { color: 'white', fontWeight: '600' },
  inputGroup: { width: '85%', gap: 15, marginBottom: 40 },
  darkSelector: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderRadius: 15,
    alignItems: 'center'
  },
  
  headerRow: {
    width: '100%',
    paddingHorizontal: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  subjectPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  subjectText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // The background color is set dynamically in the View, 
    
  },

  darkSelectorText: { color: 'white', fontSize: 16 },
  buttonContainer: { width: '100%', alignItems: 'center', marginTop: 'auto', marginBottom: 100 },
  mainStartBtn: { backgroundColor: '#FF71CE', paddingVertical: 18, paddingHorizontal: 80, borderRadius: 35 },
  activeButtonRow: { flexDirection: 'row', gap: 20 },
  pauseBtn: { backgroundColor: '#FF71CE', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  cancelBtn: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#FF71CE', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  startText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
  cancelText: { color: '#FF71CE', fontWeight: 'bold', fontSize: 18 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#2A1E45', padding: 30, borderRadius: 25, width: '85%', alignItems: 'center' },
  modalHeader: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 2, borderBottomColor: '#FF71CE', color: 'white', width: '100%', padding: 10, marginBottom: 30, textAlign: 'center' },
  saveBtn: { backgroundColor: '#FF71CE', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 15 },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },

  goalContainer: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    height: 60, 
    justifyContent: 'center',
  },
  goalDisplay: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,113,206,0.2)', 
  },
  setGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
 
});