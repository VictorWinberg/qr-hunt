<template>
  <header>
    <router-link to="/" class="header-title">
      QR-Hunt
    </router-link>
    <router-link to="/user" class="my-account-icon-wrapper">
      <img
        alt="My Account"
        class="my-account-icon"
        src="./../assets/user.svg"
      />
    </router-link>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss">
header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
  background: linear-gradient(#eee, $white);
  box-shadow: 0 2px 6px 0 rgba(#000, 0.2);
}

.header-title {
  font-size: 24px;
  color: inherit;
  text-align: left;
  text-decoration: none;
}

.my-account-icon-wrapper {
  display: flex;
  align-items: center;

  .my-account-icon {
    width: auto;
    height: 24px;
  }
}
</style>
