<script setup>
import { ref, watch, computed } from 'vue'
import { updateUserProfile, updateUserEmail, updateUserPassword } from '@/stores/userStore'

const props = defineProps({
  modelValue: Boolean,
  userData: Object,
})

const emit = defineEmits(['update:modelValue', 'profile-updated'])

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const dialog = ref(props.modelValue)
const isSaving = ref(false)
const editError = ref('')
const successMessage = ref('')
const avatarFile = ref(null)
const activeTab = ref(0)

// Form data for different sections
const profileForm = ref({
  fullname: '',
  birthday: '',
  gender: '',
})

const emailForm = ref({
  currentPassword: '',
  newEmail: '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Password validation
const passwordMatch = computed(() => {
  return (
    passwordForm.value.newPassword === passwordForm.value.confirmPassword ||
    passwordForm.value.confirmPassword === ''
  )
})

const passwordStrong = computed(() => {
  const pwd = passwordForm.value.newPassword
  return pwd === '' || pwd.length >= 8
})

const showPasswordError = computed(() => {
  return !passwordMatch.value || !passwordStrong.value
})

const passwordErrorMessage = computed(() => {
  if (!passwordMatch.value) return "Passwords don't match"
  if (!passwordStrong.value) return 'Password must be at least 8 characters'
  return ''
})

// Watch for dialog open/close to sync with parent
watch(
  () => props.modelValue,
  (newVal) => {
    dialog.value = newVal
  },
)

// Watch for dialog local changes to emit to parent
watch(
  () => dialog.value,
  (newVal) => {
    emit('update:modelValue', newVal)

    // Reset form and errors when dialog closes
    if (!newVal) {
      resetForms()
    }
  },
)

// Watch for userData changes to update form
watch(
  () => props.userData,
  (newData) => {
    if (newData) {
      profileForm.value.fullname = newData.fullname || ''
      profileForm.value.birthday = newData.birthday || ''
      profileForm.value.gender = newData.gender || ''
      // REMOVED: emailForm.value.newEmail = newData.email || ''
    }
  },
  { immediate: true },
)

// Function to handle file uploads
const handleFileUpload = (e) => {
  avatarFile.value = e.target.files[0]
}

// Reset all forms and messages
const resetForms = () => {
  // Reset all forms to initial state
  emailForm.value.currentPassword = ''
  emailForm.value.newEmail = '' // Always empty, not pre-filled

  passwordForm.value.currentPassword = ''
  passwordForm.value.newPassword = ''
  passwordForm.value.confirmPassword = ''

  editError.value = ''
  successMessage.value = ''
  activeTab.value = 0
}

// Function to update profile information
const saveProfileChanges = async () => {
  isSaving.value = true
  editError.value = ''
  successMessage.value = ''

  // Update profile using the store function
  const result = await updateUserProfile(
    {
      fullname: profileForm.value.fullname,
      birthday: profileForm.value.birthday,
      gender: profileForm.value.gender,
    },
    avatarFile.value,
  )

  if (result.success) {
    successMessage.value = 'Profile information updated successfully!'
    emit('profile-updated')
  } else {
    editError.value = result.error || 'Failed to update profile'
  }

  isSaving.value = false
}

// Function to update email
const updateEmail = async () => {
  if (!emailForm.value.newEmail || !emailForm.value.currentPassword) {
    editError.value = 'Please fill in all required fields'
    return
  }

  // Add this check to prevent setting the same email
  if (emailForm.value.newEmail === props.userData?.email) {
    editError.value = 'New email must be different from your current email'
    return
  }

  isSaving.value = true
  editError.value = ''
  successMessage.value = ''

  const result = await updateUserEmail({
    newEmail: emailForm.value.newEmail,
    password: emailForm.value.currentPassword,
  })

  if (result.success) {
    successMessage.value = 'Email updated successfully! You may need to verify your new email.'
    emailForm.value.currentPassword = ''
    emailForm.value.newEmail = ''
    emit('profile-updated')
  } else {
    editError.value = result.error || 'Failed to update email'
  }

  isSaving.value = false
}

// Function to update password
const updatePassword = async () => {
  // Validate password fields
  if (
    !passwordForm.value.currentPassword ||
    !passwordForm.value.newPassword ||
    !passwordForm.value.confirmPassword
  ) {
    editError.value = 'Please fill in all password fields'
    return
  }

  if (!passwordMatch.value) {
    editError.value = 'New passwords do not match'
    return
  }

  if (!passwordStrong.value) {
    editError.value = 'Password must be at least 8 characters'
    return
  }

  isSaving.value = true
  editError.value = ''
  successMessage.value = ''

  const result = await updateUserPassword({
    currentPassword: passwordForm.value.currentPassword,
    newPassword: passwordForm.value.newPassword,
  })

  if (result.success) {
    successMessage.value = 'Password updated successfully!'
    // Reset password fields
    passwordForm.value.currentPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
  } else {
    editError.value = result.error || 'Failed to update password'
  }

  isSaving.value = false
}

// Handle save based on active tab
const saveChanges = async () => {
  switch (activeTab.value) {
    case 0:
      await saveProfileChanges()
      break
    case 1:
      await updateEmail()
      break
    case 2:
      await updatePassword()
      break
  }
}

// Close dialog and reset
const closeDialog = () => {
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title class="dialog_card text-white">
        <span class="text-h5">Edit Profile</span>
      </v-card-title>

      <v-tabs v-model="activeTab" class="dialog_tab" align-tabs="center">
        <v-tab :value="0">Profile</v-tab>
        <v-tab :value="1">Email</v-tab>
        <v-tab :value="2">Password</v-tab>
      </v-tabs>

      <v-card-text class="pt-4">
        <v-container>
          <!-- Success message alert -->
          <v-alert v-if="successMessage" type="success" density="compact" class="mb-4">
            {{ successMessage }}
          </v-alert>

          <!-- Error message alert -->
          <v-alert v-if="editError" type="error" density="compact" class="mb-4">
            {{ editError }}
          </v-alert>

          <!-- Profile Tab -->
          <v-window v-model="activeTab">
            <v-window-item :value="0">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="profileForm.fullname" label="Full Name" outlined dense />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.birthday"
                    label="Birthday"
                    type="date"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="profileForm.gender"
                    :items="['Male', 'Female', 'Rather not to say']"
                    label="Gender"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-file-input
                    label="Upload New Avatar"
                    accept="image/*"
                    outlined
                    dense
                    prepend-icon="mdi-camera"
                    @change="handleFileUpload"
                  />
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Email Tab -->
            <v-window-item :value="1">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="emailForm.newEmail"
                    label="New Email Address"
                    type="email"
                    outlined
                    dense
                    hint="Enter your new email address"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="emailForm.currentPassword"
                    label="Current Password"
                    type="password"
                    outlined
                    dense
                    hint="For security, please enter your current password"
                  />
                </v-col>

                <v-col cols="12">
                  <v-alert color="info" density="compact" variant="tonal" icon="mdi-information">
                    You may need to verify your new email address after changing it.
                  </v-alert>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Password Tab -->
            <v-window-item :value="2">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="passwordForm.currentPassword"
                    label="Current Password"
                    type="password"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="passwordForm.newPassword"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    label="New Password"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append-inner="showPassword = !showPassword"
                    outlined
                    dense
                    :rules="[
                      (v) => !!v || 'Password is required',
                      (v) => v.length >= 8 || 'Password must be at least 8 characters',
                    ]"
                    hint="Password must be at least 8 characters"
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="passwordForm.confirmPassword"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    label="Confirm New Password"
                    outlined
                    dense
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    :error-messages="!passwordMatch ? 'Passwords don\'t match' : ''"
                  />
                </v-col>

                <v-col cols="12" v-if="showPasswordError">
                  <v-alert type="warning" density="compact" variant="tonal">
                    {{ passwordErrorMessage }}
                  </v-alert>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="closeDialog" :disabled="isSaving"> Cancel </v-btn>
        <v-btn color="success" :loading="isSaving" @click="saveChanges"> Save Changes </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.dialog_card {
  background-color: #0c3b2e;
}

.dialog_tab {
  background-color: #0c3b2e;
  color: white;
}
</style>
