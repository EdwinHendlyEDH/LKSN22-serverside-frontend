<template>
  <Nav :user="user" v-if="isLogin" :setLogin="setLogin" :setUser="setUser"/>

  <router-view @login="loggedIn" :user="user"/>
</template>

<script>
import {ref, onBeforeMount} from 'vue';
import {checkLogin} from '@/utils.js';
import Nav from '@/components/Nav.vue';

export default {
  name: "Formify",
  components: {Nav},
  setup(){
    const user = ref({});
    const isLogin = ref(false);

    const setLogin = (val) =>{
      isLogin.value = val;
    }

    const setUser = (val) =>{
      user.value = val;
    }

    onBeforeMount(async () => {
      const token = localStorage.getItem('token');
      const data = await checkLogin(token);

      if(data){
        user.value = data;
        isLogin.value = true;
      }     
    })

    const loggedIn = (data) => {
      console.log('awerawe')
      user.value = data;
      isLogin.value = true;
    }

    return {loggedIn, isLogin, user, setLogin, setUser}
  }
}

</script>
