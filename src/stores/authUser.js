import { supabase } from '@/utils/supabase'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthUserStore = defineStore('authUser', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const authPages = ref([])
  const authBranchIds = ref([])

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userId = computed(() => user.value?.id)
  const userEmail = computed(() => user.value?.email)
  const userMetadata = computed(() => user.value?.user_metadata)
  const userRole = computed(() => {
    return user.value?.is_admin ? 'Super Administrator' : user.value?.user_role
  })

  // Reset state
  function resetState() {
    user.value = null
    loading.value = false
    error.value = null
    authPages.value = []
    authBranchIds.value = []
  }

  // Load session
  async function loadUser() {
    loading.value = true
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      user.value = session?.user || null
    } catch (err) {
      console.error('Error loading user:', err)
      error.value = 'Failed to load user data'
    } finally {
      loading.value = false
    }
  }

  // Sign in
  async function signIn({ email, password }) {
    loading.value = true
    error.value = null
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) throw authError
      user.value = data.user
      return data
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message || 'Failed to sign in'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Sign out
  async function signOut() {
    loading.value = true
    try {
      await supabase.auth.signOut()
      user.value = null
    } catch (err) {
      console.error('Logout error:', err)
      error.value = 'Failed to sign out'
    } finally {
      loading.value = false
    }
  }

  // Update profile
  async function updateProfile(profileData) {
    if (!user.value) return null

    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({ data: profileData })
      if (updateError) throw updateError

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user.value.id,
        ...profileData,
        updated_at: new Date(),
      })

      if (profileError) throw profileError

      user.value = data.user
      return data.user
    } catch (err) {
      console.error('Profile update error:', err)
      error.value = err.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update metadata (user information)
  async function updateUserInformation(updatedData) {
    const {
      data: {
        user: { id, email, user_metadata },
      },
      error,
    } = await supabase.auth.updateUser({ data: updatedData })

    if (error) return { error }

    user.value = { id, email, ...user_metadata }
    return { data: user.value }
  }

  // Upload user image
  async function updateUserImage(file) {
    const { data, error } = await supabase.storage
      .from('dormquest')
      .upload('avatars/' + user.value.id + '-avatar.png', file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) return { error }

    const { data: imageData } = supabase.storage.from('dormquest').getPublicUrl(data.path)
    return await updateUserInformation({ ...user.value, image_url: imageData.publicUrl })
  }

  // Fetch auth pages
  async function getAuthPages(roleName) {
    const { data } = await supabase
      .from('user_roles')
      .select('*, pages: user_role_pages (page)')
      .eq('user_role', roleName)

    if (data?.length > 0) authPages.value = data[0].pages.map((p) => p.page)
  }

  // Fetch branch IDs
  async function getAuthBranchIds() {
    if (!user.value?.branch) return
    const { data } = await supabase
      .from('branches')
      .select('id')
      .in('name', user.value.branch.split(','))

    authBranchIds.value = data.map((b) => b.id)
  }

  return {
    // State
    user,
    loading,
    error,
    authPages,
    authBranchIds,

    // Getters
    isAuthenticated,
    userId,
    userEmail,
    userMetadata,
    userRole,

    // Actions
    resetState,
    loadUser,
    signIn,
    signOut,
    updateProfile,
    updateUserInformation,
    updateUserImage,
    getAuthPages,
    getAuthBranchIds,
  }
})
