<template>
    <ManagementHeading :form="form"/>

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
                        <router-link :to="{name: 'DetailForm', params: {slug: slug}}" class="nav-link active">Questions</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name: 'Responses', params: {slug: slug}}" class="nav-link">Responses</router-link>
                    </li> 
                </ul>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-md-6"> 
                    <button @click="clearAll" class="btn btn-danger mt-3" style="width: 100%">Clear all questions</button>
                    <div class="question-item card card-default border-primary my-4">
                        <div class="card-body">
                           <form>
                              <div class="form-group my-3">
                                 <input type="text" placeholder="Question" class="form-control" name="name" v-model="createModel.name"/>
                                 <div class="text-danger" v-if="createFieldErrors.name">
                                    <p v-for="err in createFieldErrors.name">{{ err }}</p>
                                </div>
            
                              </div> 
      
                              <div class="form-group my-3">
                                 <select name="choice_type" class="form-select" v-model="createModel.choice_type" @input="showChoicesIfNeeded($event, 'createModel')">
                                    <option>Choice Type</option>
                                    <option value="short answer">Short Answer</option>
                                    <option value="paragraph">Paragraph</option>
                                    <option value="date">Date</option>
                                    <option value="multiple choices">Multiple Choices</option>
                                    <option value="dropdown">Dropdown</option>
                                    <option value="checkboxes">Checkboxes</option>
                                 </select>
                                 <div class="text-danger" v-if="createFieldErrors.choice_type">
                                    <p v-for="err in createFieldErrors.choice_type">{{ err }}</p>
                                </div>
                              </div>

                            <div class="form-group my-3" v-if="createModelChoices">
                                <textarea placeholder="options1,options2,options3" class="form-control" name="choices" rows="4" style="resize: none;" v-model="createModel.choices"></textarea>
                                <div class="form-text">
                                   Separate choices using comma ",".
                                 </div>
                                 <div class="text-danger" v-if="createFieldErrors.choices">
                                    <p v-for="err in createFieldErrors.choices">{{ err }}</p>
                                </div>
                             </div>

                              <div class="form-check form-switch" aria-colspan="my-3">
                                 <input class="form-check-input" type="checkbox" role="switch" id="required" v-model="createModel.is_required"/>
                                 <label class="form-check-label" for="required">Required</label>
                               </div>
                              <div class="mt-3">
                                 <button type="button" class="btn btn-outline-primary" @click="createQuestion">Create</button>
                               </div>  
                           </form>
                        </div>
                     </div> 

                    <div class="question-item  card card-default my-4" v-for="(question, index) in form.questions">
                        <div class="card-body">
                            <div class="form-group my-3">
                                <input type="text" placeholder="Question" class="form-control" name="name" v-model="existModel[index].name"/>
                                <div class="text-danger" v-if="existFieldErrors[index].name">
                                    <p v-for="err in existFieldErrors[index].name">{{ err }}</p>
                                </div>
                            </div> 

                            <div class="form-group my-3">
                                <select name="choice_type" class="form-select" v-model="existModel[index].choice_type" @input="showChoicesIfNeeded($event, 'existModel', index)">
                                    <option>Choice Type</option>
                                    <option v-for="choice in choicesType" :value="choice">{{ choice }}</option>
                                </select>
                                <div class="text-danger" v-if="existFieldErrors[index].choice_type">
                                    <p v-for="err in existFieldErrors[index].choice_type">{{ err }}</p>
                                </div>
                            </div>

                            <div class="form-group my-3" v-if="existModelChoices[index]">
                                <textarea placeholder="options1,options2,options3" class="form-control" name="choices" rows="4" style="resize: none;" v-model="existModel[index].choices"></textarea>
                                <div class="form-text">
                                   Separate choices using comma ",".
                                 </div>
                                 <div class="text-danger" v-if="existFieldErrors[index].choice_type">
                                    <p v-for="err in existFieldErrors[index].choice_type">{{ err }}</p>
                                </div>
                             </div>

                            <div class="form-check form-switch" aria-colspan="my-3">
                                <input class="form-check-input" type="checkbox" role="switch" id="required" v-model="existModel[index].is_required"/>

                                <label class="form-check-label" for="required">Required</label>
                            </div>
                            <div class="mt-3 d-flex gap-2">
                                <button type="button" class="btn btn-outline-danger" @click="removeQuestion(index, question.id)">Remove</button>
                                <button type="button" class="btn btn-outline-primary" @click="updateQuestion(index, question.id)">Save</button>
                            </div> 
                        </div>
                    </div> 

                </div>  
            </div>   
            {{ existModel }}
        </div>
    </div>
</template>

<script>
import {onMounted, ref} from 'vue';
import { doFetch } from '@/utils';
import {useRouter} from 'vue-router';
import {URL_BASE} from '@/config.js';
import ManagementHeading from '@/components/ManagementHeading.vue';

