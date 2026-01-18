/**
 * Profile Page Component
 * 
 * User profile management page.
 */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateProfile, selectUserLoading } from '../store/slices/userSlice';
import { updatePassword, selectAuthLoading } from '../store/slices/authSlice';
import { showSuccess, showError } from '../store/slices/uiSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isProfileLoading = useSelector(selectUserLoading);
  const isPasswordLoading = useSelector(selectAuthLoading);

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileData.firstName.trim()) errors.firstName = 'First name is required';
    if (!profileData.lastName.trim()) errors.lastName = 'Last name is required';
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    const result = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(showSuccess('Profile updated successfully'));
    } else {
      dispatch(showError(result.payload || 'Failed to update profile'));
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    const result = await dispatch(updatePassword(passwordData));
    if (updatePassword.fulfilled.match(result)) {
      dispatch(showSuccess('Password updated successfully'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } else {
      dispatch(showError(result.payload || 'Failed to update password'));
    }
  };

  return (
    <div className="page profile-page">
      <div className="page-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-sections">
        {/* Profile Information */}
        <section className="card">
          <h3>Profile Information</h3>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-row">
              <Input
                label="First Name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                error={profileErrors.firstName}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                error={profileErrors.lastName}
                required
              />
            </div>
            <Input
              label="Email"
              name="email"
              type="email"
              value={user?.email || ''}
              disabled
              helperText="Email cannot be changed"
            />
            <Button type="submit" loading={isProfileLoading}>
              Save Changes
            </Button>
          </form>
        </section>

        {/* Change Password */}
        <section className="card">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.currentPassword}
              required
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.newPassword}
              required
            />
            <Input
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.confirmNewPassword}
              required
            />
            <Button type="submit" loading={isPasswordLoading}>
              Update Password
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
