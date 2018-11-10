<template>
    <div>
        <h2>Verify email</h2>
        <p v-if="verification.verified">
            Your email address is verified, <br />
            Click here to login: <router-link to="/login">Login</router-link>
        </p>
        <p v-else-if="verification.notfound">
            This link has expired or has already been used
        </p>
        <p v-else-if="verification.error">
            <pre>{{ verification.error }}</pre>
        </p>


    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("account", ["verification"])
  },
  methods: {
    ...mapActions("account", ["verify"])
  },
  created() {
    this.verify({ token: this.$route.params.token });
  }
};
</script>
