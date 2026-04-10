<script setup lang="ts">
definePageMeta({ shopChrome: false });

type Me = { id: number; username: string } | null;

useSeoMeta({ title: "Order History" });

const { data: me } = useFetch<Me>("/api/me", {
  key: "me",
});
</script>

<template>
  <main class="min-h-screen p-4">
    <h1 class="w-full border-b-2 border-accent1 text-left text-2xl text-accent1">
      Order History
    </h1>
    <div class="mx-auto flex max-w-md flex-col gap-4 text-black">
      <div v-if="me" class="border-t border-gray-200 pt-4">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm font-medium text-gray-500">
              <th class="w-1/2 pb-2">
                Product
              </th>
              <th class="w-1/4 pb-2">
                Last Order Date
              </th>
              <th class="w-1/4 pb-2">
                Purchase Order
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="3" class="py-8 text-center text-gray-500">
                You have no previous orders.
                <br>
                When you place an order, it will appear here.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="font-semibold text-black">
        Log in to view order history
      </p>
    </div>
  </main>
</template>
