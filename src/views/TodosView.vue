<template>
  <!-- ToDo List -->
<div id="todoListPage" class="bg-half"  >
  <nav>
    <h1><a href="#/todos">ONLINE TODO LIST</a></h1>
    <ul>
      <li class="todo_sm"><a href="#/todos"><span>{{ nickname }} 的代辦</span></a></li>
      <li><a href="#/todos" @click.prevent="signout">登出</a></li>
    </ul>
  </nav>
  <div class="conatiner todoListPage vhContainer">
    <div class="todoList_Content">
      <div class="inputBox">
        <input type="text" placeholder="請輸入待辦事項" v-model="newTodo.content">
        <a href="#" @click.prevent="addTodo">
          <i class="fa fa-plus"></i>
        </a>
      </div>
      <div class="todoList_list">
        <ul class="todoList_tab">
          <li><a href="#"
            :class="[isActive == 1 ? 'active' : '']"
            @click.prevent ="allTodos()">全部</a></li>
          <li><a href="#"
            :class="[isActive == 2 ? 'active' : '']"
            @click.prevent="notyetTodos()">待完成</a></li>

          <li><a href="#"
            :class="[isActive == 3 ? 'active' : '']"
            @click.prevent="okTodos()">已完成</a></li>
        </ul>
        <div class="todoList_items">
          <ul class="todoList_item">
            <li v-for="item in tempList" :key="item.id">
            <!-- <li> -->
              <label class="todoList_label">
                <input class="todoList_input" type="checkbox"
                v-model="item.status"
                @change="checkTodo(item.id)"
                >
                <span>{{ item.content }}
                </span>
              </label>
              <a href="#" @click.prevent="delTodo(item.id)"><i class="fa fa-times"></i>
              </a>
            </li>

          </ul>
          <div class="todoList_statistics">


            <p v-if="isActive==1"> 全部總共有 {{ tempLength }} 個項目</p>
            <div v-if="isActive==2">
              <p v-if="tempLength>0"> 尚未完成 {{ tempLength }} 個項目</p>
              <p v-else>目前尚無待辦事項</p>
            </div>

            <p v-if="isActive==3"> 已完成 {{ tempLength }} 個項目</p>

          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import axios from 'axios';
import {  onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const api = 'https://todolist-api.hexschool.io'

const todosList = ref([])

const tempList = ref([])

const token = document.cookie.replace(/(?:^|.*;\s*)todoName\s*=\s*([^;]*).*$/i, "$1");



const getTodos = async()=>{
  const res = await axios.get(`${api}/todos/`, {
    headers: { authorization: token}
  })
  todosList.value = res.data.data
  tempList.value = res.data.data
  tempLength.value = tempList.value.length

}

defineProps(['nickname',  ])
const emit = defineEmits(['showLogin', ])


onMounted(()=>{
  getTodos();

})

const isActive = ref(1)
const tempLength = ref(0)

const allTodos = ()=>{
  getTodos();
  isActive.value = 1
  tempList.value = todosList.value
  tempLength.value = tempList.value.length
}

const notyetTodos = ()=>{
  isActive.value = 2
  tempList.value = todosList.value.filter(x=>x.status===false)
  tempLength.value = tempList.value.length
}

const okTodos = ()=>{
  isActive.value = 3
  tempList.value = todosList.value.filter(x=>x.status===true)
  tempLength.value = tempList.value.length
}



const newTodo = ref({
  content: '',
})

const router = useRouter();

const  addTodo = async()=>{
  try {
    await axios.post(`${api}/todos`, newTodo.value, {headers: {
      authorization: token
    }})
    newTodo.value.content = '';
    getTodos();
    allTodos();

    router.push('/todos');
  } catch (error) {
    console.log('addTodo error, ', error)
  }
}


const delTodo = async(id)=>{
  try {
    await axios.delete(`${api}/todos/${id}`, {
      headers:{authorization: token, }
    })
    const index = tempList.value.findIndex(x=>x.id === id)
    tempList.value.splice(index, 1)
    tempLength.value = tempList.value.length
    upddateTodos();
    alert('刪除成功')
  } catch (error) {
    console.log('deltodo error , ', error)
  }
}

const upddateTodos = async()=>{
  const res = await axios.get(`${api}/todos/`, {
    headers: { authorization: token}
  })
  todosList.value = res.data.data
}

const checkTodo = async(id)=>{
  try {
    await axios.patch(`${api}/todos/${id}/toggle`,null, { headers:{authorization: token, },
      })
      if(isActive.value!==1){
        const index = tempList.value.findIndex(x=>x.id === id)
        tempList.value.splice(index, 1)
        tempLength.value = tempList.value.length;
      }
  } catch (error) {
    console.log('checkTodo error，', error)
  }
}


const signout = async()=>{
  try {
    const res = await axios.post(`${api}/users/sign_out`, {},
  { headers: { authorization: token, }})
  alert(res.data.message)
    emit('showLogin', [true, false, false]);
  router.push('/')
  } catch (error) {
    console.log('signout error, ', error)
  }
}

</script>
