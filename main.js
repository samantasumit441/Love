// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDT9zKU_VPhdI7ePluufEIBQgcZlx78j1s",
    authDomain: "relationship-timeline-d0ffa.firebaseapp.com",
    projectId: "relationship-timeline-d0ffa",
    storageBucket: "relationship-timeline-d0ffa.appspot.com",
    messagingSenderId: "285290324596",
    appId: "1:285290324596:web:d08d009d9bded43c84e721",
    measurementId: "G-9FXQQ5H244"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', () => {
    auth.signInWithPopup(provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = result.credential;
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // Redirect to the timeline page
            window.location.href = 'timeline.html';
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
            console.error(errorMessage);
        });
});

// Floating hearts animation
const heartsContainer = document.querySelector('.hearts-container');

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 5 + 5 + 's';
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 10000);
}

setInterval(createHeart, 300);
