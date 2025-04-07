<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const buttons = ref([])

function handleActiveState(event) {
  const element = event.currentTarget // Get the button itself
  element.classList.add('active-tap')
  setTimeout(() => {
    element.classList.remove('active-tap')
  }, 150)
}

onMounted(() => {
  buttons.value = document.querySelectorAll('.login-button, .signup-link')

  buttons.value.forEach((button) => {
    button.addEventListener('click', handleActiveState)
  })
})

onUnmounted(() => {
  buttons.value.forEach((button) => {
    button.removeEventListener('click', handleActiveState)
  })
})
</script>

<template>
  <v-container fluid class="bg-image full-height d-flex flex-column align-center justify-center">
    <div class="text-center mb-4 d-flex flex-column justify-center align-center">
      <v-img :src="'/23.png'" class="logodormquest" width="auto" max-width="200" />
      <h2 class="welcome fw-normal text-white">Welcome to</h2>
      <h1 class="fw-bold"><span class="ftext">DORM</span><span class="stext">QUEST</span></h1>
    </div>

    <!-- Card -->
    <v-card class="card text-center">
      <v-card-text>
        <h1 class="login-title">Log in to your account</h1>
        <v-form>
          <v-text-field
            label="Email"
            type="email"
            color="green"
            dense
            outlined
            hide-details
            class="mb-2"
          />
          <v-text-field
            label="Password"
            type="password"
            color="green"
            dense
            outlined
            hide-details
            class="mb-4"
          />
          <!-- Button -->
          <v-btn class="login-button w-100 py-2" color="transparent">Log in</v-btn>
        </v-form>
        <p class="mt-3 dont">
          Don't have an account?
          <router-link to="/register" class="signup-link">Sign up</router-link>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.full-height {
  height: 100vh;
}

.bg-image {
  background: linear-gradient(290deg, #6d9773, #fffae6);
  background-size: cover;
  background-position: center;
}

.logodormquest {
  width: 200px;
  height: auto;
}

.card {
  background-color: #0c3b2e;
  color: white;
  border-radius: 20px;
  padding: 30px 20px;
  width: 350px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 33px;
  color: #ffba00;
}

.welcome {
  font-size: 22px;
}

.login-title {
  font-size: 16px;
  padding-bottom: 1rem;
  color: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
}

.dont {
  font-size: 14px;
}

.login-button {
  background: transparent;
  color: #ffffff;
  border: solid 1px;
  font-size: 14px;
  border-radius: 0 2rem;
  transition: background-color 0.2s ease-out;
}

.signup-link {
  text-decoration: none;
  color: #ffba00;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.active-tap {
  background-color: #ffba00 !important;
  color: #0c3b2e !important;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.ftext {
  color: #ffba00;
}

.stext {
  color: #0c3b2e;
}
</style>
