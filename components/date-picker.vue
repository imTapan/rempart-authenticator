<template>
  --{{ value }}
  <input
    type="datetime-local"
    :value="selectedDateTime"
    @input="onDateTimeChange"
    :max="maxDateTime"
  />
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

// Define props
const props = defineProps({
  value: {
    type: [String, Date],
    required: true,
  },
  cookieExpiry: {
    type: String,
    default: "",
  },
  maxDateTime: {
    type: String,
    default: "2030-12-31T23:59", // Example max date-time
  },
});

// Define emits
const emit = defineEmits();

// Reactive state for the selected date-time
const selectedDateTime = ref(props.value || props.cookieExpiry);

// Watch for changes in the cookieExpiry prop to update the internal state
watch(
  () => props.cookieExpiry,
  (newVal) => {
    if (newVal) {
      selectedDateTime.value = newVal;
    }
  }
);

// Handle the date-time change and emit events
const onDateTimeChange = (event) => {
  const newDateTime = event.target.value;
  selectedDateTime.value = newDateTime;
  emit("update:value", newDateTime); // For v-model binding
  emit("datetime-selected", newDateTime); // Custom event for parent
};
</script>

<style scoped>
/* Add custom styles for the datetime picker */
label {
  font-size: 14px;
  margin-right: 10px;
}
input {
  padding: 5px;
  font-size: 14px;
}
</style>
