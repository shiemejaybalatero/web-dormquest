<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import dayjs from 'dayjs'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { useRouter } from 'vue-router'
import { calculateAge } from '@/utils/helper'

const router = useRouter()
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const refVForm = ref()
const birthdayMenu = ref(false)

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

const onSubmit = async () => {
  formAction.value = {
    ...formActionDefault,
  }
  formAction.value.formProcess = true

  // Calculate age from birthday
  const age = formData.value.birthday ? calculateAge(formData.value.birthday) : null

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
        birthday: formData.value.birthday,
        gender: formData.value.gender,
        age: age, // Add the calculated age here
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
    refVForm.value?.reset()
    router.replace('/system/dashboard')
  }

  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

const formattedBirthday = computed({
  get: () => {
    if (formData.value.birthday) {
      return dayjs(formData.value.birthday).format('MMMM D, YYYY')
    }
    return ''
  },
  set: (val) => {
    if (!val) formData.value.birthday = ''
  },
})

function handleActiveState(event) {
  const button = event.currentTarget
  button.classList.add('active-tap')
  setTimeout(() => {
    button.classList.remove('active-tap')
  }, 150)
}

onMounted(() => {
  // Apply custom styling to autofilled input fields
  const inputs = document.querySelectorAll('input')
  inputs.forEach((input) => {
    input.addEventListener('animationstart', (e) => {
      if (e.animationName === 'autofill') {
        input.parentElement.classList.add('autofilled')
      }
    })
  })
})
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

        <AlertNotification
          :form-success-message="formAction.formSuccessMessage"
          :form-error-message="formAction.formErrorMessage"
        ></AlertNotification>

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
                background-color="#0a3327"
                dark
                class="form-field"
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
                background-color="#0a3327"
                dark
                class="form-field"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="formData.email"
            label="Email Address"
            type="email"
            variant="outlined"
            color="green"
            class="pb-2 pt-2 form-field"
            hide-details
            density="comfortable"
            :rules="[requiredValidator, emailValidator]"
            background-color="#0a3327"
            dark
          />

          <v-col cols="12" class="pa-0">
            <v-label class="text-caption mt-1 mb-1 field-label"><i>Birthdate</i></v-label>
            <v-menu
              v-model="birthdayMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              min-width="auto"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="formattedBirthday"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="props"
                  color="green"
                  variant="outlined"
                  density="comfortable"
                  class="w-100 birthdate-field"
                  :rules="[requiredValidator]"
                  placeholder="Select your birthday"
                  clearable
                  @click:clear="formData.birthday = ''"
                />
              </template>
              <v-date-picker
                v-model="formData.birthday"
                @update:model-value="birthdayMenu = false"
                color="#ffba00"
                header-color="#0c3b2e"
                :max="new Date().toISOString().substr(0, 10)"
                min="1920-01-01"
              >
                <template v-slot:header="{ title }">
                  <div class="date-picker-header">
                    <v-btn icon @click="birthdayMenu = false" color="#ffba00">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <div class="header-title">{{ title }}</div>
                    <div></div>
                  </div>
                </template>
              </v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12" class="pa-0 mt-n2">
            <v-label class="text-caption field-label"><i>Gender</i></v-label>
            <v-radio-group
              v-model="formData.gender"
              class="mb-n4 mt-n2"
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
            background-color="#0a3327"
            dark
            class="form-field"
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
            background-color="#0a3327"
            dark
            class="form-field"
          />

          <!-- Register Button -->
          <v-btn
            class="register-button w-100 py-2"
            color="transparent"
            @click="handleActiveState"
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
  background: url(/public/landing4.png);
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
  font-size: 20px;
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

.calendar {
  color: white;
}

.field-label {
  display: block;
  padding-left: 16px;
  margin-top: 8px;
  margin-bottom: 4px;
  color: rgba(255, 255, 255, 0.7);
}

.date-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #0c3b2e;
  color: #ffba00;
}

.header-title {
  font-weight: bold;
  font-size: 16px;
}

/* Add birthdate field specific styles */
.birthdate-field {
  --v-theme-surface: transparent !important;
}

:deep(.birthdate-field .v-field__input) {
  background-color: transparent !important;
  color: white !important;
  min-height: 40px !important;
}

:deep(.birthdate-field .v-field__outline) {
  opacity: 1 !important;
  color: #2b806a !important;
  border-width: 1px !important;
}

:deep(.v-date-picker-month) {
  background-color: white;
}

:deep(.v-date-picker-header) {
  background-color: #0c3b2e;
  color: white;
}

:deep(.v-date-picker-controls .v-btn) {
  color: #ffba00;
}

:deep(.v-date-picker-month__day--selected) {
  background-color: #ffba00 !important;
}

:deep(.v-date-picker) {
  border-radius: 12px;
  overflow: hidden;
}

/* Original form field styles */
:deep(.form-field) {
  --v-theme-surface: #0a3327 !important;
}

:deep(.v-field__outline) {
  opacity: 1 !important;
  color: #2b806a !important;
  border-width: 1px !important;
}

:deep(.v-field__field) {
  color: white !important;
}

:deep(.v-field__input) {
  color: white !important;
  background-color: #0a3327 !important;
  min-height: 40px !important;
}

:deep(.v-label) {
  color: #6bc4a8 !important;
  opacity: 0.9;
}

/* Fix autofill background color */
:deep(.v-field__input:-webkit-autofill),
:deep(.v-field__input:-webkit-autofill:hover),
:deep(.v-field__input:-webkit-autofill:focus),
:deep(.v-field__input:-webkit-autofill:active) {
  -webkit-text-fill-color: white !important;
  -webkit-box-shadow: 0 0 0 30px #0a3327 inset !important;
  transition: background-color 5000s ease-in-out 0s;
}

@keyframes autofill {
  from {
    background: transparent;
  }
  to {
    background: transparent;
  }
}

input:-webkit-autofill {
  animation-name: autofill;
  animation-fill-mode: both;
}

:deep(.autofilled) {
  background-color: #0a3327 !important;
}
</style>
