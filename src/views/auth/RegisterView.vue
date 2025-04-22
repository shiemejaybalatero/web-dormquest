<script setup>
import { ref, computed } from 'vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import dayjs from 'dayjs'
import { supabase, formActionDefault } from '@/utils/supabase'

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const refVForm = ref()

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  birthday: '',
  gender: '',
  password: '',
  password_confirmation: '',
}
const formData = ref({ ...formDataDefault })

const formAction = ref({ ...formActionDefault })

const formattedBirthday = computed(() => {
  if (formData.value.birthday) {
    return dayjs(formData.value.birthday).format('MMMM D, YYYY')
  }
  return ''
})

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

const onSubmit = async () => {
  formAction.value = {
    ...formActionDefault,
  }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
        birthday: formData.value.birthday,
        gender: formData.value.gender,
      },
    },
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Registered Account'
  }

  formAction.value.formProcess = false
}

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
    <div class="text-center mb-4">
      <v-img :src="'/23.png'" class="logodormquest" width="auto" max-width="200" />
      <h2 class="fw-bold text-white">Welcome to</h2>
      <h1 class="fw-bold"><span class="ftext">DORM</span><span class="stext">QUEST</span></h1>
    </div>

    <v-card class="form-card" flat>
      <v-card-text>
        <h1 class="signup-title text-center">Create your account</h1>

        <v-alert
          v-if="formAction.formSuccessMessage"
          :text="formAction.formSuccessMessage"
          title="Success!"
          type="success"
          variant="tonal"
          density="compact"
          boarder="start"
          closable
        >
        </v-alert>

        <v-alert
          v-if="formAction.formErrorMessage"
          :text="formAction.formErrorMessage"
          title="Ooops!"
          type="error"
          variant="tonal"
          density="compact"
          boarder="start"
          closable
        >
        </v-alert>

        <v-form ref="refVForm" @submit.prevent="onFormSubmit">
          <v-row class="ma-0 pb-2">
            <v-col cols="12" sm="6" class="pa-0 pr-1">
              <v-text-field
                v-model="formData.firstname"
                label="First Name"
                variant="outlined"
                color="green"
                hide-details
                density="comfortable"
                :rules="[requiredValidator]"
              />
            </v-col>
            <v-col cols="12" sm="6" class="pa-0 pl-1">
              <v-text-field
                v-model="formData.lastname"
                label="Last Name"
                variant="outlined"
                color="green"
                hide-details
                density="comfortable"
                :rules="[requiredValidator]"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="formData.email"
            label="Email Address"
            type="email"
            variant="outlined"
            color="green"
            class="pb-2 pt-2"
            hide-details
            density="comfortable"
            :rules="[requiredValidator, emailValidator]"
          />

          <v-col cols="12" class="pa-0">
            <v-subheader class="text-caption mt-1 mb-1 subheader"><i>Birthdate</i></v-subheader>
            <v-text-field
              v-model="formData.birthday"
              type="date"
              color="green"
              variant="outlined"
              density="comfortable"
              :rules="[requiredValidator]"
              class="w-100"
            />
          </v-col>

          <div v-if="formattedBirthday" class="text-white text-caption mt-n5 mb-3">
            📅 Selected Birthday: <strong>{{ formattedBirthday }}</strong>
          </div>

          <v-col cols="12" class="pa-0 mt-n2">
            <v-subheader class="text-caption subheader"><i>Gender</i></v-subheader>
            <v-radio-group
              v-model="formData.gender"
              class="mb-n4"
              inline
              :rules="[requiredValidator]"
            >
              <v-radio label="Male" value="male" />
              <v-radio label="Female" value="female" />
              <v-radio label="Rather not to say" value="custom" />
            </v-radio-group>
          </v-col>

          <!-- Password -->
          <v-text-field
            v-model="formData.password"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            :type="showPassword ? 'text' : 'password'"
            density="compact"
            placeholder="Enter your password"
            variant="outlined"
            hint="At least 8 characters"
            label="Password"
            color="green"
            counter
            @click:append-inner="showPassword = !showPassword"
            :rules="[requiredValidator, passwordValidator]"
          />

          <!-- Confirm Password -->
          <v-text-field
            v-model="formData.password_confirmation"
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
            :rules="[
              requiredValidator,
              confirmedValidator(formData.password_confirmation, formData.password),
            ]"
          />

          <v-btn
            class="register-button w-100 py-2"
            color="transparent"
            @click="handleActiveState($event)"
            type="submit"
            block
            :disabled="formAction.formProcess"
            :loading="formAction.formProcess"
          >
            SIGN UP
          </v-btn>
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

h1 {
  font-size: 33px;
  color: #ffba00;
}

.ftext {
  color: #ffba00;
}

.stext {
  color: #0c3b2e;
}

.signup-title {
  font-size: 16px;
  padding-bottom: 1rem;
  color: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}

.login {
  text-decoration: none;
  color: #ffba00;
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
}

.register-button:hover {
  background-color: #ffba00;
  color: #0c3b2e;
}
</style>
