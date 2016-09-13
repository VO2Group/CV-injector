<template>
  <div>
    <label>Profil linkedIn :</label>
    <input type=text v-model=url v-bind:disabled=!connected>
    <button v-if=injectable>Injection</button>
  </div>
</template>
<script>
  module.exports = {
    data: function () {
      return {
        url: ''
      }
    },
    computed: {
      connected: function () {
        return this.linkedin && this.salesforce
      },
      injectable: function () {
        return this.connected && this.url
      }
    },
    vuex: {
      getters: {
        linkedin: function (state) {
          return state.linkedin
        },
        salesforce: function (state) {
          return state.salesforce
        },
      }
    }
  }
</script>
