<template>
    <section class="register">
        <div class="container">
           <div class="row justify-content-center">
              <div class="col-lg-5 col-md-6">
                 <h1 class="text-center mb-4">Formify</h1>
                 <div class="card card-default">
                    <div class="card-body">
                       <h3 class="mb-3">Register</h3>
                       
                       <form @submit.prevent="register"> 
                          <!-- s: input -->
                          <div class="form-group my-3">
                             <label for="name" class="mb-1 text-muted">Name</label>
                             <input type="name" id="name" name="name" v-model="cred.name" class="form-control" autofocus />
                             <div class="text-danger" v-if="fieldErrors.name">
                                <p v-for="err in fieldErrors.name">
                                    {{ err }}
                                </p>
                             </div>
                          </div> 

                          <!-- s: input -->
                          <div class="form-group my-3">
                             <label for="email" class="mb-1 text-muted">Email Address</label>
                             <input type="email" id="email" name="email" v-model="cred.email" class="form-control" autofocus />
                             <div class="text-danger" v-if="fieldErrors.email">
                                <p v-for="err in fieldErrors.email">
                                    {{ err }}
                                </p>
                             </div>
                          </div> 

                          <!-- s: input -->
                          <div class="form-group my-3">
                             <label for="password" class="mb-1 text-muted">Password</label>
                             <input type="password" id="password" name="password" v-model="cred.password" class="form-control" />
                             <div class="text-danger" v-if="fieldErrors.password">
                                <p v-for="err in fieldErrors.password">
                                    {{ err }}
                                </p>
                             </div>
                          </div>
                          
                          <div class="mt-4">
                             <button type="submit" class="btn btn-primary">Register</button>
                          </div>
                          <router-link :to="{name: 'Login'}" class="mt-2 d-block" style="font-size: .95rem;">Already have account? Login here!</router-link>

                       </form>

                    </div>
                 </div> 
              </div>
           </div>
        </div>
     </section>
</template>

<script>
import {ref} from 'vue';
import {doFetch} from '@/utils.js';
import {useRouter} from 'vue-router';

export default {
    name: "Register Page",
    setup(props, context){
        const router = useRouter();
        const cred = ref({});
        const fieldErrors = ref({});

        async function register(){
            const res = await doFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify(cred.value)
            }).catch(err => console.log(err));

            const data = await res.json();

            if(res.status == 422){
                fieldErrors.value = data.errors;
            }else if(res.status == 200){
                router.push({name: 'Login'});
            }
        }

        return {cred, fieldErrors, register}
    }
}
</script>