<template>
  <div v-if=!salesforce>
    <h2>SalesForce</h2>
    <button v-on:click=onSalesforce>Connexion</button>
  </div>
</template>
<script>
  module.exports = {
    vuex: {
      getters: {
        salesforce: function (state) {
          return state.salesforce
        }
      },
      actions: {
        onSalesforce: function (store) {
          store.dispatch('onSalesforce', true)
        }
      }
    }
  }
</script>
