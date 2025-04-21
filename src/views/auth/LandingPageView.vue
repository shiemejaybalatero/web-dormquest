<script setup></script>

<template>
  <v-container fluid class="fill-height d-flex flex-column align-center justify-center bg-image">
    <v-img src="/23.png" alt="logo" class="logodormquest mb-4" width="180" contain></v-img>

    <v-row justify="center" class="text-center mb-5">
      <v-col cols="12">
        <h1 class="firsttext fw-bold mb-0">
          <b> Are you a CSU Student <br />looking for a place to stay? </b>
        </h1>
        <h1 class="secondtext fw-light pb-5">
          Start a <i>Quest</i> to find a place <br />to stay, anytime, anywhere.
        </h1>
      </v-col>
    </v-row>

    <v-row justify="center" class="text-center">
      <v-col cols="12">
        <RouterLink to="/login">
          <v-btn class="custom-btn mb-5">Login</v-btn>
        </RouterLink>
        <br />
        <RouterLink to="/register">
          <v-btn class="custom-btn btntwo text-white">Create an account</v-btn>
        </RouterLink>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Background styling */
.bg-image {
  background-image: url('/landing4.png');
  background-size: cover;
  background-position: center;
  height: 100%;
}

.fill-height {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.v-row {
  margin-bottom: 0;
}

/* Button styles */
.custom-btn {
  width: 15em;
  font-size: 16px;
  border-radius: 0 2rem;
  background-color: #ffba00 !important;
  color: black !important;
  text-transform: none;
}

.custom-btn:hover {
  background-color: #ffba00 !important;
  opacity: 1;
  border: 2px solid #0c3b2e;
}

.btntwo {
  background-color: #0c3b2e !important;
  border-radius: 0 2rem;
  width: 15em;
  text-transform: none;
}

.btntwo:hover {
  background-color: #0c3b2e !important;
  opacity: 1;
  border: 2px solid #ffba00;
}

.firsttext {
  font-size: 18px;
  color: #0c3b2e;
}

.secondtext {
  font-size: 17px;
  color: #0c3b2e;
}
</style>
