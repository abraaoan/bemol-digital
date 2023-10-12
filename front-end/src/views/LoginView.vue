<script setup>
import Login from "../components/Login.vue"
</script>

<template>
  <div class="container col-xl-10 col-xxl-8 px-4 py-5">
    <div class="row align-items-center g-lg-5 py-5">
      <div class="col-lg-7 text-center text-lg-start">
        <h1 class="display-4 fw-bold lh-1 text-body-emphasis mb-3">Welcome to Bemol Digital challenger!</h1>
        <p class="col-lg-10 fs-4">With our easy-to-use app, you can track your products, set list, and more.</p>
      </div>
      <div class="col-md-10 mx-auto col-lg-5">
        <Login />
      </div>
    </div>
  </div>
</template>
