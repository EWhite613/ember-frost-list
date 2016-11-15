import {expect} from 'chai'
import Ember from 'ember'
const {
  A,
  Controller,
  run
} = Ember
import {
  beforeEach,
  describe,
  it
} from 'mocha'
import sinon from 'sinon'
import FrostListCoreMixin from 'ember-frost-list/mixins/frost-list-core-mixin'
import FrostListSortingMixin from 'ember-frost-list/mixins/frost-list-sorting-mixin'

describe('Unit: FrostListSortingMixin', function () {
  const testItems = [
    {
      id: '1',
      isSelected: false
    }
  ]
  let subject

  beforeEach(function () {
    let testObject = Controller.extend(FrostListSortingMixin)
    subject = testObject.create({
      listConfig: {
        items: 'model'
      }
    })

    run(() => {
      subject.set('model', testItems)
    })
  })

  it('successfully mixed', function () {
    expect(
      subject
    ).to.be.ok
  })

  it('has the expect Mixins', function () {
    expect(
      FrostListCoreMixin.detect(subject),
      'FrostListCoreMixin Mixin is present'
    ).to.be.true
  })

  describe('sortItems() action', function () {
    const testItems = A([
      {
        id: '1',
        isSelected: false
      },
      {
        id: '2',
        isSelected: false
      }
    ])

    const sortProperties = A([
      {
        direction: ':desc',
        value: 'id'
      }
    ])

    const mixinTestObject = Controller.extend(FrostListSortingMixin)
    const mixin = mixinTestObject.create({
      listConfig: {
        items: 'model',
        sorting: {}
      }
    })
    run(() => mixin.set('model', testItems))

    it('calls default sort', function () {
      const resultItems = [
        {
          id: '2',
          isSelected: false
        },
        {
          id: '1',
          isSelected: false
        }
      ]
      mixin.send('sortItems', sortProperties)

      expect(
        mixin.get('model'),
        'items sorted by "id" in desc order'
      ).to.eql(resultItems)
    })

    it('calls the user defined sort', function () {
      run(() => mixin.set('listConfig.sorting.client', sinon.spy()))

      mixin.send('sortItems', sortProperties)

      expect(
        mixin.get('listConfig.sorting.client').called,
        'user defined sort is fired'
      ).to.be.true
    })
  })
})
