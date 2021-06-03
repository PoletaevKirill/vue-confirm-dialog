import Vue from 'vue'

// Дириктива для блокировки cmd+z/ctrl+z
const keyZ = e => {
    if (e.code == 'KeyZ' && (e.ctrlKey || e.metaKey)) e.preventDefault()
};

export default Vue.directive('key-z', {
    inserted(el, binding) {
        if(!binding.value) return;
        document.addEventListener('keydown', keyZ)
    },
    unbind() {
        document.removeEventListener('keydown', keyZ)
    }
})
