import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyAVSf7v_Eg81S_Vd5xfhpXDxtHjl5rU51A",
	authDomain: "mydoctor-43894.firebaseapp.com",
	projectId: "mydoctor-43894",
	storageBucket: "mydoctor-43894.appspot.com",
	messagingSenderId: "566126828598",
	appId: "1:566126828598:web:6b42c5f4676560b17ccc97",
	measurementId: "G-N0QNWKL4Q3",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
