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
const db = firebase.firestore();

const userPhoto = document.getElementById('user-photo');
const logoutBtn = document.getElementById('logout-btn');
const timeline = document.getElementById('timeline');
const addMemoryBtn = document.getElementById('add-memory-btn');
const modal = document.getElementById('memory-modal');
const closeModalBtn = document.querySelector('.close-btn');
const memoryForm = document.getElementById('memory-form');
const memoryDate = document.getElementById('memory-date');
const memoryEmoji = document.getElementById('memory-emoji');
const memoryText = document.getElementById('memory-text');

let currentUser;
let timelineId;

auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        userPhoto.src = user.photoURL;

        // Check if user has a timelineId, if not, create one or link to partner's
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().timelineId) {
            timelineId = userDoc.data().timelineId;
            loadMemories();
        } else {
            const partnerEmail = prompt("To share your timeline, please enter your partner's email address. If they already have a timeline, you'll be connected. Otherwise, a new shared timeline will be created.");
            if (partnerEmail) {
                const partnerQuery = await db.collection('users').where('email', '==', partnerEmail).get();
                if (!partnerQuery.empty) {
                    const partnerDoc = partnerQuery.docs[0];
                    timelineId = partnerDoc.data().timelineId;
                } else {
                    timelineId = db.collection('timelines').doc().id;
                }
                await db.collection('users').doc(user.uid).set({ email: user.email, timelineId });
                loadMemories();
            }
        }
    } else {
        window.location.href = 'index.html';
    }
});

logoutBtn.addEventListener('click', () => {
    auth.signOut();
});

addMemoryBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

memoryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('timelines').doc(timelineId).collection('memories').add({
        date: memoryDate.value,
        emojis: memoryEmoji.value,
        text: memoryText.value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    memoryForm.reset();
    modal.style.display = 'none';
});

function loadMemories() {
    if (timelineId) {
        db.collection('timelines').doc(timelineId).collection('memories').orderBy('date', 'desc')
            .onSnapshot((snapshot) => {
                timeline.innerHTML = '';
                snapshot.forEach((doc) => {
                    const memory = doc.data();
                    const memoryCard = document.createElement('div');
                    memoryCard.classList.add('memory-card');
                    memoryCard.innerHTML = `
                        <div class="heart-animation">💖</div>
                        <div class="date">${memory.date}</div>
                        <div class="emojis">${memory.emojis}</div>
                        <div class="text">${memory.text}</div>
                    `;
                    timeline.appendChild(memoryCard);
                });
            });
    }
}
