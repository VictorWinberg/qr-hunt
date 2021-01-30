<template>
  <div
    style="height:50px;width:240px;"
    class="abcRioButton abcRioButtonBlue"
    @click="handleClick"
  >
    <div class="abcRioButtonContentWrapper">
      <div class="abcRioButtonIcon" style="padding:15px">
        <div
          style="width:18px;height:18px;"
          class="abcRioButtonSvgImageWithFallback abcRioButtonIconImage abcRioButtonIconImage18"
        >
          <img alt="Google Logo" :src="require('@/assets/google.svg')" />
        </div>
      </div>
      <span
        style="font-size:16px;line-height:48px;"
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
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  -webkit-user-select: none;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  color: #262626;
  cursor: pointer;
  outline: none;
  overflow: hidden;
  position: relative;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  width: auto;
  margin: auto;
}
.abcRioButton:hover {
  box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
}
.abcRioButtonBlue {
  background-color: #4285f4;
  border: none;
  color: #fff;
}
.abcRioButtonBlue:hover {
  background-color: #4285f4;
}
.abcRioButtonBlue:active {
  background-color: #3367d6;
}
.abcRioButtonLightBlue {
  background-color: #fff;
  color: #757575;
}
.abcRioButtonLightBlue:active {
  background-color: #eee;
  color: #6d6d6d;
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
  font-family: Roboto, arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.21px;
  margin-left: 6px;
  margin-right: 6px;
  vertical-align: top;
}
.abcRioButtonContentWrapper {
  height: 100%;
  width: 100%;
}
.abcRioButtonBlue .abcRioButtonContentWrapper {
  border: 1px solid transparent;
}
.abcRioButtonErrorWrapper,
.abcRioButtonWorkingWrapper {
  display: none;
  height: 100%;
  width: 100%;
}
.abcRioButtonErrorIcon,
.abcRioButtonWorkingIcon {
  margin-left: auto;
  margin-right: auto;
}
.abcRioButtonErrorState,
.abcRioButtonWorkingState {
  border: 1px solid #d5d5d5;
  border: 1px solid rgba(0, 0, 0, 0.17);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
  color: #262626;
}
.abcRioButtonErrorState:hover,
.abcRioButtonWorkingState:hover {
  border: 1px solid #aaa;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}
.abcRioButtonErrorState:active,
.abcRioButtonWorkingState:active {
  border: 1px solid #aaa;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-shadow: inset 0 1px 0 #ddd;
  color: #262626;
}
.abcRioButtonWorkingState,
.abcRioButtonWorkingState:hover {
  background-color: #f5f5f5;
}
.abcRioButtonWorkingState:active {
  background-color: #e5e5e5;
}
.abcRioButtonErrorState,
.abcRioButtonErrorState:hover {
  background-color: #fff;
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
