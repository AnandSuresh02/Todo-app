import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';

const Settings = ({ user }) => {
  const [name, setName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(user.photoURL || 'https://via.placeholder.com/150');
  const [message, setMessage] = useState('');
  
  const isGoogleSignIn = user.providerData.some(provider => provider.providerId === 'google.com');

  const handleUpdateProfile = async () => {
    try {
      if (name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      if (email !== user.email && !isGoogleSignIn) {
        await updateEmail(auth.currentUser, email);
      }
      if (password && !isGoogleSignIn) {
        await updatePassword(auth.currentUser, password);
      }
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      updateProfile(auth.currentUser, { photoURL: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="settings">
      <h2>Settings</h2>
      <label>
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
        <img src={profilePic} alt="Profile" />
      </label>
      <label>
        Name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      {!isGoogleSignIn && (
        <>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </>
      )}
      <button onClick={handleUpdateProfile}>Update Profile</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Settings;
