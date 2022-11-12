<template>
      <ManagementHeading :form="form" />

     <div class="py-5">
        <div class="container"> 

           <div class="row justify-content-center ">
              <div class="col-lg-5 col-md-6"> 
                 <div class="input-group mb-5">
                  <input type="text" class="form-control form-link" readonly :value="formUrl"/>
                    <a class="btn btn-primary" @click="copyUrl">Copy</a>
                 </div>

                 <ul class="nav nav-tabs mb-2 justify-content-center">
                     <li class="nav-item">
                        <router-link :to="{name: 'DetailForm', params: {slug: slug}}" class="nav-link">Questions</router-link>
                     </li>
                     <li class="nav-item">
                        <router-link :to="{name: 'Responses', params: {slug: slug}}" class="nav-link active">Responses</router-link>
                     </li> 
                  </ul>
              </div>
            </div>

           <div class="row justify-content-center" v-if="responses.length">
              <div class="col-lg-10"> 

                  <div class="cards d-flex flex-wrap gap-4 justify-content-center">
                     <div class="card my-3" v-for="response in responses" style="width: 18rem">
                        <div class="card-body">
                           <span class="text-muted mb-1 d-block">Response {{ response.created_at.split('T').join(' ').split('.')[0] }}</span>
                        <h5 class="card-title">From: {{ response.user.email }}</h5>
                        <router-link :to="{name: 'DetailResponse', params: {id : response.id}}" class="btn btn-primary btn-sm mt-2">See response</router-link>
                        </div>
                     </div>
                  </div>

              </div>  
           </div> 
           
           <h3 v-else class="mt-3 text-center">
               {{ noResponses ? 'Currently No Responses' : 'Load...' }}
         </h3>
           
        </div>
     </div>
</template>
<script>
import { doFetch } from '@/utils';
import {ref, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import ManagementHeading from '@/components/ManagementHeading.vue';
import {URL_BASE} from '@/config.js';

export default {
   name: "Responses Page",
   props: ['slug'],
   components: {ManagementHeading},
   setup(props){
      const formUrl = ref(`${URL_BASE}/forms/${props.slug}/response`);
      const router = useRouter();
      const form = ref({});
      const responses = ref([]);
      const noResponses = ref(false);

      const getForm = async () => {
         const token = localStorage.getItem('token');
            const res = await doFetch(`/forms/${props.slug}`, {
               headers: {
                  'Authorization' : `Bearer ${token}`
               }
            });
         const data = await res.json();

         if(res.status == 200){
            form.value = data.form;
         }else if(res.status == 404){
            router.push({name: 'NotFound'});
         }

      }


      const getResponses = async () => {
         const token = localStorage.getItem('token');

         const res = await doFetch(`/forms/${props.slug}/responses`, {
            headers: {
               'Authorization' : `Bearer ${token}`
            }
         });

         const data = await res.json();

         if(res.status === 200){
            if(data.responses.length == 0){
               noResponses.value = true;
            }
            responses.value = data.responses;
         }

      }

      const copyUrl = async () => {
         await navigator.clipboard.writeText(formUrl.value);
      }

      onMounted(() => {
         getForm();
         getResponses();
      })


      return {responses, form, noResponses, formUrl, copyUrl}
   }
}
</script>