<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>LOGIN AZURE ACTIVE DIRECTORY EXAMPLE</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!logged && !loading" color="primary" @click="login()">
        Login
      </v-btn>
      <v-btn v-if="logged && !loading" color="primary" @click="logout()">
        Logout
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-layout v-if="logged">
          {{user}}
        <v-flex>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import login from './api/login';
export default {
  name: 'App',
  data () {
    return {
      user: false,
      logged: false,
      loading: false,
      baseUrl: process.env.VUE_APP_BACKEND
    }
  },

  mounted: function(){
    console.log(process.env.VUE_APP_BACKEND)
    console.log(process.env.VUE_APP_LOCAL)
    this.isLoggedIn();
  },
  methods: {
      isLoggedIn() {
      this.loading = true;
      login.isLogin(process.env.VUE_APP_BACKEND +'/islogin',
        response => {
          this.logged = response;
          if (this.logged) {
            this.getUser();
          } else {
            this.clearUser();
            this.loading = false;
          }
        },
        error => {
          console.error(error);
          this.logged = false;
          this.loading = false;
        }
      );
    },
      login() {
      window.location = this.baseUrl + '/login/';
    },
    logout() {
      window.location = this.baseUrl + '/logout/';
      this.clearUser();
    },
    clearUser() {
      localStorage.removeItem('user');
      this.user = false;
    },
    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    getUser() {
      login.getUser(process.env.VUE_APP_BACKEND+'/account',
        user => {
          console.log(user)
          this.setUser(user);
          this.loading = false;
        },
        error => {
          console.error(error);
          this.loading = false;
        }
      );
    },
  }
}
</script>
