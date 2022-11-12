import { createRouter, createWebHistory } from 'vue-router'

import {
  Home, Login, Register, FinishResponse, DetailResponse, Responses, NotFound, Forbidden, CreateForm, DetailForm, ManageForms, SubmitForm
} from '@/views/index.js';
import { checkLogin, doFetch } from '@/utils';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: NotFound 
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: Forbidden 
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/manage-forms',
    name:  'ManageForms',
    component: () => import('@/views/Form/ManageForms.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/forms/:slug/questions',
    name: 'DetailForm',
    component: DetailForm,
    props: true,
    meta: {
      requiresAuth: true,
      checkCreator: true,
    }
  },
  // {
  //   path: '/forms/:slug',
  //   redirect: '/forms/:slug/questions', 
  // },
  {
    path: '/create-form',
    name:  'CreateForm',
    component: CreateForm,
    props: true,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/forms/:slug/responses',
    name:  'Responses',
    component: Responses,
    props: true,
    meta: {
      requiresAuth: true,
      checkCreator: true
    }
  },
  {
    path: '/forms/:slug/responses/:id',
    name: 'DetailResponse',
    component: DetailResponse,
    props: true,
    meta: {
      requiresAuth: true,
      checkCreator: true
    }
  },
  {
    path: '/forms/:slug/response',
    name:  'SubmitForm',
    component: SubmitForm,
    props: true,
    meta: {
      requiresAuth: true,
      checkAllowed: true
    }
  },
  {
    path: '/forms/:slug/response/finish',
    name: 'FinishResponse',
    component: FinishResponse,
    meta: {
      requiresAuth: true,
      checkAllowed: true
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound404',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});


router.beforeEach(async (to, from, next) => {
  if(to.meta.requiresAuth){
    const token = localStorage.getItem('token');

    const user = await checkLogin(token);

    if(user){
      if(to.meta.checkCreator){
        // ingat jangan ganti path dari routenya.
        const token = localStorage.getItem('token');
        const res = await doFetch(`${to.fullPath}`, {
          headers: {
            'Authorization' : `Bearer ${token}`
          }
        });
        if(res.status == 403){
          next({name: 'Forbidden'})
        } else if (res.status == 404){
          next({name: 'NotFound'})
        }else{
          next();
        }
      }else if(to.meta.checkAllowed){
        const token = localStorage.getItem('token');
        const res = await doFetch(`/forms/${to.params.slug}/checkAllowed`, {
          headers: {
            'Authorization' : `Bearer ${token}`
          }
        });
        if(res.status == 403){
          next({name: 'Forbidden'})
        }else{
          next();
        }
      }
        
    }else{
      next({name: 'Login'});
    }

  }


  next()
});


export default router
