# Studirest: A Study Management System 

This repository contains the architectural artefacts, design documentation, and a proof-of-concept implementation for **Studirest**, a mobile application developed to support Self-Regulated Learning (SRL) for university students.

## Repository Purpose
The repository is intended to support technical review, design validation, and implementation evidence for the Final Year Project. It demonstrates the integration of behavioral tracking with real-time data persistence.

## Code Structure
The folder `app/` contains the core React Native (Expo) implementation, including:
* **Application Logic:** Functional components and custom hooks for session management.
* **Route Definitions:** File-based routing handled by Expo Router.
* **Services:** Firebase integration for Authentication and Firestore database operations.
* **Constants & Theme:** Global styling configurations and WCAG-compliant color palettes.


## Technical Stack
### Frontend
* **React Native & Expo:** For mobile development.
* **TypeScript:** For static type checking and robust code architecture.
### Backend & Infrastructure
* **Firebase Authentication:** Secure user identity management.
* **Cloud Firestore:** NoSQL document database for real-time study data synchronization.
### Version Control & Design
* **Git/GitHub:** For version control and iterative development tracking.
* **Figma:** For high-fidelity UI/UX design and prototyping.

## Key Features & Specifications
* **Secure Authentication:** Implementation of Firebase-backed Login and Registration systems.
* **Pomodoro Engine:** A logic-based timer for tracking study intervals.
* **Analytical Dashboard:** Visual representation of study habits using data-driven charting libraries.
* **SRL Integration:** Features designed specifically to promote the 'Plan, Monitor, Reflect' cycle.
