import Vue from 'vue'

/**
 *
 * @param e
 * @param el
 * @param binding
 * @param vnode
 */
function keyPress(e, el, binding, vnode){
    if(typeof binding.value !== 'function') throw new Error('v-key-press value is not a function')

    if(!binding.arg){
        binding.value && binding.value(e)
        return
    }

    if(Number(binding.arg) === e.keyCode){
        binding.value && binding.value(e)
    }
}

export default Vue.directive('key-press', {
    inserted(el, binding, vnode) {
        const keyup = e => keyPress(e, el, binding, vnode)
        document.addEventListener('keyup', keyup)
        el._keyPress = keyup
    },

    unbind(el) {
        if(!el._keyPress) return
        document.removeEventListener('keyup',   el._keyPress)
        el._keyPress = null
    }
})