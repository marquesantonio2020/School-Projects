/**All VueJS Routes responsible for the change of components on the screen */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../components/Login.vue')
  },
  {
    path: '/login/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../views/Checkout.vue')
  },
  {
    path: '/cinema_and_arts',
    name: 'CinemaAndArts',
    component: () => import('../views/CinemaAndArts.vue')
  },
  {
    path: '/musics_and_festivals',
    name: 'MusicAndFestivals',
    component: () => import('../views/MusicAndFestivals.vue')
  },
  {
    path: '/sports',
    name: 'Sports',
    component: () => import('../views/Sports.vue')
  },
  {
    path: '/show/:showId/show_info',
    name: 'ShowDetails',
    component: () => import('../views/ShowDetails.vue'),
    props: true
  },
  {
    path:'/admin',
    name: 'AdminHome',
    component: () => import('../views/AdminPages/AdminHome.vue')
  },
  {
    path: '/new_show',
    name: 'NewShow',
    component: () => import('../views/AdminPages/NewShow.vue')
  },
  {
    path: '/table_information',
    name: 'ShowInformation',
    component: () => import('../views/AdminPages/ShowInformation.vue')
  },
  {
    path: '/admin/user_chart_data',
    name: 'UserDataChart',
    component: () => import('../views/AdminPages/UserDataCharts.vue')
  },
  {
    path: '/admin/sales_chart_data',
    name: 'SalesDataChart',
    component: () => import('../views/AdminPages/SalesDataCharts.vue')
  },
  {
    path: '/admin/general_chart_data',
    name: 'GeneralDataChart',
    component: () => import('../views/AdminPages/GeneralDataCharts.vue')
  },
  {
    path: '/purchases_table',
    name: 'TableOfInformationPurchases',
    component: () => import('../components/TableOfInformationPurchases.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
