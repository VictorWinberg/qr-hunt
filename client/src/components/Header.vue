<template>
  <header>
    <div class="header-title">
      QR-Hunt
    </div>
    <div class="my-account-icon-wrapper">
      <img
        alt="My Account"
        class="my-account-icon"
        src="./../assets/user.svg"
      />
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss">
header {
  position: relative;
  padding: 0.5em;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 2px 6px 0 rgba(#000, 0.2);
  background: linear-gradient(#eee, $white);
  z-index: 1;

  .header-title {
    text-align: left;
    font-size: 24px;
  }

  .my-account-icon-wrapper {
    display: flex;
    align-items: center;

    .my-account-icon {
      width: auto;
      height: 24px;
    }
  }
}
</style>
