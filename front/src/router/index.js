import { createRouter, createWebHistory } from 'vue-router';
import Homeview from '../views/Home.vue';
import UserStatusView from '../components/UserStatus.vue';
import OrderStatusView from '../components/OrderStatus.vue';
import ModelPageView from '../components/ModelPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Homeview
  },
  {
    path: '/userstatus',
    name: 'UserStatus',
    component: UserStatusView,
  },
  {
    path: '/orderstatus',
    name: 'OrderStatus',
    component: OrderStatusView,
  },
  {
    path: '/modelPage',
    name: 'ModelPage',
    component: ModelPageView,
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes
});

export default router;
