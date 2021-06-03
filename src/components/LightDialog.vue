<template>
  <transition name="dialog">
    <div v-show="true"
         v-key-press:27="keyPress"
         v-key-z="confirm"
         :class="classPositionContainer"
         :style="{zIndex: zIndex, ...hideOverlayStyles(), background: backgroundOverlay, ...positionAbsolute }"
         class="dialog-mask"
         tabindex="-1"
         @mousedown.self.stop="close">
      <div :class="animation" :style="styleDialogWContainer" class="dialog-wrapper-container" @click.stop
           @mousedown.stop>
        <div :style="{...styleDialogWContainer, background: this.noBg ? 'transparent': undefined,}"
             class="dialog-container pt-sait">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import KeyPress from '~/directives/key-press'
import KeyZ from '~/directives/key-z.js'

// Открытые модальные окна
const state = {
  dialogIds: [],
  createId: (i => () => i++)(1),
}

export default {
  name: 'light-dialog',
  directives: {KeyPress, KeyZ},
  model: {
    event: 'close'
  },
  props: {
    absolute: Boolean,
    value: Boolean,
    persistent: Boolean,
    noBg: Boolean,
    confirm: Boolean,
    backgroundOverlay: String,
    bodyOverflow: {
      type: Boolean,
      default: true
    },
    width: {
      type: [String, Number],
      default: 'auto'
    },
    maxWidth: {
      type: [String, Number],
      default: 'none'
    },
    fullHeight: {
      type: [String, Number],
      default: 'none'
    },
    position: {
      type: String,
      default: 'none'
    },
    mount: {
      type: String,
      default: 'none'
    },
    hideOverlay: {
      type: Boolean,
    }
  },
  computed: {
    parentEl() {
      return this.$el.parentNode || document.querySelector('body')
    },
    target() {
      return this.mount === 'none' ? this.parentEl : document.querySelector(this.mount)
    },
    positionAbsolute() {
      return this.absolute ? {position: 'absolute'} : null
    },
    //'right': this.position === 'right',
    // 'left': this.position === 'left',
    // 'bottom': this.position === 'bottom',
    // 'top': this.position === 'top',

    classPositionContainer() {
      return this.position ? this.position : ''
    },
    styleDialogWContainer() {

      const unitCheck = (value) => {
        const isUnit = /(vw|vh|vmin|vmax|%|em|rem|px)/.test(value)
        return isUnit ? value : `${value}px`
      }

      return {
        maxWidth: this.maxWidth === 'none' ? undefined : unitCheck(this.maxWidth),
        width: this.width === 'auto' ? undefined : unitCheck(this.width),
        minHeight: this.fullHeight === 'none' ? undefined : '100%',
        height: this.fullHeight === 'none' ? undefined : '100%',
      }
    },
    animation() {
      return {
        'dialog-animate': this.animate
      }
    },
  },
  data() {
    return {
      id: state.createId(),
      zIndex: 300,
      animate: false,
      animateTimeout: null,
    }
  },
  watch: {
    value(isShow) {
      if (isShow) {
        this.show()
      }

      if (!isShow) {
        this.hide()
      }
    }
  },

  methods: {
    hideOverlayStyles() {
      if (this.hideOverlay) {
        return {
          background: 'none',
          pointerEvents: 'none'
        }
      }
    },
    animateClick() {
      this.animate = true
      this.$nextTick(() => {
        clearTimeout(this.animateTimeout)
        this.animateTimeout = setTimeout(() => {
          this.animate = false
        }, 150)
      })
    },
    close(e) {
      // Закрыть диалог может либо правая кнопка мыши либо esc
      if (e.which != 1 && e.which != 27) return;
      // События вне диалога не закрывают его
      if (this.persistent) {
        return this.animateClick()
      }

      this.$emit('close')
    },
    keyPress(e) {
      if (this.value && this.$el.contains(document.activeElement)) {
        this.close(e)
      }
    },
    show() {
      state.dialogIds.push(this.id)
      this.zIndex += state.dialogIds.findIndex(item => item === this.id) || 0
      if (this.bodyOverflow && !this.hideOverlay) document.documentElement.classList.add('no-scroll');
      // Ставим фокус на элемент
      // Теперь по esc можно будет закрыть послденюю активную модалку
      this.$nextTick(() => {
        this.$el.focus()
      })
    },
    hide() {
      const _index = state.dialogIds.findIndex(item => item === this.id)
      this.zIndex -= _index || 0
      _index !== undefined && state.dialogIds.splice(state.dialogIds.indexOf(this.id), 1)
      // последнее закрытое окно удаляет 'no-scroll'
      if (state.dialogIds.length === 0) document.documentElement.classList.remove('no-scroll');

    }
  },
  mounted() {
    this.target.insertBefore(this.$el, this.target.firstChild)
    this.value && this.show()
  },
  beforeDestroy() {
    this.value && this.hide()
    this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
  },
}
</script>

<style lang="less" scoped>
html {
  &.no-scroll {
    overflow-y: hidden !important;
  }
}

@keyframes pulse {
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.03, 1.03, 1.03);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}

.dialog-animate {
  animation-name: pulse;
  animation-duration: .15s;
  user-select: none;
  backface-visibility: hidden;
}

.dialog-enter {
  opacity: 0;
}

.dialog-leave-active {
  opacity: 0;
}

.dialog-mask {
  position: fixed;
  display: flex;
  z-index: 300;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(52, 52, 71, 0.4);
  transition: opacity 0.3s ease;
  filter: blur(0);
  justify-content: center;
  align-items: center;
  align-self: center;

  &.right {
    justify-content: flex-end;
  }

  &.left {
    justify-content: flex-start;
  }

  &.bottom {
    align-items: flex-end;
  }

  &.top {
    align-items: flex-start;
  }


  &.right,
  &.left {
    .dialog-wrapper-container {
      border-radius: 0;
    }
  }
}

.dialog-wrapper-container {
  height: auto;
  max-height: 100%;
  position: absolute;
  width: 100%;
  overflow: auto;
  filter: blur(0);
  border-radius: 4px;
  pointer-events: auto;
}

.dialog-container {
  height: 100%;
  max-height: 100%;
  position: relative;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
}

@media (max-width: 992px) {
  .dialog-container {
    overflow: auto;
  }
}
</style>
