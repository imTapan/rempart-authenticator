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
      <UModal
        title="Add New Authernication"
        description="select will modify if exists"
        size="sm"
        class="w-96"
      >
        <button
          class="mx-auto bg-gray-200 px-3 py-2 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold text-lg"
          @click="openAuthModal"
        >
          Authenticate me
        </button>
        <template #body>
          <div
            class="flex items-center justify-around gap-2 flex-col md:flex-row"
          >
            <USelect
              v-model="selectedApp"
              :items="allApps"
              class="w-48"
              placeholder="Please Select App"
            />
            <input
              type="datetime-local"
              v-model="selectedDateTime"
              class="border rounded h-8 border-gray-400/50 text-sm px-2"
            />
          </div>
          {{ selectedDateTime }}
          <div class="flex items-center justify-center">
            <button
              @click="newAuthenticate"
              class="mt-5 w-40 bg-gray-200 px-3 py-2 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold text-lg"
            >
              Add
            </button>
          </div>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup>
import { format } from "date-fns";

const authList = [];

const selectedApp = ref(null);
const selectedDateTime = ref(new Date());

const { data: apps } = await useFetch("/api/applications");
const allApps = toRaw(apps.value);

const demoCookie = useCookie("demoCookie");

function newAuthenticate() {
  console.log("newAuthenticate", selectedApp.value, selectedDateTime.value);
}

function openAuthModal() {}
</script>
