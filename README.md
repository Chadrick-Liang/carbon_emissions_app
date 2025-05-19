# Carbon Footprint Tracker App  
Cross-platform mobile application built with Expo & React Native to help users log eco-friendly activities, visualize their environmental impact over time, and compete on a global leaderboard.

# 🚀 Features
- 🔐 **Authentication**  
  – Sign up & login with Firebase Auth  
  – “Remember me” via AsyncStorage  
  – Secure logout

<img src="display_image/login.png" alt="Screenshot of login screen" height = "200"/>

- 🌱 **Activity Tracking**  
  – Choose from a curated list of carbon-saving actions (e.g. bus rides, recycling, ceiling-fan use) or add your own custom activity
  – Specify duration or quantity to calculate CO₂ saved  
  – Persistent entries in Cloud Firestore
  
![Screenshot of activity tracking](display_image/add_activity.png)

- 📊 **Progress Dashboard**  
  – Weekly / monthly summary of CO₂ saved 
  – Interactive Lottie animation feedback  
  – Capture & share your dashboard snapshot via ViewShot

![Screenshot of monthly emissions](display_image/emissions.png)
![Screenshot of monthly progress](display_image/animation.png)

- 🏆 **Leaderboard**  
  – View top savers globally  
  – Real-time updates from Firestore

![Screenshot of leaderboard](display_image/leaderboard.png)

- ⚙️ **Settings & FAQ**  
  – Collapsible sections for account info, app tips, and FAQs  
  – Change user details

![Screenshot of settings](display_image/settings.png)


# Instructions
Ensure that your have node.js installed in your device.
Run 'npm install expo' in the command line to install expo.
In the main directory, run 'npx expo start --tunnel' in the terminal to generate a qr code.
Ensure that your phone has the 'Expo Go' app installed from google play.
Through the Expo Go app on your phone, scan the qr code to run the application.

YOU CAN SIGN UP WITH A NEW ACCOUNT OR LOGIN WITH EMAIL: 'test@gmail.com' AND PASSWORD: '123456'.

# Disclaimer
The firebase api key has since been removed.
