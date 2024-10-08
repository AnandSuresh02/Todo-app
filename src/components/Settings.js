import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const Settings = ({ user }) => {
  const [name, setName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

      // Check if user is trying to update the password
      if (newPassword && !isGoogleSignIn) {
        // Verify if new password and confirm password match
        if (newPassword !== confirmPassword) {
          setMessage("New password and confirm password don't match.");
          return;
        }

        // Reauthenticate user using the current password
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        
        // If reauthentication is successful, update password
        await updatePassword(auth.currentUser, newPassword);
        setMessage('Profile and password updated successfully');
      } else {
        setMessage('Profile updated successfully');
      }
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
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </label>
          <label>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </label>
          <label>
            Confirm New Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </label>
        </>
      )}
      <button onClick={handleUpdateProfile}>Update Profile</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Settings;
