import {observable} from 'mobx'
import { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } from '../constants'

export default class ViewStore {
  static instance = null
  static create = () => {
    if (!ViewStore.instance) {
      ViewStore.instance = new ViewStore()
    }
    return ViewStore.instance
  }

  @observable todoBeingEdited = null

  @observable todoFilter = SHOW_ALL

  todoFilters = [ SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED ]
}
