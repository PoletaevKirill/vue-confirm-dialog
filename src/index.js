import ConfirmDialog from './Confirm.vue'
import { events }    from './events'

const Confirm = {
  install(Vue) {
    if (this.installed) {
      return
    }

    this.installed = true

    Vue.component('confirm-dialog', ConfirmDialog)

    const confirm = function(params){
      if (typeof params === 'object') {
        events.$emit('add', params)
      }
    }

    Vue.prototype['$confirm'] = confirm
  }
}

export default Confirm
