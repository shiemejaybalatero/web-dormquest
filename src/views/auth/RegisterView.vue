<script setup>
import { ref, computed } from 'vue'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const gender = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const birthMonth = ref('')
const birthDay = ref('')
const birthYear = ref('')

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const days = Array.from({ length: 31 }, (_, i) => i + 1)
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)

// 🧠 Combine birthday into readable string
const formattedBirthday = computed(() => {
  if (birthMonth.value && birthDay.value && birthYear.value) {
    return `${birthMonth.value} ${birthDay.value}, ${birthYear.value}`
  }
  return ''
})

function handleActiveState(event) {
  const button = event.currentTarget
  button.classList.add('active-tap')
  setTimeout(() => {
    button.classList.remove('active-tap')
  }, 150)
}
</script>

<template>
  <v-container
    fluid
    class="bg-image d-flex flex-column align-center justify-center pa-4 pa-sm-6"
    style="min-height: 100vh; overflow: hidden"
  >
    <!-- Header -->
    <div class="text-center mb-4">
      <v-img :src="'/23.png'" class="logodormquest" width="auto" max-width="200" />
      <h2 class="fw-bold text-white">Welcome to</h2>
      <h1 class="fw-bold"><span class="ftext">DORM</span><span class="stext">QUEST</span></h1>
    </div>

    <!-- Card Form -->
    <v-card class="form-card" flat>
      <v-card-text>
        <h1 class="signup-title text-center">Create your account</h1>
        <v-form>
          <!-- First & Last Name -->
          <v-row class="ma-0 pb-2">
            <v-col cols="12" sm="6" class="pa-0">
              <v-text-field
                v-model="firstName"
                label="First Name"
                variant="outlined"
                color="green"
                hide-details
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6" class="pa-0">
              <v-text-field
                v-model="lastName"
                label="Last Name"
                variant="outlined"
                color="green"
                hide-details
                density="comfortable"
              />
            </v-col>
          </v-row>

          <!-- Email -->
          <v-text-field
            v-model="email"
            label="Email Address"
            type="email"
            variant="outlined"
            color="green"
            class="pb-2"
            hide-details
            density="comfortable"
          />

          <!-- Birthday -->
          <v-row class="ma-0 pa-0">
            <v-col cols="12" sm="4" class="pa-0">
              <v-select
                v-model="birthMonth"
                label="Month"
                :items="months"
                variant="outlined"
                hide-details
                density="comfortable"
                color="green"
              />
            </v-col>
            <v-col cols="12" sm="4" class="pa-0">
              <v-select
                v-model="birthDay"
                label="Day"
                :items="days"
                variant="outlined"
                hide-details
                density="comfortable"
                color="green"
              />
            </v-col>
            <v-col cols="12" sm="4" class="pa-0">
              <v-select
                v-model="birthYear"
                label="Year"
                :items="years"
                variant="outlined"
                hide-details
                density="comfortable"
                color="green"
              />
            </v-col>
          </v-row>

          <!-- Show formatted birthday -->
          <div v-if="formattedBirthday" class="text-white text-caption mt-1 mb-3">
            📅 Selected Birthday: <strong>{{ formattedBirthday }}</strong>
          </div>

          <!-- Gender -->
          <v-radio-group v-model="gender" class="mb-n4" inline>
            <v-radio label="Male" value="male" />
            <v-radio label="Female" value="female" />
            <v-radio label="Rather not to say" value="custom" />
          </v-radio-group>

          <!-- Password -->
          <v-text-field
            v-model="password"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your password"
            variant="outlined"
            hint="At least 8 characters"
            label="Password"
            color="green"
            class="mb-n4"
            counter
            @click:append-inner="showPassword = !showPassword"
          />

          <!-- Confirm Password -->
          <v-text-field
            v-model="confirmPassword"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showConfirmPassword ? 'text' : 'password'"
            density="compact"
            placeholder="Confirm your password"
            variant="outlined"
            hint="At least 8 characters"
            label="Confirm Password"
            color="green"
            counter
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
          />

          <!-- Register Button -->
          <RouterLink to="/dashboard"
            ><v-btn
              class="register-button w-100 py-2"
              color="transparent"
              @click="handleActiveState"
            >
              SIGN UP
            </v-btn></RouterLink
          >
        </v-form>

        <!-- Already have an account -->
        <p class="text-center mt-3 mb-n3">
          Already have an account?
          <RouterLink to="/login" class="login">Login</RouterLink>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.bg-image {
  background: linear-gradient(290deg, #6d9773, #fffae6);
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
}

.form-card {
  background-color: #0c3b2e;
  color: white;
  border-radius: 20px;
  padding: 2rem 1rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 b {
  color: #0c3b2e;
}

h1 {
  font-size: 33px;
  color: #ffba00;
}

.login {
  text-decoration: none;
  color: #ffba00;
}

.signup-title {
  font-size: 16px;
  padding-bottom: 1rem;
  color: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}

.login:hover {
  text-decoration: none;
}

.register-button {
  background: transparent;
  color: #ffffff;
  border: solid 1px;
  font-size: 14px;
  border-radius: 0 2rem;
  transition: background-color 0.2s ease-out;
}

.active-tap {
  background-color: #ffba00 !important;
  color: #0c3b2e !important;
  transition:
    background-color 0.2s,
    color 0.2s;
}

h1,
h2,
h5,
p {
  font-family: Arial, Helvetica, sans-serif;
}

.ftext {
  color: #ffba00;
}

.stext {
  color: #0c3b2e;
}
</style>
