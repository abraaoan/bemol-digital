<template>
  <div class="container">
    <h1 style="margin-top: 20px; margin-bottom: 20px;">Register</h1>
    <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary">
      <div class="form-floating mb-3">
        <input type="text" id="floatingNameInput" v-bind:class="{ 'form-control': true, 'is-invalid': !nameIsInvalid }"
          placeholder="Name" v-model="name" required />
        <label for="floatingNameInput">Name</label>
        <div id="validationEmailFeedback" class="invalid-feedback">
          Please fill with your name with at least 3 characters.
        </div>
      </div>
      <div class="form-floating mb-3">
        <input type="email" id="floatingInput" placeholder="name@example.com" v-model="email"
          v-bind:class="{ 'form-control': true, 'is-invalid': !emailIsvalid }" required />
        <label for="floatingInput">Email address</label>
        <div id="validationEmailFeedback" class="invalid-feedback">
          Please enter a valid email.
        </div>
      </div>
      <div class="form-floating mb-3">
        <input type="password" v-bind:class="{ 'form-control': true, 'is-invalid': !passIsInvalid }" id="floatingPassword"
          placeholder="Password" v-model="pass" required>
        <label for="floatingPassword">Password</label>
        <div id="validationEmailFeedback" class="invalid-feedback">
          The password must contain at least one special character, a number, 6 digit and an uppercase letter.
        </div>
      </div>
      <div class="form-floating mb-3">
        <input type="text" v-bind:class="{ 'form-control': true, 'is-invalid': !cepIsInvalid }" id="floatingCep"
          placeholder="CEP" v-model="cep" v-on:blur="fetchCepAddress" required>
        <label for="floatingCep">CEP</label>
        <div id="validationEmailFeedback" class="invalid-feedback">
          CEP must have only numbers and must have 7 digits.
        </div>
      </div>
      <div class="form-floating mb-3">
        <input type="text" v-bind:class="{ 'form-control': true, 'is-invalid': !addressIsInvalid }" id="floatingEndereco" placeholder="Endereço"
          v-model="endereco" disabled="true" required>
        <label for="floatingEndereco">Endereço</label>
        <div id="validationEmailFeedback" class="invalid-feedback">
          The CEP not correspond to a valid address. Please check your CEP!
        </div>
      </div>
      <button class="w-100 btn btn-lg btn-primary" style="margin-top: 10px;" @click="submit"
        v-bind:style="{ 'display': !isLoading ? 'inline' : 'none' }">Sign up</button>
      <button class="btn btn-lg btn-primary w-100" type="button" disabled
        v-bind:style="{ 'display': isLoading ? 'inline' : 'none' }">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...
      </button>
      <hr class="my-4">
      <small class="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import paths from '../network/paths';

const request = inject('request')
const router = useRouter()
const email = ref(null);
const pass = ref(null);
const name = ref(null);
const cep = ref(null);
const endereco = ref(null);
var emailIsvalid = ref(true);
var passIsInvalid = ref(true);
var nameIsInvalid = ref(true);
var cepIsInvalid = ref(true);
var addressIsInvalid = ref(true);
var isSomethingWrong = ref(false);
var isLoading = ref(false);

const validateEmail = (email) => {
  if (!email) { return false }
  const re = /(.+)@(.+){2,}\.(.+){2,}/;
  return re.test(email.toLowerCase());
}

const validatePassWord = (pass) => {
  if (!pass) { return false }
  const re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
  return re.test(pass);
}

const validateName = (name) => {
  if (!name) { return false }
  if (name === '') { return false }
  if (name.length < 3) { return false }
  return true;
}

const validateCep = (cep) => {
  if (!cep) { return false }
  if (isNaN(cep)) { return false }
  if (cep === '') { return false }
  if (cep.length > 8) { return false }
  return true;
}

const allFieldsOkay = () => {
  if (!validateEmail(email.value)) {
    emailIsvalid.value = false
    return false
  }

  if (!validatePassWord(pass.value)) {
    passIsInvalid.value = false
    return false
  }

  if (!validateName(name.value)) {
    nameIsInvalid.value = false
    return false
  }

  if (!validateCep(cep.value)) {
    cepIsInvalid.value = false
    return false
  }

  return true
}

watch([name, email, pass, cep], ([newName, newEmail, newPass, newCep]) => {
  if (newCep)
    cepIsInvalid.value = validateCep(newCep);
  if (newName)
    nameIsInvalid.value = validateName(newName);
  if (newEmail)
    emailIsvalid.value = validateEmail(newEmail);
  if (newPass)
    passIsInvalid.value = validatePassWord(newPass);
})

const submit = (e) => {
  e.preventDefault();

  if (!allFieldsOkay()) { return }

  const data = {
    name: name.value,
    email: email.value,
    password: pass.value,
    profileImage: "😎",
    cep: cep.value,
    endereco: endereco.value
  }

  isLoading.value = true;

  request.value.fetch(paths.register, result => {
    isSomethingWrong.value = !result.success;
    isLoading.value = false;

    console.log(result);

    if (result.success) {
      backHome()
    }
  }, { data })
}

const fetchCepAddress = () => {
  if (!validateCep(cep.value)) { return }

  request.value.fetch(paths.cep, result => {
    isSomethingWrong.value = !result.success
    isLoading.value = false
    addressIsInvalid.value = !result.erro

    if (!result.erro) {
      endereco.value = `${result.logradouro}, ${result.bairro} - ${result.localidade}`
    }
  }, { cep: cep.value })
}

onMounted(async () => {
  if (localStorage.user) {
    backHome()
  }
})

const backHome = async () => {
  await router.isReady();
  router.push({ name: 'login' });
}

</script>
