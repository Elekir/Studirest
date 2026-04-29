import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import StatCard from "../../components/dashboard/statCard";
import WeeklyChart from "../../components/dashboard/weeklyChart";
import RecentSessions from "../../components/dashboard/recentSessions";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { Colors } from "../../constants/theme";

interface Session {
  id: string;
  moduleName: string;
  duration: number;
}

export default function HomeScreen() {
  //  get the user's email or name from Firebase
  const user = auth.currentUser;
  const displayName = user?.email?.split("@")[0] || "User";
  const { theme } = useTheme();

  //  quotes
  const quotes = [
    "You don’t have to be great to start. But you have to start to be great",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Don't stop when you're tired. Stop when you're done.",
  ];

  // State to track which quote is currently displayed
  const [currentQuoteIndex, setCurrentQuoteIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000); // Change quote every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // State to hold recent sessions data
  const [recentSessions, setRecentSessions] = React.useState<Session[]>([]);

React.useEffect(() => {
  if (!auth.currentUser) return;

  const q = query(
    collection(db, "sessions"),
    where("userId", "==", auth.currentUser.uid),
    orderBy("createdAt", "desc"), // Show newest first
    limit(3) 
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      moduleName: doc.data().moduleName,
      duration: doc.data().duration,
    })) as Session[];
    setRecentSessions(list);
  });

  return () => unsubscribe();
}, []);


// State to hold statistics and chart data

const [stats, setStats] = React.useState({ streak: 0, totalHours: "0", totalSessions: 0 });
const [chartData, setChartData] = React.useState([0, 0, 0, 0, 0, 0, 0]); // M, T, W, T, F, S, S

React.useEffect(() => {
  if (!auth.currentUser) return;

  const q = query(
    collection(db, "sessions"),
    where("userId", "==", auth.currentUser.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
  let totalMinutes = 0;
  let dailyMinutes = [0, 0, 0, 0, 0, 0, 0]; 

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    totalMinutes += data.duration || 0;

    //  Get the date from Firebase
    const date = new Date(data.createdAt);
    const dayIndex = (date.getDay() + 6) % 7; 

    // Convert to hours
    const hours = (data.duration || 0) / 60;
    dailyMinutes[dayIndex] = Number((dailyMinutes[dayIndex] + hours).toFixed(2));
  });

  setStats({
    streak: calculateStreak(snapshot.docs),
    totalHours: (totalMinutes / 60).toFixed(1) + "h",
    totalSessions: snapshot.docs.length
  });
  
  setChartData(dailyMinutes);
});
  return () => unsubscribe();
}, []);




  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER SECTION */}
        <View style={styles.header}>
          
          <View style={styles.leftHeaderGroup}>
            
            <View style={styles.logoContainer}>
                        <Image source={require("../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
                      </View>

            <View style={styles.textGroup}>
              <Text style={styles.greetingText}>Hello, </Text>
              <Text style={styles.nameText}>{displayName}</Text>
            </View>
          </View>

          {/*  Notification Icon */}
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>

        {/* STATISTICS SECTION */}
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsRow}>
          <StatCard label="Day Streak" value={stats.streak} icon="flame" />
          <StatCard label="Total Hours" value={stats.totalHours} icon="time" />
          <StatCard label="Sessions" value={stats.totalSessions} icon="school" />
        </View>

        {/* WEEKLY PROGRESS CHART */}

        <WeeklyChart dataValues={chartData} />

        {/* MOTIVATION QUOTE BOX */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteHeader}>
            <Ionicons
              name="chatbubble-ellipses"
              size={18}
              color={theme.primary}
            />
            <Text style={styles.quoteTitle}>Motivation Quote</Text>
          </View>
          <Text style={styles.quoteText}>"{quotes[currentQuoteIndex]}"</Text>
        </View>
        
        {/*  RECENT SESSIONS */}
        <RecentSessions sessions={recentSessions} />

      </ScrollView>
    </SafeAreaView>
  );
}

function calculateStreak(sessionDocs: any[]) {
  if (sessionDocs.length === 0) return 0;

  //  Get all unique dates studied (sorted newest first)
  const dates = sessionDocs
    .map(doc => new Date(doc.data().createdAt).toDateString())
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(d => new Date(d));

  dates.sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if they studied today or yesterday to keep streak alive
  const lastStudied = dates[0];
  lastStudied.setHours(0, 0, 0, 0);
  
  const diffInDays = (currentDate.getTime() - lastStudied.getTime()) / (1000 * 3600 * 24);
  
  if (diffInDays > 1) return 0; // Streak broken

  // Count backwards
  for (let i = 0; i < dates.length; i++) {
    streak++;
    // If the next date in the list isn't exactly 1 day before, stop counting
    if (i + 1 < dates.length) {
      const nextDate = dates[i+1];
      const gap = (dates[i].getTime() - nextDate.getTime()) / (1000 * 3600 * 24);
      if (gap > 1) break;
    }
  }
  return streak;
}





const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  leftHeaderGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "rgba(255, 113, 206, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textGroup: {
    flexDirection: "row", // This puts Hello and Name on the same line
    alignItems: "baseline",
  },
  greetingText: {
    fontSize: 25,
    color: Colors.dark.text,
  },
  nameText: {
    fontSize: 25,
    fontWeight: "bold",
    color: Colors.dark.primary,
  },
  notificationBtn: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
    marginBottom: 15,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },

  quoteCard: {
    backgroundColor: Colors.dark.surface,
    padding: 20,
    borderRadius: 20,
    marginTop: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  quoteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  quoteTitle: {
    color: "#999",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginLeft: 8,
    letterSpacing: 1,
  },
  quoteText: {
    color: Colors.dark.text,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
  },

  logo: {
  width: 80,
  height: 80,
},
});
