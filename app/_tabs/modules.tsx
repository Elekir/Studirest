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

  useEffect(() => {
    const q = query(
      collection(db, "modules"),
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

  // DELETE: Remove from Firebase
const deleteModule = async (id: string) => {
  try {
    await deleteDoc(doc(db, "modules", id));
    setEditModalVisible(false);
  } catch (error) {
    console.error("Delete error:", error);
  }
};

// UPDATE: Change the name in Firebase
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
    <View style={[styles.container, { backgroundColor: "#1A1135" }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Modules</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.addText}>Add +</Text>
        </TouchableOpacity>
      </View>

      <FlatList
  data={modules}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    /* THE TRIGGER: It wraps the card */
    <TouchableOpacity 
      style={styles.moduleCard} 
      onPress={() => {
        setEditingModule(item);
        setEditName(item.name);
        setEditModalVisible(true);
      }}
    >
      <View style={[styles.dot, { backgroundColor: item.color }]} />
      <Text style={styles.moduleName}>{item.name}</Text>
      <Ionicons
        name="chevron-forward"
        size={20}
        color="#666"
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  )}
/>
      {/* ADD MODULE MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={[styles.modalContent, { backgroundColor: Colors.dark.surface }]}>
      <Text style={[styles.modalTitle, { color: Colors.dark.text }]}>
        New Module
      </Text>
      <TextInput
        style={[
          styles.input, 
          { color: Colors.dark.text, borderBottomColor: Colors.dark.border }
        ]}
        placeholder="Module Name"
        placeholderTextColor={Colors.dark.textSecondary}
        value={newModuleName}
        onChangeText={setNewModuleName}
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={{ color: Colors.dark.textSecondary }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addModule}>
          <Text style={{ color: Colors.dark.primary, fontWeight: "bold" }}>
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
          <View style={[styles.modalContent, { backgroundColor: Colors.dark.surface }]}>
            <Text style={[styles.modalTitle, { color: Colors.dark.text }]}>Edit Module</Text>
            
            <TextInput 
              style={[styles.input, { color: Colors.dark.text, borderBottomColor: Colors.dark.border}]}
              value={editName}
              onChangeText={setEditName}
              placeholderTextColor={Colors.dark.textSecondary}
            />

            <View style={styles.modalButtons}>
              {/* Delete Button */}
              <TouchableOpacity onPress={() => deleteModule(editingModule?.id || '')}>
                <Text style={{color: '#FF4B4B', fontWeight: 'bold'}}>Delete</Text>
              </TouchableOpacity>
              
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{marginRight: 20}}>
                  <Text style={{color: Colors.dark.textSecondary}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={updateModule}>
                  <Text style={{color: Colors.dark.primary, fontWeight: 'bold'}}>Update</Text>
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
  moduleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
  moduleName: { color: "white", fontSize: 18, fontWeight: "500" },
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
