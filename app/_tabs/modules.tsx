import { Ionicons } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ModuleCard from "../../components/modules/ModuleCard";
import { useTheme } from "../../context/ThemeContext";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { auth, db } from "../../config/firebase";

interface Module {
  id: string;
  name: string;
  color: string;
}

export default function ModulesScreen() {
  const [modules, setModules] = useState<Module[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const user = auth.currentUser;
  if (!user) return;
  const q = query(
    collection(db, "modules"),
    where("userId", "==", user.uid) // Only fetch modules where userId matches the logged-in user
  );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseModules = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        color: doc.data().color || "#FF71CE",
      }));
      setModules(firebaseModules);
    });

    return () => unsubscribe();
  }, []);

  // THE SAVE FUNCTION
  const addModule = async () => {
    if (newModuleName.trim().length > 0) {
      try {
        await addDoc(collection(db, "modules"), {
          name: newModuleName,
          color: "#FF71CE",
          userId: auth.currentUser?.uid,
          createdAt: Date.now(),
        });
        setNewModuleName("");
        setModalVisible(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  //  Remove from Firebase
const deleteModule = async (id: string) => {
  try {
    await deleteDoc(doc(db, "modules", id));
    setEditModalVisible(false);
  } catch (error) {
    console.error("Delete error:", error);
  }
};

// Change the name in Firebase
const updateModule = async () => {
  if (editingModule && editName.trim().length > 0) {
    try {
      await updateDoc(doc(db, "modules", editingModule.id), {
        name: editName
      });
      setEditModalVisible(false);
      setEditingModule(null);
    } catch (error) {
      console.error("Update error:", error);
    }
  }
};

  return (
    <View style={[styles.container, { backgroundColor:  theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Modules</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={[styles.addText, { color: theme.primary }]}>Add +</Text>
        </TouchableOpacity>
      </View>

      <FlatList
  data={modules}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <ModuleCard 
      name={item.name} 
      color={item.color} 
      onPress={() => {
        setEditingModule(item);
        setEditName(item.name);
        setEditModalVisible(true);
      }} 
    />
  )}
/>
      {/* ADD MODULE MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
      <Text style={[styles.modalTitle, { color: theme.text }]}>
        New Module
      </Text>
      <TextInput
        style={[
          styles.input, 
          { color: theme.text, borderBottomColor: theme.border }
        ]}
        placeholder="Module Name"
        placeholderTextColor={theme.textSecondary}
        value={newModuleName}
        onChangeText={setNewModuleName}
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={{ color: theme.textSecondary }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addModule}>
          <Text style={{ color: theme.primary, fontWeight: "bold" }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      {/* THE EDIT MODAL */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Module</Text>
            
            <TextInput 
              style={[styles.input, { color: theme.text, borderBottomColor: theme.border}]}
              value={editName}
              onChangeText={setEditName}
              placeholderTextColor={theme.textSecondary}
            />

            <View style={styles.modalButtons}>
              {/* Delete Button */}
              <TouchableOpacity onPress={() => deleteModule(editingModule?.id || '')}>
                <Text style={{color: '#FF4B4B', fontWeight: 'bold'}}>Delete</Text>
              </TouchableOpacity>
              
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{marginRight: 20}}>
                  <Text style={{color: theme.textSecondary}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={updateModule}>
                  <Text style={{color: theme.primary, fontWeight: 'bold'}}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>

    
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "white" },
  addText: { fontSize: 18, color: "#FF71CE", fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "80%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    padding: 8,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
});
