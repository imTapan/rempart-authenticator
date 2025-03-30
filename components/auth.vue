<template>
  <div>
    <section class="pt-5">
      <h3 class="text-2xl text-center text-gray-800">
        You are currently Authernicated with...
      </h3>
      <div class="mt-10" v-if="authList?.length"></div>
      <div class="mt-10 text-center text-red-500" v-else>
        No Authernication found
      </div>
    </section>
    <div class="flex items-center justify-center mt-20">
      <UModal title="Add New Authernication" size="sm" class="w-96">
        <!-- <UButton label="Open" color="neutral" variant="subtle" /> -->

        <button
          class="mx-auto bg-gray-200 px-3 py-2 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold text-lg"
          @click="openAuthModal"
        >
          Authenticate me
        </button>
        <template #body>
          <div class="">
            <USelect v-model="selectedApp" value-key="name" :items="allApps" class="w-48" />
            <DatePicker />
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup>
const authList = [];

const allApps = ref([]);
const selectedApp = ref(null);

const { data } = await useFetch("/api/applications");
allApps.value = data;

function openAuthModal() {}
</script>
