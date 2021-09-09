<template>
  <div
    style="width: 240px; height: 50px;"
    class="abcRioButton abcRioButtonBlue"
    @click="handleClick"
  >
    <div class="abcRioButtonContentWrapper">
      <div class="abcRioButtonIcon" style="padding: 15px;">
        <div
          style="width: 18px; height: 18px;"
          class="abcRioButtonSvgImageWithFallback abcRioButtonIconImage abcRioButtonIconImage18"
        >
          <img alt="Google Logo" :src="require('@/assets/google.svg')" />
        </div>
      </div>
      <span
        style="font-size: 16px; line-height: 48px;"
        class="abcRioButtonContents"
      >
        <span>Sign in with Google</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClick() {
      window.location.href = "/auth/google";
    }
  }
};
</script>

<style>
.abcRioButton {
  position: relative;
  box-sizing: border-box;
  width: auto;
  margin: auto;
  overflow: hidden;
  color: #262626;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  background-color: #fff;
  background-image: none;
  border-radius: 1px;
  outline: none;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  -webkit-appearance: none;
}

.abcRioButton:hover {
  box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
}

.abcRioButtonBlue {
  color: #fff;
  background-color: #4285f4;
  border: none;
}

.abcRioButtonBlue:hover {
  background-color: #4285f4;
}

.abcRioButtonBlue:active {
  background-color: #3367d6;
}

.abcRioButtonLightBlue {
  color: #757575;
  background-color: #fff;
}

.abcRioButtonLightBlue:active {
  color: #6d6d6d;
  background-color: #eee;
}

.abcRioButtonIcon {
  float: left;
}

.abcRioButtonBlue .abcRioButtonIcon {
  background-color: #fff;
  border-radius: 1px;
}

.abcRioButtonSvg {
  display: block;
}

.abcRioButtonContents {
  margin-right: 6px;
  margin-left: 6px;
  font-family: Roboto, arial, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.21px;
  vertical-align: top;
}

.abcRioButtonContentWrapper {
  width: 100%;
  height: 100%;
}

.abcRioButtonBlue .abcRioButtonContentWrapper {
  border: 1px solid transparent;
}

.abcRioButtonErrorWrapper,
.abcRioButtonWorkingWrapper {
  display: none;
  width: 100%;
  height: 100%;
}

.abcRioButtonErrorIcon,
.abcRioButtonWorkingIcon {
  margin-right: auto;
  margin-left: auto;
}

.abcRioButtonErrorState,
.abcRioButtonWorkingState {
  color: #262626;
  border: 1px solid #d5d5d5;
  border: 1px solid rgba(0, 0, 0, 0.17);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
}

.abcRioButtonErrorState,
.abcRioButtonErrorState:hover {
  background-color: #fff;
}

.abcRioButtonWorkingState,
.abcRioButtonWorkingState:hover {
  background-color: #f5f5f5;
}

.abcRioButtonErrorState:hover,
.abcRioButtonWorkingState:hover {
  border: 1px solid #aaa;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.abcRioButtonErrorState:active,
.abcRioButtonWorkingState:active {
  color: #262626;
  border: 1px solid #aaa;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: inset 0 1px 0 #ddd;
}

.abcRioButtonWorkingState:active {
  background-color: #e5e5e5;
}

.abcRioButtonErrorState:active {
  background-color: #e5e5e5;
}

.abcRioButtonWorkingState .abcRioButtonWorkingWrapper,
.abcRioButtonErrorState .abcRioButtonErrorWrapper {
  display: block;
}

.abcRioButtonErrorState .abcRioButtonContentWrapper,
.abcRioButtonWorkingState .abcRioButtonContentWrapper,
.abcRioButtonErrorState .abcRioButtonWorkingWrapper {
  display: none;
}
</style>
