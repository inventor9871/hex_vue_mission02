<script setup>
import axios from 'axios';
import {  ref } from 'vue';
import { useRouter } from 'vue-router';


const api = 'https://todolist-api.hexschool.io'
const showDiv = ref({
  login: true,
  register: false,
  todos: false,
})

const showLogin = (data)=>{
  showDiv.value.login = data[0]
  showDiv.value.register = data[1]
  showDiv.value.todos = data[2]
}
const showRegister = ()=>{
  showDiv.value.login = false
  showDiv.value.register = true
  showDiv.value.todos = false
}
const showTodos = ()=>{
  showDiv.value.login = false
  showDiv.value.register = false
  showDiv.value.todos = true
}


const user = ref({
  email:'', password:'', nickname:'',
})
const password2 = ref('')
const checkpassword = ref('')


const registerData = ref('')
// 有UID

const registerBtn = async()=>{
try {
  checkpassword.value = '';
  if(user.value.password !== password2.value){
    checkpassword.value = '密碼不符合，請重新輸入'
  }else if(user.value.password.length<6){
    checkpassword.value = '密碼長度不符合，請重新輸入'
  }else{
    const res = await axios.post(`${api}/users/sign_up`, user.value)
    alert('註冊成功')
    console.log(res)
    registerData.value = res.data
    showLogin();
  }
} catch (error) {
    if(error.status){
      alert('帳號已經註冊過了')
    }else{
      alert('something wrong in the register')
    }
  }
}

const account = ref({
  email:'asd@asd.com', password: 'asdasd',
})

const loginData = ref('')
// 有token

const router = useRouter();
const nickname = ref('')

const loginBtn = async ()=>{
  try {

    const res = await axios.post(`${api}/users/sign_in`, account.value)
    loginData.value = res.data

    document.cookie = `todoName=${res.data.token};`;
    nickname.value = res.data.nickname
    showTodos();
    router.push('/todos')
  } catch (error) {

    alert(error.response.data.message)
    router.push('/')
  }
}




</script>
<template>
<!-- login_page -->
<div id="loginPage" class="bg-yellow" v-if="showDiv.login">
  <div class="conatiner loginPage vhContainer ">
    <div class="side">
      <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
      <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
    </div>
    <div>
      <form class="formControls" action="index.html">
        <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
        <label class="formControls_label" for="email">Email</label>
        <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="account.email">
        <span>此欄位不可留空</span>
        <label class="formControls_label" for="pwd">密碼</label>
        <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="account.password">
        <input class="formControls_btnSubmit" type="button"  value="登入" @click="loginBtn">
        <a class="formControls_btnLink" href="#" @click.prevent="showRegister">註冊帳號</a>
      </form>
    </div>
  </div>
</div>

<!-- register -->
<div id="signUpPage" class="bg-yellow" v-if="showDiv.register">
  <div class="conatiner signUpPage vhContainer">
    <div class="side">
      <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""></a>
      <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg">
    </div>
    <div>
      <form class="formControls" action="index.html">
        <h2 class="formControls_txt">註冊帳號</h2>
        <label class="formControls_label" for="email">Email</label>
        <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="user.email">
        <label class="formControls_label" for="name">您的暱稱</label>
        <input class="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱" v-model="user.nickname">
        <label class="formControls_label" for="pwd">密碼</label>
        <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required v-model="user.password">
        <label class="formControls_label" for="pwd2">再次輸入密碼</label>
        <input class="formControls_input" type="password" name="pwd2" id="pwd2" placeholder="請再次輸入密碼" required v-model="password2">
        <p class="text-danger formControls_btnLink pt-1">{{ checkpassword }}</p>
        <input class="formControls_btnSubmit" type="button"  value="註冊帳號" @click="registerBtn">
        <a class="formControls_btnLink" href="#loginPage"  @click.prevent="showLogin">登入</a>
      </form>
    </div>
  </div>

</div>

<!-- ToDo List -->

<RouterView
v-if="showDiv.todos"
  :nickname="nickname"
  @showLogin="showLogin"
  />

</template>
<style></style>
