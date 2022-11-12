<template>
  <nav class="navbar navbar-expand-lg sticky-top bg-primary navbar-dark">
      <div class="container">
        <a class="navbar-brand align-items-center" href="manage-forms.html">Formify</a>
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'Home'}">Home</router-link>
          </li> 
          <li class="nav-item">
            <router-link class="nav-link" :to="{name: 'ManageForms'}">Manage Forms</router-link>
          </li>
        </ul> 
        <ul class="navbar-nav ms-auto">
          <li class="nav-item d-flex align-items-center">
            <p class="nav-link">{{ username }}</p>
          </li> 
          <li class="nav-item">
            <button type="button" class="nav-link btn bg-white text-primary ms-4"  @click="logout">Logout</button>
          </li>
        </ul> 
      </div>
  </nav>
</template>
<script>
import { doFetch } from '@/utils';
import {useRouter} from 'vue-router';
import {ref} from 'vue';

export default {
    name: 'Nav',
    props: ['user', 'setLogin', 'setUser'],
    setup(props){
        const router = useRouter(); 
        const username = ref(props.user.name)

        const logout = async () => {
          const token = localStorage.getItem('token');
          const res = await doFetch(`/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization' : `Bearer ${token}`
            }
          });

          if(res.status == 200){
            localStorage.removeItem('token');
            props.setUser({});
            router.push({name: 'Login'});
            props.setLogin(false);
          }

        }

        return {username, logout};
    }
}
</script>
<style>
.router-link-active.router-link-exact-active{
  color: white;
}

.nav-link {
  margin-bottom: 0;
}
</style>