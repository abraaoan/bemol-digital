<template>
  <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
    <div class="form-floating mb-3">
      <input type="email"
        id="floatingInput"
        placeholder="name@example.com"
        v-model="email"
        class="form-control"
        required />
      <label for="floatingInput">Email address</label>
    </div>
    <div class="form-floating mb-3">
      <input type="password"
       class="form-control"
       id="floatingPassword" 
       placeholder="Password" 
       v-model="pass" 
       required>
      <label for="floatingPassword">Password</label>
    </div>
    <div class="checkbox mb-3">
      <label>
        <input type="checkbox" v-model="remeberMe" value="remeber-me"> Remember me
      </label>
    </div>
    <button 
      v-bind:class="{'form-control': true, 'is-invalid' : isSomethingWrong}"
      class="w-100 btn btn-lg btn-primary"
      v-bind:style="{'display': !isLoading ? 'inline' : 'none'}"
      @click="submit">Sign in</button>
    <div id="validationFormFeedback" class="invalid-feedback">
      Something went wrong 😕
    </div>
    <button class="btn btn-lg btn-primary w-100" type="button" disabled v-bind:style="{'display': isLoading ? 'inline' : 'none'}">
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Loading...
    </button>
    <a class="w-100 btn btn-lg btn-outline-primary" style="margin-top: 10px;" href="/register">Sign up</a>
    <hr class="my-4">
    <small class="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
  </form>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import paths from '../network/paths';
import Request from '../network/Request'

const request = inject('request')
const user = inject('user')
const router = useRouter()
const email = ref(null);
const pass = ref(null);
var remeberMe = ref(false);
var isSomethingWrong = ref(false);
var isLoading = ref(false);

const submit = async (e) => {
  e.preventDefault();
  
  if (!validateEmail(email.value)) {
    return
  }

  if (!validatePassWord(pass.value)) {
    return
  }

  const data = {
    email: email.value,
    password: pass.value
  }

  isSomethingWrong.value = false
  isLoading.value = true;

  request.value.fetch(paths.login, async result => {
    if (result.success) {
      await user.value.login(result.user)
      request.value = new Request(user.value, router)
      goHome();
    }

    isSomethingWrong.value = !result.success;
    isLoading.value = false;

  }, {data})
};

const validateEmail = (email) => {
  if (!email) { return false }
  if (email === '') { return false }
  return true;
}

const validatePassWord = (pass) => {
  if (!pass) { return false }
  if (pass === '') { return false }
  return true;
}

onMounted(async () => {
  if (user.value.isLogged) {
    router.push({ name: 'home' });
  }
})

const goHome = async () => {
  await router.isReady();
  router.push({name: 'home'});
}

</script>
<script>
export default {
  name: 'LoginComp',
}
</script>
