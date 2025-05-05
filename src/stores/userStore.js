import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { getAvatarText, calculateAge } from '@/utils/helper'

// Create a reactive store with user data that can be imported from any component
export const userProfile = ref({
  email: '',
  fullname: '',
  initials: '',
  age: '',
  gender: '',
  birthday: '',
  avatar_url: null,
})

// Flag to track if user data is being loaded
export const isLoadingUser = ref(false)

// Function to fetch user profile
export async function fetchUserProfile() {
  isLoadingUser.value = true
  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    if (!data?.user) {
      return null
    }

    const metadata = data.user.user_metadata || {}

    // Update the reactive userProfile object
    userProfile.value = {
      email: metadata.email || data.user.email,
      fullname: `${metadata.firstname || ''} ${metadata.lastname || ''}`.trim(),
      initials: getAvatarText(`${metadata.firstname || ''} ${metadata.lastname || ''}`.trim()),
      age: metadata.birthday ? calculateAge(metadata.birthday) : metadata.age || '',
      gender: metadata.gender || '',
      birthday: metadata.birthday || '',
      avatar_url: metadata.avatar_url,
    }

    // If avatar_url is not in metadata, check if there's a profile picture in storage
    if (!metadata.avatar_url) {
      const avatarUrl = await fetchProfilePicture(data.user.id)
      if (avatarUrl) {
        userProfile.value.avatar_url = avatarUrl
      }
    }

    return userProfile.value
  } catch (err) {
    console.error('Error in fetchUserProfile:', err)
    return null
  } finally {
    isLoadingUser.value = false
  }
}

// Function to fetch profile picture from storage
async function fetchProfilePicture(userId) {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(`${userId}/profile.jpg`, 60 * 60) // 1 hour expiry

    if (error) {
      console.error('Error fetching profile picture:', error)
      return null
    }

    return data?.signedUrl || null
  } catch (error) {
    console.error('Error in fetchProfilePicture:', error)
    return null
  }
}

// Function to update user profile
export async function updateUserProfile(userData, avatarFile = null) {
  try {
    let avatarUrl = userProfile.value.avatar_url

    // Upload new avatar if provided
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const fileName = `avatar_${Date.now()}.${fileExt}`
      const filePath = `public/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('dormquest')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('dormquest').getPublicUrl(filePath)
      if (urlData?.publicUrl) avatarUrl = urlData.publicUrl
    }

    // Split name into first and last name
    const nameParts = userData.fullname.split(' ')
    const firstname = nameParts[0] || ''
    const lastname = nameParts.slice(1).join(' ') || ''

    // Update user data in Supabase
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        firstname,
        lastname,
        birthday: userData.birthday,
        gender: userData.gender,
        avatar_url: avatarUrl,
      },
    })

    if (updateError) throw updateError

    // Refresh the user profile data after update
    await fetchUserProfile()

    return { success: true }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: error.message || 'Failed to update profile' }
  }
}

/**
 * Update user email
 * @param {Object} data - Contains newEmail and password
 * @returns {Object} - Success status and error message if any
 */
export const updateUserEmail = async (data) => {
  try {
    // Validate input parameters
    if (!data || !data.newEmail || !data.password) {
      return { success: false, error: 'Missing required fields' }
    }

    // Check if userProfile.value has the necessary properties
    if (!userProfile.value || !userProfile.value.email) {
      return { success: false, error: 'User profile information is missing' }
    }

    // Verify current password first for security
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userProfile.value.email,
      password: data.password,
    })

    if (signInError) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Then update the email
    const { error } = await supabase.auth.updateUser({
      email: data.newEmail,
    })

    if (error) {
      console.error('Error updating email:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true, message: 'Verification email sent. Please check your inbox.' }
  } catch (error) {
    console.error('Exception updating email:', error)
    return { success: false, error: error.message || 'Failed to update email' }
  }
}

/**
 * Update user password
 * @param {Object} data - Contains currentPassword and newPassword
 * @returns {Object} - Success status and error message if any
 */
export const updateUserPassword = async (data) => {
  try {
    // First, validate the current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userProfile.value.email,
      password: data.currentPassword,
    })

    if (signInError) {
      return { success: false, error: 'Current password is incorrect' }
    }

    // Then update the password
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    })

    if (error) {
      console.error('Error updating password:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Exception updating password:', error)
    return { success: false, error: error.message || 'Failed to update password' }
  }
}
