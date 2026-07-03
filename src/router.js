import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Quiz from './views/Quiz.vue'
import Loading from './views/Loading.vue'
import Result from './views/Result.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/quiz', name: 'Quiz', component: Quiz },
  { path: '/loading', name: 'Loading', component: Loading },
  { path: '/result', name: 'Result', component: Result }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
