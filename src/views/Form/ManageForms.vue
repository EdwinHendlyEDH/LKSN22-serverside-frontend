<template>
    <div class="hero py-5 bg-light">
        <div class="container">
           <router-link :to="{name: 'CreateForm'}" class="btn btn-primary">
              Create Form
           </router-link>
        </div>
     </div>

     <div class="list-form py-5">
        <div class="container">
           <h6 class="mb-3">List Form</h6>

           <router-link 
           v-for="form in forms" 
           :to="{name: 'DetailForm', params: {slug: form.slug}}" 
           class="card card-default mb-3" 
           v-if="forms.length">
              <div class="card-body">
                 <h5 class="mb-1">{{ form.name }}</h5>
                 <small class="text-muted">@{{ form.slug }} {{ form.limit_one_response ? '(limit for 1 response)' : '' }}</small>
              </div>
            </router-link>

           <h3 v-else>
                {{ noForms ? 'Currently No form' : 'Load...' }}
           </h3>

        </div>
     </div>
</template>
<script>
import {doFetch} from '@/utils.js';
import {ref, onMounted} from 'vue';

export default {
    name: "Manage Forms",
    props: ['user'],
    setup(props){
        const forms = ref([]);
        const noForms = ref(false);
        
        const getAllForms = async () => {

            const token = localStorage.getItem('token');
            const res = await doFetch(`/auth/me/${props.user.id}`, {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            });
            const data = await res.json();

            if(res.status == 200){
                if(!data.forms.length){
                    noForms.value = true;
                };
                forms.value = data.forms;
            }
        }

        onMounted(() => {
            getAllForms();
        });

        return {forms, noForms}
    }
}
</script>