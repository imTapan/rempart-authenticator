<template>
  <div class="flex items-center flex-col w-full">
    <section class="pt-5 w-full">
      <h3 class="text-2xl text-center text-gray-800">
        You are currently Authernicated with...
      </h3>
      <div
        class="mt-14 max-w-xl mx-auto p-10 flex items-center justify-center"
        v-if="isLoading"
      >
        <UIcon name="mdi:loading" size="30" class="animate-spin" />
      </div>
      <div class="mt-14 max-w-xl mx-auto" v-else-if="authList?.length">
        <UTable
          :data="authList"
          :columns="columns"
          class="border border-gray-300 rounded flex-1"
        />
      </div>
      <div class="mt-10 text-center text-red-500" v-else>
        No Authernication found
      </div>
    </section>
    <div class="flex items-center justify-between gap-4">
      <button
        @click="updateAuthList()"
        class="mx-auto mt-10 bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold text-lg"
        :disabled="isLoading"
      >
        Update List
      </button>
      <button
        @click="authModal = true"
        class="mx-auto mt-10 bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold text-lg"
        :disabled="isLoading"
      >
        Authenticate more
      </button>
    </div>
    <div class="flex items-center justify-center mt-20">
      <UModal
        title="Add New Authernication"
        description="select will modify if exists"
        v-model:open="authModal"
        size="sm"
        class="w-lg"
      >
        <template #body>
          <div
            class="flex items-center justify-around gap-2 flex-col md:flex-row"
          >
            <div>
              <div class="text-gray-500 text-xs">Select App</div>
              <USelect
                v-model="selectedApp"
                :items="allApps"
                class="w-48 mt-0.5"
                placeholder="Please Select App"
              />
            </div>
            <div>
              <div class="text-gray-500 text-xs">Select Duration</div>
              <input
                type="datetime-local"
                v-model="formattedDateTime"
                class="border rounded h-8 mt-0.5 border-gray-400/50 text-sm px-2"
              />
            </div>
          </div>
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

const UDropdownMenu = resolveComponent("UDropdownMenu");
const UButton = resolveComponent("UButton");
const toast = useToast();

const authList = ref([]);
const authModal = ref(false);
const selectedApp = ref(null);
const isLoading = ref(true);
const selectedDateTime = ref(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
const cookieDomain = ".netlify.app";

const formattedDateTime = computed({
  get() {
    return format(selectedDateTime.value, "yyyy-MM-dd'T'HH:mm");
  },
  set(value) {
    selectedDateTime.value = new Date(value);
  },
});

const columns = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => {
      return h("div", { class: "" }, row.index + 1);
    },
  },
  {
    accessorKey: "app.label",
    header: "App",
  },
  // {
  //   accessorKey: "token",
  //   header: "Token",
  // },
  {
    accessorKey: "expires",
    header: "Expires",
    cell: ({ row }) => {
      return h("div", format(row.getValue("expires"), "dd MMM yyyy - hh:mm a"));
    },
  },
  {
    header: "Link",
    cell: ({ row }) => {
      return h(
        "div",
        h(UButton, {
          onClick: () => openApp(row),
          icon: "material-symbols:open-in-new-rounded",
          variant: "ghost",
          class: "cursor-pointer",
        })
      );
    },
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        h(UButton, {
          onClick: () => deleteApp(row),
          icon: "material-symbols:delete-outline",
          color: "error",
          variant: "ghost",
          class: "cursor-pointer",
        })
      );
    },
  },
];

// Fetch the list of applications from the API
const { data: apps } = await useFetch("/api/applications");
const allApps = toRaw(apps.value);

function newAuthenticate() {
  if (!selectedApp.value || !selectedDateTime.value) {
    toast.add({
      title: "Please select an app and a date",
      color: "error",
    });
    return;
  }
  if (selectedDateTime.value < new Date()) {
    toast.add({
      title: "Please select a future date",
      color: "error",
    });
    return;
  }

  // Set Cookie
  const demoCookie = useCookie(selectedApp.value, {
    expires: selectedDateTime.value,
    domain: cookieDomain,
  });
  const token = generateToken();
  demoCookie.value = token;

  toast.add({
    title: "You are Authenticated",
    color: "success",
  });
  updateAuthList();
  authModal.value = false;
}

function updateAuthList() {
  isLoading.value = true;
  authList.value = [];
  setTimeout(() => {
    allApps.value.forEach((app, index) => {
      const cookie = useCookie(app.value, {
        domain: cookieDomain,
      });

      if (cookie.value) {
        authList.value.push({
          index: index,
          app,
          token: cookie.value,
          expires: format(selectedDateTime.value, "yyyy-MM-dd'T'HH:mm"),
        });
      }
      isLoading.value = false;
    });
  }, 2000);
}

function deleteApp(data) {
  const app = data?.original?.app;
  if (!app) return null;
  const cookie = useCookie(app.value, {
    domain: cookieDomain,
  });
  cookie.value = null;
  updateAuthList();
  toast.add({
    title: "Cookie Deleted",
    color: "success",
  });
}

function openApp(data) {
  const appSite = data?.original?.app?.site;
  if (!appSite) return null;
  window.open(appSite, "_blank");
}

updateAuthList();
</script>