export default {
    name: "Detail Form",
    props: ['slug', 'user'],
    components: {ManagementHeading},
    setup(props){
        const router = useRouter();
        const form = ref({});
        const formUrl = ref(`${URL_BASE}/forms/${props.slug}/response`);
        const choicesType = ref(['date', 'short answer', 'paragraph', 'multiple choices', 'dropdown', 'checkboxes']);

        const needChoices = ['multiple choices', 'dropdown', 'checkboxes'];

        // model
        const createModel = ref({choice_type: 'short answer'});
        const createModelChoices = ref(false);
        const createFieldErrors = ref({});

        const existModel = ref([]);
        const existModelChoices = ref([]);
        const existFieldErrors = ref([]);

        const copyUrl = async () => {
            await navigator.clipboard.writeText(formUrl.value)
        }

        const showChoicesIfNeeded = (event, model, index) => {
            const choice = event.target.value;
            if(model === 'createModel'){
                if(needChoices.includes(choice)){
                    createModelChoices.value = true;
                }else{
                    createModelChoices.value = false;
                }
            }else if(model == 'existModel'){
                if(needChoices.includes(choice)){
                    existModelChoices.value[index] = true;
                }else{
                    existModelChoices.value[index] = false;
                }
            }
        }

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
                const questions = form.value.questions;
                for(let i = 0; i < questions.length; i++){
                    existModel.value = [...existModel.value, {
                        name: questions[i].name,
                        choice_type: questions[i].choice_type,
                        is_required: questions[i].is_required ? true : false,
                        choices: questions[i].choices ? questions[i].choices : '',
                    }];

                    existFieldErrors.value.push({});
                    existModelChoices.value.push(questions[i].choices ? true : false);
                }
            }else if (res.status == 404){
                router.push({name: 'NotFound'});
            }
        }

        const createQuestion = async () => {
            console.log({ 
                    ...createModel.value, 
                    choices: createModelChoices.value ? createModel.value.choices?.trim().split(',') : []
                });
            const token = localStorage.getItem('token');
            const res = await doFetch(`/forms/${props.slug}/questions/`, {
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    ...createModel.value, 
                    choices: createModelChoices.value ? createModel.value.choices?.trim().split(',') : []
                })
            });
            const data = await res.json();
            
            if(res.status == 200){
                const question = data.question;

                const qData = {
                    name: question.name,
                    choice_type: question.choice_type,
                    is_required: question.is_required ? true : false,
                };

                if(question.choices){
                    qData.choices = question.choices;
                    existModelChoices.value.unshift(true);
                }else{
                    existModelChoices.value.unshift(false);
                }

                existModel.value = [qData, ...existModel.value];
                existFieldErrors.value.unshift({});
                createFieldErrors.value = {}
                form.value.questions.unshift(question);
                
            }else if(res.status == 422){
                createFieldErrors.value = data.errors;
            }

        }

        const updateQuestion = async (index, id) => {
            console.log({...existModel.value[index], 
                        choices: existModelChoices.value[index] ? existModel.value[index].choices?.trim().split(',') : []
                    });
            const token = localStorage.getItem('token');
            const res = await doFetch(`/forms/${props.slug}/questions/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(
                    {...existModel.value[index], 
                        choices: existModelChoices.value[index] ? existModel.value[index].choices?.trim().split(',') : []
                    })
            });
            const data = await res.json();

            if(res.status == 200){
                const newData = {
                    name: data.question.name,
                    choice_type: data.question.choice_type,
                    is_required: data.question.is_required ? true : false,
                    choices : data.question.choices
                };
                existModel.value[index] = newData; 
                existFieldErrors.value[index] = {};
            }else if (res.status == 404){
                router.push({name: 'NotFound'});
            }else if (res.status == 422){
                existFieldErrors.value[index] = data.errors;
            }
        }


        const removeQuestion = async (index, id) => {
            if(!confirm('Delete question?')) return;
            const token = localStorage.getItem('token');
            const res = await doFetch(`/forms/${props.slug}/questions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            });

            if(res.status == 200){
                existModel.value.splice(index, 1);
                form.value.questions.splice(index, 1);
                existModelChoices.value.splice(index, 1);
            }else if (res.status == 404){
                router.push({name: 'NotFound'});
            }
        }

        const clearAll = async () => {
            if(!confirm('Delete all questions?')) return;
            const token = localStorage.getItem('token');
            const res = await doFetch(`/forms/${props.slug}/questions`, {
                method: 'DELETE',
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            });

            if(res.status == 200){
                existModel.value = [];
                form.value.questions = [];
                existModelChoices.value = [];
            }else if (res.status == 404){
                router.push({name: 'NotFound'});
            }
        }

        onMounted(() => {
            getForm();
        });

        return {
            form, 
            formUrl, 
            choicesType, 
            createModel, 
            existModel, 
            updateQuestion, 
            removeQuestion, 
            createQuestion, 
            createFieldErrors,
            existFieldErrors, 
            showChoicesIfNeeded, 
            createModelChoices, 
            existModelChoices, 
            clearAll,
            copyUrl
        };
    }
}
</script>