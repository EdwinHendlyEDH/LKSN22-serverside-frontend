<template>
    <div class="hero py-5 bg-light">
        <div class="container">
            <h2>Create Form</h2>
        </div>
    </div>

    <div class="py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-lg-4">
                
                <form @submit.prevent="create">
                    <!-- s: input -->
                    <div class="form-group mb-3">
                        <label for="name" class="mb-1 text-muted">Form Name</label>
                        <input type="text" id="name" name="name" class="form-control" autofocus v-model="cred.name"/>
                        <div class="text-danger" v-if="fieldErrors.name">
                            <p v-for="err in fieldErrors.name">
                                {{ err }}
                            </p>
                        </div>
                    </div>

                    <!-- s: input -->
                    <div class="form-group my-3">
                        <label for="slug" class="mb-1 text-muted">Form Slug</label>
                        <input type="text" id="slug" name="slug" class="form-control" v-model="cred.slug"/>
                        <div class="text-danger" v-if="fieldErrors.slug">
                            <p v-for="err in fieldErrors.slug">
                                {{ err }}
                            </p>
                        </div>
                    </div>

                    <!-- s: input -->
                    <div class="form-group my-3">
                        <label for="description" class="mb-1 text-muted">Description</label>
                        <textarea id="description" name="description" rows="4" class="form-control" v-model="cred.description"></textarea>
                        <div class="text-danger" v-if="fieldErrors.description">
                            <p v-for="err in fieldErrors.description">
                                {{ err }}
                            </p>
                        </div>
                    </div>
                    
                    <!-- s: input -->
                    <div class="form-group my-3">
                        <label for="allowed-domains" class="mb-1 text-muted">Allowed Domains</label>
                        <input type="text" id="allowed-domains" name="allowed_domains" class="form-control" v-model="cred.allowed_domains"/>
                        <div class="form-text">Separate domains using comma ",". Ignore for public access.</div>
                        <div class="text-danger" v-if="fieldErrors.allowed_domains">
                            <p v-for="err in fieldErrors.allowed_domains">
                                {{ err }}
                            </p>
                        </div>
                    </div>
                    
                    <!-- s: input -->
                    <div class="form-check form-switch" aria-colspan="my-3">
                        <input type="checkbox" id="limit_one_response" name="limit_one_response" class="form-check-input" role="switch" v-model="cred.limit_one_response"/>
                        <label class="form-check-label" for="limit_one_response">Limit to 1 response</label>
                    </div>

                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { doFetch } from '@/utils';
import {ref} from 'vue';
import {useRouter} from 'vue-router';

export default {
    name: "Create Form",
    setup(){
        const router = useRouter();
        const cred = ref({});
        const fieldErrors = ref({});

        const create = async () =>{
            const token = localStorage.getItem('token');
            const res = await doFetch('/forms', {
                method: 'POST', 
                headers: {
                    'Authorization' : `Bearer ${token}`
                },
                body : JSON.stringify({ ...cred.value, allowed_domains: cred.value.allowed_domains ? cred.value.allowed_domains?.trim().split(',') : [] })
            });

            const data = await res.json();

            if(res.status == 200){
                router.push({name: 'ManageForms'});
            }else if (res.status == 422){
                fieldErrors.value = data.errors;
            }
        }

        return {create, cred, fieldErrors};
    }
}

</script>