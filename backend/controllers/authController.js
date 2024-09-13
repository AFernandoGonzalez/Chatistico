const { admin } = require('../config/firebase'); 
const supabase = require('../config/db'); 

exports.signup = async (req, res) => {
  const { firebaseUid, email } = req.body;

  if (!firebaseUid || !email) {
    return res.status(400).json({ message: 'Firebase UID and email are required.' });
  }

  try {
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{ firebase_uid: firebaseUid, email }])
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


















