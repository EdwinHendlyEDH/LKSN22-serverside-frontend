<template>
    <section class="login">
        <div class="container">
           <div class="row justify-content-center">
              <div class="col-lg-5 col-md-6">
                 <h1 class="text-center mb-4">Formify</h1>
                 <div class="card card-default">
                    <div class="card-body">
                       <h3 class="mb-3">Login</h3>
                       
                        <div class="alert alert-danger" v-if="loginError">
                            {{ loginError }}
                        </div>

                       <form @submit.prevent="login"> 
                          <!-- s: input -->
                          <div class="form-group my-3">
                             <label for="email" class="mb-1 text-muted">Email Address</label>
                             <input type="email" id="email" name="email" class="form-control" v-model="cred.email"/>
                             <div class="text-danger" v-if="fieldErrors.email">
                                <p v-for="err in fieldErrors.email">
                                    {{ err }}
                                </p>
                             </div>
                          </div> 

                          <!-- s: input -->
                          <div class="form-group my-3">
                             <label for="password" class="mb-1 text-muted">Password</label>
                             <input type="password" id="password" name="password" class="form-control" v-model="cred.password" />
                             <div class="text-danger" v-if="fieldErrors.password">
                                <p v-for="err in fieldErrors.password">
                                    {{ err }}
                                </p>
                             </div>
                          </div>
                          
                          <div class="mt-4">
                             <button type="submit" class="btn btn-primary">Login</button>
                          </div>
                          <router-link :to="{name: 'Register'}" class="mt-2 d-block" style="font-size: .95rem;">No account? Register here!</router-link>
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
    name: "Login Page",
    emits: ['login'],
    setup(props, context){
        const router = useRouter();
        const cred = ref({});
        const fieldErrors = ref({});
        const loginError = ref(null);

        async function login(){
            const res = await doFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify(cred.value)
            }).catch(err => console.log(err));

            const data = await res.json();

            if(res.status == 422){
                fieldErrors.value = data.errors;
            }else if(res.status == 401){
                loginError.value = data.message;
            }else if(res.status == 200){
                localStorage.setItem('token', data.user.token);
                context.emit('login', data.user);
                router.push({name: 'ManageForms'});
            }
        }

        return {cred, fieldErrors, loginError, login}
    }
}
</script>
