const admin = require('firebase-admin');

let db;
let auth;

try {
  // Using the service account JSON file (see firebase-service-account.json.example)
  const serviceAccount = require('../../firebase-service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  db = admin.firestore();
  auth = admin.auth();
} catch (error) {
  console.warn(
    'Firebase service account not found — running without Firebase. ' +
    'Add firebase-service-account.json (see the .example file) to enable auth/Firestore features.'
  );
  const notConfigured = () => {
    throw new Error('Firebase is not configured on this server.');
  };
  db = { collection: notConfigured, doc: notConfigured };
  auth = { verifyIdToken: async () => notConfigured() };
}

module.exports = { admin, db, auth };
