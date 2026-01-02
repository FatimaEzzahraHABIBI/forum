import { createRouter, createWebHistory } from 'vue-router'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

import Welcome from '../views/Welcome.vue'
import Discussions from '../views/Discussions.vue'
import DiscussionDetails from '../views/DiscussionDetails.vue'
import CreateDiscussion from '../views/CreateDiscussion.vue'
import Profile from '../views/Profile.vue'
import Moderation from '../views/Moderation.vue'
import LoginForm from '../components/LoginForm.vue'
import SignupForm from '../components/SignupForm.vue'
import ForgotPassword from '../components/ForgotPassword.vue'

const routes = [
  { path: '/', component: Welcome },
  { path: '/discussions', component: Discussions },
  { path: '/discussions/:id', component: DiscussionDetails },
  { path: '/create', component: CreateDiscussion, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/moderation', component: Moderation, meta: { requiresAuth: true, requiresModerator: true } },
  { path: '/login', component: LoginForm },
  { path: '/signup', component: SignupForm },
  { path: '/forgot-password', component: ForgotPassword }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard pour auth et rôle modérateur
router.beforeEach(async (to, from, next) => {
  const user = auth.currentUser

  // Si la route n'a pas besoin d'auth ni de rôle => continue
  if (!to.meta.requiresAuth && !to.meta.requiresModerator) return next()

  // Vérifier si authentifié
  if (to.meta.requiresAuth && !user) return next('/login')

  // Vérifier le rôle modérateur si nécessaire
  if (to.meta.requiresModerator && user) {
    const snap = await getDoc(doc(db, 'users', user.uid))
    const role = snap.data()?.role
    if (role !== 'moderator') return next('/')
  }

  // Sinon, autoriser l’accès
  next()
})

export default router
