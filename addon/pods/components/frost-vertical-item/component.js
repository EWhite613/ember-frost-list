import VerticalItem from 'smoke-and-mirrors/components/vertical-item'
import Ember from 'ember'
import layout from './template'
export default VerticalItem.extend({
  classNameBindings: ['isSelected'],
  layout: layout,
  classNames: ['frost-list-vertical-item'],
  isSelected: Ember.computed('childViews', function () {
    console.log(this.get('childViews'))
    var validFields = this.get('childViews').filter(function (val) { return val.isSelected === true })
    if (validFields.length >= 1) {
      return true
    } else {
      return false
    }
  })
})
