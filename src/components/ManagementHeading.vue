<template>
    <div class="hero py-5 bg-light">
        <div class="container text-center">  
            <h2 class="mb-2">
                {{ form?.name }}
            </h2>  
            <div class="text-muted mb-4">
                {{ form?.description }}
            </div> 
            <div>
                <div>
                <small>For user domains</small>
                </div>
                <small>
                    <span class="text-primary" v-for="(domain, i) in form?.allowed_domains" v-if="form?.allowed_domains?.length">{{ i != form.allowed_domains.length - 1 ? `${domain}, ` : domain }}</span>
                    <span class="text-success" v-else>Public</span>
                </small>
            </div> 
        </div>
    </div>
</template>
<script>
export default {
    name: "Management Heading",
    props: ['form'],
    setup(props){
        
    }
}
</script>