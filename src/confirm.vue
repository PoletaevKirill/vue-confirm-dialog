<template>
  <div>
    <div :key="item.id" v-for="item in items">
      <slot
          :class="[classes, item.type]"
          :close="() => destroy(item)"
          :resolve="() => resolve(item)"
          :reject="() => reject(item)"
          :item="item"
      >
        <c-dialog
            :value="item.state"
            max-width="480"
            :persistent="item.persistent"
            @close="destroy(item)"
            confirm
        >
          <v-card>
            <v-card-title class="headline">{{item.title}}</v-card-title>
            <v-card-text v-html="item.text"></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="reject(item)" color="primary" text>
                {{$t('core.main.cancel')}}
              </v-btn>
              <v-btn color="primary" @click="resolve(item)" text>
                {{$t('core.main.reconfirm')}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </c-dialog>
      </slot>
    </div>
  </div>
</template>

<script>
import {events} from './events.js'

// helpers
const Id = (i => () => i++)(1)
// end helpers

export default {
  props: {
    group: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      items: []
    }
  },
  methods: {
    destroy(item) {
      item.state = false
      const _index = this.items.findIndex(o => o.id == item.id)
      this.items.splice(_index, 1)
    },
    reject(item) {
      this.destroy(item)
      item.reject && item.reject()
    },
    resolve(item) {
      this.destroy(item)
      item.resolve && item.resolve()
    },
    addItem(params) {
      const defaultOpt = {
        id: Id(),
        group: null,
        state: true,
        persistent: false,
        title: this.$t('core.main.confirmAction'),
        text: '',
        // buttons [{text, cb, classes,}]
        buttons:[],
        resolve: () => {
        },
        reject: () => {
        },
        data: {},
      }

      const _item = {...defaultOpt, ...params}

      if(this.group !== _item.group) {
        return
      }

      this.items.push(_item)
    }
  },
  mounted() {
    events.$on('add', this.addItem)
  }
}
</script>
