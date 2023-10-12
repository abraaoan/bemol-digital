<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const user = inject('user').value
const router = useRouter()

const logout = async () => {
  user.logout()
  await router.isReady();
  router.push({ name: 'login' });
}

onMounted(() => {
  if (!user.isLogged) {
    router.push({ name: 'login' });
  }
})

</script>

<template>
  <div class="container">
    <div class="col mb-4 mt-4">
      <div class="p-5 bg-body-tertiary rounded-3 text-center">
        <div class="row">
          <p>Name: {{ user.name }}</p>
          <p>Email: {{ user.email }}</p>
          <p>CEP: {{ user.cep }}</p>
          <p>Endereço: {{ user.endereco }}</p>
        </div>
      </div>
    </div>

    <button type="button" class="btn btn-outline-primary" v-on:click="logout">
      Logout
    </button>
  </div>
</template>
