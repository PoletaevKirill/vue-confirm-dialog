<template>
  <div>
    <div v-for="item in items" :key="item.id">
      <slot
          :class="[classes, item.type]"
          :close="() => destroy(item)"
          :item="item"
          :reject="() => reject(item)"
          :resolve="() => resolve(item)"
      >
        <light-dialog
            :persistent="item.persistent"
            :value="item.state"
            confirm
            max-width="480"
            @close="destroy(item)"
        >
          <div class="card">
            <div class="title mb-4">
              {{ item.title }}
            </div>
            <div class="content mb-6">
              {{ item.text }}
            </div>
            <div class="actions">
              <button class="button button--reject" @click="reject(item)">Отменить</button>
              <button class="button button--resolve ml-4" @click="resolve(item)">Подтвердить</button>
            </div>
          </div>
        </light-dialog>
      </slot>
    </div>
  </div>
</template>

<script>
import {events} from '~/events.js'
import Dialog from "~/components/LightDialog.vue";


// helpers
const Id = (i => () => i++)(1)
// end helpers

export default {
  name: 'confirm',
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
  components: {
    'light-dialog': Dialog
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
        title: 'Подтвердите действие',
        text: 'По своей сути рыбатекст является альтернативой традиционному lorem ipsum?',
        // buttons [{text, cb, classes,}]
        buttons: [],
        resolve: () => {
        },
        reject: () => {
        },
        data: {},
      }

      const _item = {...defaultOpt, ...params}

      if (this.group !== _item.group) {
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

<style scoped>
.mb-4 {
  margin-bottom: 16px;
}
.mb-6{
  margin-bottom: 24px;
}

.ml-4 {
  margin-left: 16px;
}

.card {
  padding: 16px;
}

.title,
.content {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.428;
  letter-spacing: normal;
}

.title {
  font-size: 24px;
  font-weight: 600;
}

.content {
  font-size: 16px;
  font-weight: normal;
}

.actions {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.button {
  outline: 0;
  text-decoration: none;
  display: inline-flex;
  border-radius: 4px;
  cursor: pointer;
  padding: 9px 16px;
  border: 0;
}

.button:hover {
  filter: opacity(0.8);
}

.button--resolve {
  color: #fff;
  background: #2196f3;
}

.button--reject {
  color: #fff;
  background: #dd4a68;
}
</style>