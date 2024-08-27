const firebaseAdmin = require('firebase-admin');


firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
});

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await firebaseAdmin.auth().createUser({ email, password });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  res.status(200).json({ message: 'Logged in successfully' });
};

exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};
