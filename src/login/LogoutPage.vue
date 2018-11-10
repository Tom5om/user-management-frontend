<template>
    <div></div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions({
      logout: "account/logout"
    })
  },
  created() {
    // reset login status
    this.logout();
    this.$router.push("/login");
  }
};
</script>
