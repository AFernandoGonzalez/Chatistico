const { admin } = require('../config/firebase'); // Use the config you've set up
const supabase = require('../config/db'); // Assuming you're using Supabase for your DB connection

// Signup Function
exports.signup = async (req, res) => {
  const { firebaseUid, email } = req.body; // Ensure you are receiving these fields

  console.log("firebaseUid, email: ", firebaseUid, email);
  
  if (!firebaseUid || !email) {
    return res.status(400).json({ message: 'Firebase UID and email are required.' });
  }

  try {
    // Insert the user into the database
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ firebase_uid: firebaseUid, email }]) // Ensure firebase_uid is passed
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

// Login Function
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Here you can use Firebase to verify the user's email and password (Firebase Auth does this in the frontend)
    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Logout Function
exports.logout = async (req, res) => {
  try {
    // Since logout happens client-side (clearing tokens, etc.), you don't need Firebase Admin for this
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
