import Vue from "vue";
import Router from "vue-router";
``
import HomePage from "../home/HomePage";
import LoginPage from "../login/LoginPage";
import LogoutPage from "../login/LogoutPage";
import RegisterPage from "../register/RegisterPage";
import ProfilePage from "../profile/ProfilePage";
import VerifyPage from "../register/VerifyPage";

Vue.use(Router);

export const router = new Router({
  mode: "history",
  routes: [
    { path: "/", component: HomePage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage },
    { path: "/register", component: RegisterPage },
    { path: "/profile", component: ProfilePage },
    { path: "/verify-email/:token", component: VerifyPage },
    // otherwise redirect to home
    { path: "*", redirect: "/" }
  ]
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ["/login", "/register", "/verify-email"];

  const authRequired = !publicPages.find(a => to.path.includes(a));

  const loggedIn = localStorage.getItem("user");

  if (authRequired && !loggedIn) {
    return next("/login");
  }

  next();
});
