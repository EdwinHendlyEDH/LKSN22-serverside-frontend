<template>
    <div class="hero py-5 bg-light">
        <div class="container text-center"> 
            <button class="position-absolute btn btn-primary btn-sm" style="left: 1rem" @click="prevUri"> Back</button> 
           <h2 class="mb-3">
              {{ form.name }}
           </h2> 
           <div class="text-muted">
              {{ form.description }}
           </div>
        </div>
     </div>

     <div class="py-5">
        <div class="container"> 

           <div class="row justify-content-center ">
              <div class="col-lg-5 col-md-6"> 

                 <div class="text-muted">
                    <span class="text-primary" v-if="response.user">{{ response.user.email }}</span> <small><i>(responded)</i></small>
                 </div>
                 
                 <form>
                    <div class="form-item card card-default my-4" v-for="answer in response.answers">
                       <div class="card-body">
                          <div class="form-group">
                             <label class="mb-1">{{ answer.question.name }} <span class="text-danger">*</span></label>
                             <input type="text" placeholder="Your answer" class="form-control" v-if="['short answer'].includes(answer.question.choice_type)" :value="answer.value" disabled/>

                             <input type="date" class="form-control" v-if="['date'].includes(answer.question.choice_type)" :value="answer.value" disabled/>
                             
                             <textarea id="address" rows="4" placeholder="Your answer" class="form-control" name="address" v-if="['paragraph'].includes(answer.question.choice_type)" disabled>{{ answer.value }}</textarea>


                              <div class="form-check" v-if="['multiple choices'].includes(answer.question.choice_type)" v-for="opt in answer.question.choices.split(',')">
                                 <input v-if="answer.value === opt" class="form-check-input" type="radio" :value="opt.trim()" checked disabled/>
                                 <input v-else class="form-check-input" type="radio" :value="opt.trim()" disabled/>
                                 <label class="form-check-label " style="opacity: .9;">
                                    {{ opt.trim() }}
                                 </label>
                              </div>

                              <div class="form-check" v-if="['checkboxes'].includes(answer.question.choice_type)" v-for="opt in answer.question.choices.split(',')">
                                 <input v-if="answer.value.split(',').includes(opt)" class="form-check-input" type="checkbox" :value="opt" checked disabled/>
                                 <input v-else class="form-check-input" type="checkbox" :value="opt" disabled/>
                                 <label class="form-check-label" style="opacity: .9;">
                                   {{ opt.trim() }}
                                 </label>
                              </div>

                              <select class="form-select" v-if="['dropdown'].includes(answer.question.choice_type)" :value="answer.value" disabled style="opacity: .9;">
                                 <option v-for="opt in answer.question.choices.split(',')" :value="opt">{{ opt.trim() }}</option>
                             </select>

                          </div>  

                       </div>

                    </div>
  
                 </form>
                 {{ questions }}
              </div>
            </div>  
           
        </div>
     </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {doFetch} from '@/utils.js';

export default {
   name: "Detail Response",
   props: ['slug', 'id'],
   setup(props){
      const form = ref({});
      const response = ref({});
      const router = useRouter();

      const getForm = async () => {
        const token = localStorage.getItem('token');
        const res = await doFetch(`/forms/${props.slug}/responses/${props.id}`, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        });
        const data = await res.json();

        if(res.status == 200){
            form.value = data.form;
            response.value = data.response

        }else if(res.status == 404){
            router.push({name: 'NotFound'});      
        }
      }

      const prevUri = () => {
         router.go(-1);
      }

      

      onMounted(() => {
         getForm();
      });

      return {form, response, prevUri}
   }

}

</script>