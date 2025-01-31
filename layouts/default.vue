<template>
  <div>
    <Header />
    <slot />
    <Footer />
    <ToastContainer />
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import ToastContainer from "~/components/ToastContainer.vue";
</script>
