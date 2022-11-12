<template>
    <div class="hero py-5 bg-light">
        <div class="container text-center"> 
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
                    <span class="text-primary">{{ user.email }}</span> <small><i>(shared)</i></small>
                 </div>

                 <div class="alert alert-danger mt-3 mb-2" v-if="errorTwiceSubmit.message">
                  {{ errorTwiceSubmit.message }}
                 </div>
                 
                 <form @submit.prevent="submit">
                     <div v-if="questions.length">
                    <div class="form-item card card-default my-4" :class="`${errorRequired.required_question_id?.includes(question.id) ? 'border-danger' : ''}`" v-for="(question, index) in form.questions" :key="question.id">
                        <div class="card-body">
                           <div class="form-group">
                              <label class="mb-1">{{ question.name }} <span class="text-danger">*</span></label>
                              <input type="text" placeholder="Your answer" class="form-control" v-if="['short answer'].includes(question.choice_type)" v-model="questions[index].value"/>

                              <input type="date" class="form-control" v-if="['date'].includes(question.choice_type)" v-model="questions[index].value"/>
                              
                              <textarea id="address" rows="4" placeholder="Your answer" class="form-control" name="address" v-if="['paragraph'].includes(question.choice_type)" v-model="questions[index].value"></textarea>


                                 <div class="form-check" v-if="['multiple choices'].includes(question.choice_type)" v-for="opt in question.choices.split(',')">
                                    <input class="form-check-input" type="radio" :value="opt.trim()" v-model="questions[index].value"/>
                                    <label class="form-check-label">
                                       {{ opt.trim() }}
                                    </label>
                                 </div>

                                 <div class="form-check" v-if="['checkboxes'].includes(question.choice_type)" v-for="opt in question.choices.split(',')">
                                    <input class="form-check-input" type="checkbox" :value="opt" v-model="questions[index].value"/>
                                    <label class="form-check-label">
                                    {{ opt.trim() }}
                                    </label>
                                 </div>

                                 <select class="form-select" v-if="['dropdown'].includes(question.choice_type)" v-model="questions[index].value">
                                    <option v-for="opt in question.choices.split(',')" :value="opt">{{ opt.trim() }}</option>
                              </select>

                           </div>  

                           <!-- error -->
                           <p class="text-danger mt-1" style="font-size: .9rem" v-if="errorRequired.required_question_id?.includes(question.id)">{{ errorRequired.message }}</p>
                        </div>

                        </div>
                        <div class="mt-4">
                           <button class="btn btn-primary" type="submit">Submit</button>
                        </div>
                     </div>
  
                    <h4 v-else class="mt-4">No questions :)</h4>
                    
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
   name: "Submit Form",
   props: ['slug', 'user'],
   setup(props){
      const form = ref({});
      const questions = ref([]);
      const router = useRouter();
      const errorFields = ref({});
      const errorRequired = ref({});
      const errorTwiceSubmit = ref({});


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

            for(let q of data.form.questions){
               questions.value.push({question_id: q.id, value: q.choice_type !== 'checkboxes' ? '' : []});
            }


         }else if(res.status == 404){
            router.push({name: 'NotFound'});      
         }
      }


      const submit = async () => {
         console.log({answers: typeof questions.value !== 'array' ? questions.value : questions.value.join(',')});
         const token = localStorage.getItem('token');
         const res = await doFetch(`/forms/${props.slug}/responses`, {
            method: 'POST',
            headers: {
               'Authorization' : `Bearer ${token}`
            },
            body : JSON.stringify({
               answers: questions.value.map(a => ({...a, value: Array.isArray(a.value) ? a.value.join(',') : a.value}))
            })
         });
         const data = await res.json();

         if(res.status == 200){
            router.push({name: 'FinishResponse'})
         }else if (res.status == 422){
            const error_type = data.error_type;

            if(error_type == 'error-submit-twice'){
               errorTwiceSubmit.value = {message: data.message};

            } else if(error_type == 'error-required'){
               errorRequired.value = data;

            } else if(error_type == 'error-fields'){
               errorFields.value = data.errors;
            }
         }
      }

      onMounted(() => {
         getForm();
      });

      return {form, questions, submit, errorFields, errorTwiceSubmit, errorRequired}
   }

}

</script>