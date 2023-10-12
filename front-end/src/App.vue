<script setup>
import { ref, provide } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import User from './models/User'
import Request from './network/Request'

const router = useRouter()
const user = ref(new User(localStorage))
const request = ref(new Request(user.value, router))

provide('request', request)
provide('user', user)

</script>

<template>
  <Navbar />
  <RouterView />
</template>
