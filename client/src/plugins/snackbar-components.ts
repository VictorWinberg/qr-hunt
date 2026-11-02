import Vue, { VueConstructor } from "vue";

export const ToastHtmlContent = Vue.extend({
  props: {
    content: {
      type: String,
      required: true
    }
  },
  template: `<div class="toast-html-content" v-html="content"></div>`
});

export const createActionCloseButton = (
  actionHtml: string,
  onAction?: () => void | Promise<void>
): VueConstructor =>
  Vue.extend({
    props: {
      closeToast: {
        type: Function,
        required: true
      }
    },
    data() {
      return { label: actionHtml };
    },
    methods: {
      async onClick(): Promise<void> {
        await onAction?.();
        this.closeToast();
      }
    },
    template:
      '<button type="button" class="Vue-Toastification__close-button toast-action" @click="onClick"><span v-html="label"></span></button>'
  });
