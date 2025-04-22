<script setup>
const props = defineProps(['formSuccessMessage', 'formErrorMessage'])
</script>

<template>
  <v-alert
    v-if="props.formSuccessMessage"
    :text="props.formSuccessMessage"
    title="Success!"
    type="success"
    variant="tonal"
    density="compact"
    boarder="start"
    class="mb-5"
    closable
  >
  </v-alert>

  <v-alert
    v-if="props.formErrorMessage"
    :text="props.formErrorMessage"
    title="Ooops!"
    type="error"
    variant="tonal"
    density="compact"
    boarder="start"
    class="mb-5"
    closable
  >
  </v-alert>
</template>
