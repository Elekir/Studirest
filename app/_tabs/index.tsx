import { Redirect } from 'expo-router';

export default function Index() {
  // This is like a "Bouncer" at a club. 
  // It says "No, don't go here, go to the Login page instead!"
  return <Redirect href="/login" />;
}