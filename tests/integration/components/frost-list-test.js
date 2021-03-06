import {expect} from 'chai'
import Ember from 'ember'
const {$, A} = Ember
import {$hook, initialize as initializeHook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import {registerMockComponent, unregisterMockComponent} from 'ember-test-utils/test-support/mock-component'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

const test = integration('frost-list')

/**
 * It helper for selectedItems length
 * @param {Number} length - expected length of selectedItems
 */
function itShouldHaveSelectedItemsLength (length) {
  it(`should have selectedItems length to be ${length}`, function () {
    expect(this.get('selectedItems').length).to.eql(length)
  })
}

/**
 * It helper for whether item is selected or not
 * @param {Number} index - index of selected item.
 * @param {Boolean} isSelected - whether item is selected or not.
 */
function itShouldHaveItemSelectedState (index, isSelected) {
  const state = isSelected ? 'selected' : 'deselected'
  it(`should have item ${index} ${state}`, function () {
    expect($hook('myList-itemContent-item-container', {index}).hasClass('is-selected')).to.eql(isSelected)
  })
}

describe(test.label, function () {
  test.setup()

  let sandbox
  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    initializeHook()
  })

  afterEach(function () {
    sandbox.restore()
  })

  it('should unregister event handler with same handler used with on', function () {
    sandbox.spy($.fn, 'on')
    sandbox.spy($.fn, 'off')

    this.setProperties({
      visible: true,
      items: []
    })

    this.render(hbs`
      {{#if visible}}
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
        }}
      {{/if}}
    `)

    return wait().then(() => {
      this.setProperties({
        visible: false
      })

      const originalHandler = $.fn.on.getCall(0).args[1]
      expect($.fn.off.getCall(0).args[1]).to.equal(originalHandler)
    })
  })

  describe('renders frost-list-item', function () {
    beforeEach(function () {
      const list = A([
        Ember.Object.create({id: '0'})
      ])

      this.set('items', list)

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
        }}
      `)
      return wait()
    })

    it('should set "frost-list" class', function () {
      expect(this.$('.frost-list')).to.have.length(1)
    })

    it('should create one list item', function () {
      expect($hook('myList-itemContent-item')).to.have.length(1)
    })
  })

  describe('renders frost-list with size=medium', function () {
    beforeEach(function () {
      const list = A([
        Ember.Object.create({id: '0'})
      ])

      this.set('items', list)

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
          size='medium'
        }}
      `)
      return wait()
    })

    it('should set "frost-list-item" row height to 50px', function () {
      expect($hook('myList-itemContent-item-container').height()).to.equal(50)
    })
  })

  describe('renders frost-list with size=small', function () {
    beforeEach(function () {
      const list = A([
        Ember.Object.create({id: '0'})
      ])

      this.setProperties({
        items: list,
        selectedItems: A([]),
        onSelectionChange: (selectedItems) => {
          this.get('selectedItems').setObjects(selectedItems)
        }
      })

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
          size='small'
          selectedItems=selectedItems
          onSelectionChange=onSelectionChange
        }}
      `)
      return wait()
    })

    it('should set "frost-list-item" row height to 30px', function () {
      expect($hook('myList-itemContent-item-container').height()).to.equal(30)
    })

    it('should display small checkbox', function () {
      expect($hook('myList-itemContent-selection-checkbox').hasClass('small')).to.eql(true)
    })

    it('should after click, display small checkbox', function () {
      const $el = $hook('myList-itemContent-selection-checkbox')
      $el.click()
      expect($el.hasClass('small')).to.eql(true)
    })
  })

  describe('renders frost-list with size sets to invalid value', function () {
    beforeEach(function () {
      const list = A([
        Ember.Object.create({id: '0'})
      ])

      this.set('items', list)

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
          size='size'
        }}
      `)
      return wait()
    })

    it('should set "frost-list-item" row height to default 50px', function () {
      expect($hook('myList-itemContent-item-container').height()).to.equal(50)
    })
  })

  describe('renders frost-list with defaultHeight=60', function () {
    beforeEach(function () {
      const list = A([
        Ember.Object.create({id: '0'})
      ])

      this.set('items', list)

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
          defaultHeight=60
        }}
      `)
      return wait()
    })

    it('should set "frost-list-item" row height to 60px.', function () {
      expect($hook('myList-itemContent-item-container').height()).to.equal(60)
    })
  })

  describe('renders frost-list with size=small and defaultHeight=60', function () {
    beforeEach(function () {
      const list = A([
        Ember.Object.create({id: '0'})
      ])

      this.set('items', list)

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
          defaultHeight=60
          size='small'
        }}
      `)
      return wait()
    })

    it('should have size attribute get ignored.', function () {
      expect($hook('myList-itemContent-item-container').height()).to.equal(60)
    })
  })

  describe('renders frost-list with isDynamicRowHeight set to true', function () {
    beforeEach(function () {
      const list = A([
        Ember.Object.create({id: '0'})
      ])

      this.set('items', list)

      this.render(hbs`
        {{frost-list
          hook='myList'
          item=(component 'frost-list-item')
          items=items
          isDynamicRowHeight=true
          defaultHeight=60
          size='small'
        }}
      `)
      return wait()
    })

    it('should ignore both defaultHeight and size.', function () {
      expect($hook('myList-itemContent-item-container').height()).to.equal(0)
    })
  })

  describe('when sort component is set', function () {
    beforeEach(function () {
      registerMockComponent(this, 'mock-sort')
      this.set('items', A())

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
          sorting=(component 'mock-sort' class='mock-sort')
        }}
      `)
      return wait()
    })

    afterEach(function () {
      unregisterMockComponent(this, 'mock-sort')
    })

    it('should render the sort component', function () {
      expect(this.$('.mock-sort')).to.have.length(1)
    })

    it('should have the hook "-sorting" set', function () {
      expect($hook('myList-sorting')).to.have.length(1)
    })
  })

  describe('when pagination component is set', function () {
    beforeEach(function () {
      registerMockComponent(this, 'mock-pagination')
      this.set('items', A())

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
          pagination=(component 'mock-pagination' class='mock-pagination')
        }}
      `)
      return wait()
    })

    afterEach(function () {
      unregisterMockComponent(this, 'mock-pagination')
    })

    it('should render the pagination component', function () {
      expect(this.$('.mock-pagination')).to.have.length(1)
    })

    it('should have the hook "-pagination" set', function () {
      expect($hook('myList-pagination')).to.have.length(1)
    })

    it('should have the "paged" class set on "frost-list-header"', function () {
      expect(this.$('.frost-list-header')).to.have.class('paged')
    })

    it('should have the "paged" class set on "frost-list-content-container-top-border"', function () {
      expect(this.$('.frost-list-content-container-top-border')).to.have.class('paged')
    })

    it('should have the "paged" class set on "frost-list-content-container-bottom-border"', function () {
      expect(this.$('.frost-list-content-container-bottom-border')).to.have.class('paged')
    })
  })

  describe('when itemExpansion component is set', function () {
    beforeEach(function () {
      registerMockComponent(this, 'mock-item-expansion')
      const list = A([
        Ember.Object.create({id: '0'})
      ])
      this.setProperties({
        expandedItems: A([]),
        items: list,
        onExpansionChange: (expandedItems) => {
          this.get('expandedItems').setObjects(expandedItems)
        }
      })

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
          itemExpansion=(component 'mock-item-expansion' class='mock-item-expansion')
          expandedItems=expandedItems
        }}
      `)
      return wait()
    })

    afterEach(function () {
      unregisterMockComponent(this, 'mock-item-expansion')
    })

    it('should not render the itemExpansion component when "model.isExpanded" is "false"', function () {
      expect(this.$('.mock-item-expansion')).to.have.length(0)
    })

    it('should render the "frost-list-expanson" component', function () {
      expect($hook('myList-expansion-collapse-all')).to.have.length(1)
    })

    it('should render the "frost-list-item-expansion" component', function () {
      expect($hook('myList-itemContent-expansion', {index: 0})).to.have.length(1)
    })

    describe('when "model.isExpanded" is set to "true"', function () {
      beforeEach(function () {
        const testItem = Ember.Object.create({
          id: '0',
          isExpanded: true
        })

        this.setProperties({
          items: A([testItem]),
          expandedItems: A([testItem])
        })
        return wait()
      })

      it('should render the itemExpansion component', function () {
        expect(this.$('.mock-item-expansion')).to.have.length(1)
      })
    })
  })

  describe('when "onSelectionChange" closure is set', function () {
    beforeEach(function () {
      const list = A([
        Ember.Object.create({id: '0'})
      ])
      this.setProperties({
        items: list,
        onSelectionChange: (selectedItems) => {
          this.get('selectedItems').setObjects(selectedItems)
        }
      })

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          items=items
          hook='myList'
          onSelectionChange=onSelectionChange
        }}
      `)
      return wait()
    })

    it('should render the "frost-list-item-selection" for checkbox selection', function () {
      expect($hook('myList-itemContent-selection')).to.have.length(1)
    })
  })

  describe('Supports pre selection with default itemKey', function () {
    beforeEach(function () {
      const one = Ember.Object.create({isNotCompared: '0'})
      const two = Ember.Object.create({isNotCompared: '1'})
      const testItems = [one, two]
      const testSelectedItems = [one]
      this.setProperties({
        items: testItems,
        selectedItems: testSelectedItems
      })
      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          hook='myList'
          items=items
          selectedItems=selectedItems
        }}
      `)
      return wait()
    })

    it('should have item 0 is selected', function () {
      expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
    })

    it('should have item 1 is not selected', function () {
      expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(false)
    })

    it('should have selectedItems length to be 1', function () {
      expect(this.get('selectedItems').length).to.eql(1)
    })
  })

  describe('Supports pre selection with custom itemKey', function () {
    beforeEach(function () {
      const testItems = [
        Ember.Object.create({id: '0'}),
        Ember.Object.create({id: '1'})
      ]
      const testSelectedItems = [
        Ember.Object.create({id: '0'})
      ]

      this.setProperties({
        items: testItems,
        selectedItems: testSelectedItems
      })

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          hook='myList'
          items=items
          selectedItems=selectedItems
          itemKey='id'
        }}
      `)
      return wait()
    })

    it('should have item 0 is selected', function () {
      expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
    })
    it('should have item 1 is not selected', function () {
      expect($hook('myList-itemContent-container', {index: 1}).hasClass('is-selected')).to.eql(false)
    })

    it('should have selectedItems length to be 1', function () {
      expect(this.get('selectedItems').length).to.eql(1)
    })
  })

  describe('When using custom itemKey', function () {
    describe('When Infinite', function () {
      beforeEach(function () {
        const testItems = A([
          Ember.Object.create({id: '0'}),
          Ember.Object.create({id: '1'})
        ])

        this.setProperties({
          items: testItems,
          selectedItems: A([]),
          onSelectionChange: (selectedItems) => {
            this.get('selectedItems').setObjects(selectedItems)
          }
        })

        this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          hook='myList'
          items=items
          selectedItems=selectedItems
          onSelectionChange=onSelectionChange
          itemKey='id'
        }}
      `)
        return wait()
      })

      describe('Supports basic click', function () {
        describe('Selecting item 0', function () {
          beforeEach(function () {
            $hook('myList-itemContent-item', {index: 0}).click()
            return wait()
          })

          it('should have item 0 is selected', function () {
            return wait().then(() => {
              expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
            })
          })

          it('should have item 1 is not selected', function () {
            return wait().then(() => {
              expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(false)
            })
          })

          it('should have selectedItems length to be 1', function () {
            return wait().then(() => {
              expect(this.get('selectedItems').length).to.eql(1)
            })
          })

          describe('Selecting previous selected item', function () {
            beforeEach(function () {
              $hook('myList-itemContent-item', {index: 0}).click()
              return wait()
            })

            it('should have item 0 is not selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
            })

            it('should have item 1 is not selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(false)
            })

            it('should have selectedItems length to be 0', function () {
              expect(this.get('selectedItems').length).to.eql(0)
            })
          })
        })

        describe('All items selected, then select item 0', function () {
          beforeEach(function () {
            $hook('myList-itemContent-selection', {index: 0}).click()
            $hook('myList-itemContent-selection', {index: 1}).click()
            $hook('myList-itemContent-item', {index: 0}).click()
            return wait()
          })

          it('should have item 0 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 1 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(false)
          })

          it('should have selectedItems length to be 1', function () {
            expect(this.get('selectedItems').length).to.eql(1)
          })
        })
      })

      describe('Supports specific click', function () {
        describe('Selecting item 0', function () {
          beforeEach(function () {
            $hook('myList-itemContent-selection', {index: 0}).click()
            return wait()
          })

          it('should have item 0 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
          })
          it('should have item 1 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(false)
          })

          it('should have selectedItems length to be 1', function () {
            expect(this.get('selectedItems').length).to.eql(1)
          })

          describe('Unselecting item 1', function () {
            beforeEach(function () {
              $hook('myList-itemContent-selection', {index: 0}).click()
              return wait()
            })

            it('should have item 0 is not selected', function () {
              expect($($hook('myList-itemContent-item-container', {index: 0})).hasClass('is-selected')).to.eql(false)
            })

            it('should have item 1 is not selected', function () {
              expect($($hook('myList-itemContent-item-container', {index: 1})).hasClass('is-selected')).to.eql(false)
            })

            it('should have selectedItems length to be 0', function () {
              expect(this.get('selectedItems').length).to.eql(0)
            })
          })
        })

        describe('Selecting every item', function () {
          beforeEach(function () {
            $hook('myList-itemContent-selection', {index: 0}).click()
            $hook('myList-itemContent-selection', {index: 1}).click()
            return wait()
          })

          it('should have item 0 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 1 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
          })

          it('should have selectedItems length to be 2', function () {
            expect(this.get('selectedItems').length).to.eql(2)
          })

          describe('Unselect each item', function () {
            beforeEach(function () {
              $hook('myList-itemContent-selection', {index: 0}).click()
              $hook('myList-itemContent-selection', {index: 1}).click()
              return wait()
            })

            it('should have item 0 is not selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
            })

            it('should have item 1 is not selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(false)
            })

            it('should have selectedItems length to be 0', function () {
              expect(this.get('selectedItems').length).to.eql(0)
            })
          })
        })
      })

      describe('Supports ranged base clicks', function () {
        beforeEach(function () {
          const testItems = A([
            Ember.Object.create({id: '0'}),
            Ember.Object.create({id: '1'}),
            Ember.Object.create({id: '2'}),
            Ember.Object.create({id: '3'}),
            Ember.Object.create({id: '4'}),
            Ember.Object.create({id: '5'}),
            Ember.Object.create({id: '6'})
          ])
          this.set('items', testItems)
          return wait()
        })

        describe('When using shift click from item1-5', function () {
          beforeEach(function () {
            const clickEvent = $.Event('click')
            clickEvent.shiftKey = true
            const clickEvent2 = $.Event('click')
            clickEvent2.shiftKey = true
            $hook('myList-itemContent-item', {index: 1}).trigger(clickEvent)
            $hook('myList-itemContent-item', {index: 5}).trigger(clickEvent2)
            return wait()
          })

          it('should have item 0 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
          })

          it('should have item 1 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 2 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 3 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 3}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 4 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 4}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 5 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 5}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 6 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 6}).hasClass('is-selected')).to.eql(false)
          })

          it('should have selectedItems length to be 5', function () {
            expect(this.get('selectedItems').length).to.eql(5)
          })
        })

        describe('When using shift click on item 1', function () {
          beforeEach(function () {
            const clickEvent = $.Event('click')
            clickEvent.shiftKey = true
            $hook('myList-itemContent-item', {index: 1}).trigger(clickEvent)
            return wait()
          })

          it('should have item 0 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
          })

          it('should have item 1 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 2 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(false)
          })

          it('should have item 3 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 3}).hasClass('is-selected')).to.eql(false)
          })

          it('should have item 4 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 4}).hasClass('is-selected')).to.eql(false)
          })

          it('should have item 5 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 5}).hasClass('is-selected')).to.eql(false)
          })

          it('should have item 6 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 6}).hasClass('is-selected')).to.eql(false)
          })

          it('should have selectedItems length to be 1', function () {
            expect(this.get('selectedItems').length).to.eql(1)
          })

          describe('When using shift click on item 3', function () {
            beforeEach(function () {
              const clickEvent = $.Event('click')
              clickEvent.shiftKey = true
              $hook('myList-itemContent-item', {index: 3}).trigger(clickEvent)
              return wait()
            })

            it('should have item 0 is not selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
            })

            it('should have item 1 is selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
            })

            it('should have item 2 is selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(true)
            })

            it('should have item 3 is selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 3}).hasClass('is-selected')).to.eql(true)
            })

            it('should have item 4 is not selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 4}).hasClass('is-selected')).to.eql(false)
            })

            it('should have item 5 is not selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 5}).hasClass('is-selected')).to.eql(false)
            })

            it('should have item 6 is not selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 6}).hasClass('is-selected')).to.eql(false)
            })

            it('should have selectedItems length to be 3', function () {
              expect(this.get('selectedItems').length).to.eql(3)
            })

            describe('When using shift click on item 5', function () {
              beforeEach(function () {
                const clickEvent = $.Event('click')
                clickEvent.shiftKey = true
                $hook('myList-itemContent-item', {index: 5}).trigger(clickEvent)
                return wait()
              })

              it('should have item 0 is not selected', function () {
                expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
              })

              it('should have item 1 is selected', function () {
                expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
              })

              it('should have item 2 is selected', function () {
                expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(true)
              })

              it('should have item 3 is selected', function () {
                expect($hook('myList-itemContent-item-container', {index: 3}).hasClass('is-selected')).to.eql(true)
              })

              it('should have item 4 is selected', function () {
                expect($hook('myList-itemContent-item-container', {index: 4}).hasClass('is-selected')).to.eql(true)
              })

              it('should have item 5 is selected', function () {
                expect($hook('myList-itemContent-item-container', {index: 5}).hasClass('is-selected')).to.eql(true)
              })

              it('should have item 6 is not selected', function () {
                expect($hook('myList-itemContent-item-container', {index: 6}).hasClass('is-selected')).to.eql(false)
              })

              it('should have selectedItems length to be 5', function () {
                expect(this.get('selectedItems').length).to.eql(5)
              })

              describe('When using shift click on item 1', function () {
                beforeEach(function () {
                  const clickEvent = $.Event('click')
                  clickEvent.shiftKey = true
                  $hook('myList-itemContent-item', {index: 1}).trigger(clickEvent)
                  return wait()
                })

                it('should have item 0 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
                })

                it('should have item 1 is selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
                })

                it('should have item 2 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(false)
                })

                it('should have item 3 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 3}).hasClass('is-selected')).to.eql(false)
                })

                it('should have item 4 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 4}).hasClass('is-selected')).to.eql(false)
                })

                it('should have item 5 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 5}).hasClass('is-selected')).to.eql(false)
                })

                it('should have item 6 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 6}).hasClass('is-selected')).to.eql(false)
                })

                it('should have selectedItems length to be 1', function () {
                  expect(this.get('selectedItems').length).to.eql(1)
                })
              })

              describe('When using shift click on item 0', function () {
                beforeEach(function () {
                  const clickEvent = $.Event('click')
                  clickEvent.shiftKey = true
                  $hook('myList-itemContent-item', {index: 0}).trigger(clickEvent)
                  return wait()
                })

                it('should have item 0 is selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
                })

                it('should have item 1 is selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
                })

                it('should have item 2 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(false)
                })

                it('should have item 3 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 3}).hasClass('is-selected')).to.eql(false)
                })

                it('should have item 4 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 4}).hasClass('is-selected')).to.eql(false)
                })

                it('should have item 5 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 5}).hasClass('is-selected')).to.eql(false)
                })

                it('should have item 6 is not selected', function () {
                  expect($hook('myList-itemContent-item-container', {index: 6}).hasClass('is-selected')).to.eql(false)
                })

                it('should have selectedItems length to be 2', function () {
                  expect(this.get('selectedItems').length).to.eql(2)
                })
              })
            })
          })
        })
      })
    })

    describe('When Paged', function () {
      beforeEach(function () {
        // Note: DON'T change the seeding, the object creation/destruction is intentional
        // to prove that comparison of selected items only via key works!
        const testItems = A([
          Ember.Object.create({id: '0'}),
          Ember.Object.create({id: '1'}),
          Ember.Object.create({id: '2'})
        ])
        this.set('actions', {
          onChange: function (page) {
            this.set('page', page)
            if (page === 0) {
              this.set('items', A([
                Ember.Object.create({id: '0'}),
                Ember.Object.create({id: '1'}),
                Ember.Object.create({id: '2'})
              ])
              )
            } else if (page === 1) {
              this.set('items', A([
                Ember.Object.create({id: '3'}),
                Ember.Object.create({id: '4'}),
                Ember.Object.create({id: '5'})
              ])
              )
            }
          }
        })

        this.setProperties({
          items: testItems,
          onSelectionChange: (selectedItems) => {
            this.get('selectedItems').setObjects(selectedItems)
          },
          page: 0,
          selectedItems: A([])
        })

        this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          hook='myList'
          items=items
          selectedItems=selectedItems
          onSelectionChange=onSelectionChange
          itemKey='id'
          pagination=(component 'frost-list-pagination'
            itemsPerPage=3
            onChange=(action 'onChange')
            page=page
            total=6
          )
        }}
      `)
        return wait()
      })

      it('should display proper pagination 1 to 3 of 6', function () {
        expect($('.frost-list-pagination-text').text().trim()).to.eql('1 to 3 of 6')
      })

      describe('When shift selecting item1-3', function () {
        beforeEach(function () {
          const clickEvent = $.Event('click')
          clickEvent.shiftKey = true
          const clickEvent2 = $.Event('click')
          clickEvent2.shiftKey = true
          $hook('myList-itemContent-item', {index: 0}).trigger(clickEvent)
          $hook('myList-itemContent-item', {index: 2}).trigger(clickEvent2)
          return wait()
        })

        it('should have item 0 is selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
        })

        it('should have item 1 is selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
        })

        it('should have item 2 is selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(true)
        })

        it('should have selectedItems length to be 3', function () {
          expect(this.get('selectedItems').length).to.eql(3)
        })

        describe('When clicking next page', function () {
          beforeEach(function () {
            $hook('myList-pagination-next-page').click()
            return wait()
          })

          it('should have item 0 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
          })

          it('should have item 1 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(false)
          })

          it('should have item 2 is not selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(false)
          })

          it('should have selectedItems length to be 3', function () {
            expect(this.get('selectedItems').length).to.eql(3)
          })

          it('should display proper pagination 4 to 6 of 6', function () {
            expect($('.frost-list-pagination-text').text().trim()).to.eql('4 to 6 of 6')
          })

          describe('When shift click item4-6', function () {
            beforeEach(function () {
              const clickEvent = $.Event('click')
              clickEvent.shiftKey = true
              const clickEvent2 = $.Event('click')
              clickEvent2.shiftKey = true
              $hook('myList-itemContent-item', {index: 0}).trigger(clickEvent)
              $hook('myList-itemContent-item', {index: 2}).trigger(clickEvent2)
              return wait()
            })
            it('should have item 0 is selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
            })

            it('should have item 1 is selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
            })

            it('should have item 2 is selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(true)
            })

            it('should have selectedItems length to be 6', function () {
              expect(this.get('selectedItems').length).to.eql(6)
            })
          })
        })
      })

      describe('When using specific select on item 2', function () {
        beforeEach(function () {
          $hook('myList-itemContent-selection', {index: 1}).click()
          return wait()
        })

        it('should have item 0 is not selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
        })

        it('should have item 1 is selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
        })

        it('should have item 2 is not selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(false)
        })

        it('should have selectedItems length to be 1', function () {
          expect(this.get('selectedItems').length).to.eql(1)
        })

        describe('When switching to page 2 and shift click item4-6', function () {
          beforeEach(function () {
            $hook('myList-pagination-next-page').click()
            return wait().then(() => {
              const clickEvent = $.Event('click')
              clickEvent.shiftKey = true
              const clickEvent2 = $.Event('click')
              clickEvent2.shiftKey = true
              $hook('myList-itemContent-item', {index: 0}).trigger(clickEvent)
              $hook('myList-itemContent-item', {index: 2}).trigger(clickEvent2)
              return wait()
            })
          })

          it('should have item 0 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 1 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
          })

          it('should have item 2 is selected', function () {
            expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(true)
          })

          it('should have selectedItems length to be 4', function () {
            expect(this.get('selectedItems').length).to.eql(4)
          })

          describe('When switching to page 1 and shift click item1-3', function () {
            beforeEach(function () {
              $hook('myList-pagination-previous-page').click()
              return wait().then(() => {
                const clickEvent = $.Event('click')
                clickEvent.shiftKey = true
                const clickEvent2 = $.Event('click')
                clickEvent2.shiftKey = true
                $hook('myList-itemContent-item', {index: 0}).trigger(clickEvent)
                $hook('myList-itemContent-item', {index: 2}).trigger(clickEvent2)
                return wait()
              })
            })

            it('should have item 0 is selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(true)
            })

            it('should have item 1 is selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
            })

            it('should have item 2 is selected', function () {
              expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(true)
            })

            it('should have selectedItems length to be 6', function () {
              expect(this.get('selectedItems').length).to.eql(6)
            })
          })
        })
      })
    })
  })

  describe('When using default itemKey', function () {
    beforeEach(function () {
      const testItems = A([
        Ember.Object.create({id: '0'}),
        Ember.Object.create({id: '1'}),
        Ember.Object.create({id: '2'}),
        Ember.Object.create({id: '3'}),
        Ember.Object.create({id: '4'}),
        Ember.Object.create({id: '5'}),
        Ember.Object.create({id: '6'})
      ])

      this.setProperties({
        items: testItems,
        onSelectionChange: (selectedItems) => {
          this.get('selectedItems').setObjects(selectedItems)
        },
        selectedItems: A([])
      })

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          hook='myList'
          items=items
          selectedItems=selectedItems
          onSelectionChange=onSelectionChange
        }}
      `)
      return wait()
    })

    describe('Supports ranged based clicks', function () {
      describe('When using shift click from item1-5', function () {
        beforeEach(function () {
          const clickEvent = $.Event('click')
          clickEvent.shiftKey = true
          const clickEvent2 = $.Event('click')
          clickEvent2.shiftKey = true
          $hook('myList-itemContent-item', {index: 1}).trigger(clickEvent)
          $hook('myList-itemContent-item', {index: 5}).trigger(clickEvent2)
          return wait()
        })

        it('should have item 0 is not selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 0}).hasClass('is-selected')).to.eql(false)
        })

        it('should have item 1 is selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 1}).hasClass('is-selected')).to.eql(true)
        })

        it('should have item 2 is selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 2}).hasClass('is-selected')).to.eql(true)
        })

        it('should have item 3 is selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 3}).hasClass('is-selected')).to.eql(true)
        })

        it('should have item 4 is selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 4}).hasClass('is-selected')).to.eql(true)
        })

        it('should have item 5 is selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 5}).hasClass('is-selected')).to.eql(true)
        })

        it('should have item 6 is not selected', function () {
          expect($hook('myList-itemContent-item-container', {index: 6}).hasClass('is-selected')).to.eql(false)
        })

        it('should have selectedItems length to be 5', function () {
          expect(this.get('selectedItems').length).to.eql(5)
        })
      })
    })
  })

  describe('Supports item expansion', function () {
    beforeEach(function () {
      const testItems = A([
        Ember.Object.create({id: '0'}),
        Ember.Object.create({id: '1'})
      ])

      this.setProperties({
        items: testItems,
        expandedItems: A([]),
        selectedItems: A([]),
        onExpansionChange: (expandedItems) => {
          this.get('expandedItems').setObjects(expandedItems)
        },
        onSelectionChange: (selectedItems) => {
          this.get('selectedItems').setObjects(selectedItems)
        }
      })

      this.render(hbs`
        {{frost-list
          item=(component 'frost-list-item')
          itemExpansion=(component 'frost-list-item')
          hook='myList'
          items=items
          selectedItems=selectedItems
          onSelectionChange=onSelectionChange
          onExpansionChange=onExpansionChange
          expandedItems=expandedItems
        }}
      `)
      return wait()
    })

    describe('clicking item 0 expansion button', function () {
      beforeEach(function () {
        $hook('myList-itemContent-expansion', {index: 0}).click()
        return wait()
      })

      it('should have item 0 is expanded', function () {
        expect($hook('myList-itemContent-itemExpansion', {index: 0})).to.have.length(1)
      })

      describe('clicking item 0 expansion button', function () {
        beforeEach(function () {
          $hook('myList-itemContent-expansion', {index: 0}).click()
          return wait()
        })
        it('should have item 0 is not expanded', function () {
          expect($hook('myList-itemContent-itemExpansion', {index: 0})).to.have.length(0)
        })
      })
    })

    describe('clicking Expand All button', function () {
      beforeEach(function () {
        $hook('myList-expansion-expand-all').click()
        return wait()
      })

      it('should have item 0 is expanded', function () {
        expect($hook('myList-itemContent-itemExpansion', {index: 0})).to.have.length(1)
      })

      it('should have item 1 is expanded', function () {
        expect($hook('myList-itemContent-itemExpansion', {index: 1})).to.have.length(1)
      })
    })
  })

  describe('When using disableDeselectAll property', function () {
    beforeEach(function () {
      const testItems = A([
        Ember.Object.create({id: '0'}),
        Ember.Object.create({id: '1'})
      ])

      this.setProperties({
        disableDeselectAll: true,
        items: testItems,
        selectedItems: A([]),
        onSelectionChange: (selectedItems) => {
          this.get('selectedItems').setObjects(selectedItems)
        }
      })

      this.render(hbs`
        {{frost-list
          disableDeselectAll=disableDeselectAll
          item=(component 'frost-list-item')
          hook='myList'
          items=items
          selectedItems=selectedItems
          onSelectionChange=onSelectionChange
          itemKey='id'
        }}
      `)
      return wait()
    })

    describe('When using specific click', function () {
      describe('When selecting item 0', function () {
        beforeEach(function () {
          $hook('myList-itemContent-selection', {index: 0}).click()
          return wait()
        })

        itShouldHaveItemSelectedState(0, true)
        itShouldHaveItemSelectedState(1, false)
        itShouldHaveSelectedItemsLength(1)

        describe('When deselecting item 1', function () {
          beforeEach(function () {
            $hook('myList-itemContent-selection', {index: 0}).click()
            return wait()
          })

          itShouldHaveItemSelectedState(0, false)
          itShouldHaveItemSelectedState(1, false)
          itShouldHaveSelectedItemsLength(0)
        })
      })

      describe('When selecting every item', function () {
        beforeEach(function () {
          $hook('myList-itemContent-selection', {index: 0}).click()
          $hook('myList-itemContent-selection', {index: 1}).click()
          return wait()
        })

        itShouldHaveItemSelectedState(0, true)
        itShouldHaveItemSelectedState(1, true)
        itShouldHaveSelectedItemsLength(2)

        describe('When deselecting every item', function () {
          beforeEach(function () {
            $hook('myList-itemContent-selection', {index: 0}).click()
            $hook('myList-itemContent-selection', {index: 1}).click()
            return wait()
          })

          itShouldHaveItemSelectedState(0, false)
          itShouldHaveItemSelectedState(1, false)
          itShouldHaveSelectedItemsLength(0)
        })
      })
    })

    describe('When using ranged base clicks', function () {
      beforeEach(function () {
        const testItems = A([
          Ember.Object.create({id: '0'}),
          Ember.Object.create({id: '1'}),
          Ember.Object.create({id: '2'}),
          Ember.Object.create({id: '3'}),
          Ember.Object.create({id: '4'}),
          Ember.Object.create({id: '5'}),
          Ember.Object.create({id: '6'})
        ])
        this.set('items', testItems)
        return wait()
      })

      describe('When using shift click from item1-5', function () {
        beforeEach(function () {
          const clickEvent = $.Event('click')
          clickEvent.shiftKey = true
          const clickEvent2 = $.Event('click')
          clickEvent2.shiftKey = true
          $hook('myList-itemContent-item', {index: 1}).trigger(clickEvent)
          $hook('myList-itemContent-item', {index: 5}).trigger(clickEvent2)
          return wait()
        })

        itShouldHaveItemSelectedState(0, false)
        itShouldHaveItemSelectedState(1, true)
        itShouldHaveItemSelectedState(2, true)
        itShouldHaveItemSelectedState(3, true)
        itShouldHaveItemSelectedState(4, true)
        itShouldHaveItemSelectedState(5, true)
        itShouldHaveItemSelectedState(6, false)
        itShouldHaveSelectedItemsLength(5)
      })

      describe('When using shift click on item 1', function () {
        beforeEach(function () {
          const clickEvent = $.Event('click')
          clickEvent.shiftKey = true
          $hook('myList-itemContent-item', {index: 1}).trigger(clickEvent)
          return wait()
        })

        itShouldHaveItemSelectedState(0, false)
        itShouldHaveItemSelectedState(1, true)
        itShouldHaveItemSelectedState(2, false)
        itShouldHaveItemSelectedState(3, false)
        itShouldHaveItemSelectedState(4, false)
        itShouldHaveItemSelectedState(5, false)
        itShouldHaveItemSelectedState(6, false)
        itShouldHaveSelectedItemsLength(1)

        describe('When using shift click on item 3', function () {
          beforeEach(function () {
            const clickEvent = $.Event('click')
            clickEvent.shiftKey = true
            $hook('myList-itemContent-item', {index: 3}).trigger(clickEvent)
            return wait()
          })

          itShouldHaveItemSelectedState(0, false)
          itShouldHaveItemSelectedState(1, true)
          itShouldHaveItemSelectedState(2, true)
          itShouldHaveItemSelectedState(3, true)
          itShouldHaveItemSelectedState(4, false)
          itShouldHaveItemSelectedState(5, false)
          itShouldHaveItemSelectedState(6, false)
          itShouldHaveSelectedItemsLength(3)

          describe('When using shift click on item 5', function () {
            beforeEach(function () {
              const clickEvent = $.Event('click')
              clickEvent.shiftKey = true
              $hook('myList-itemContent-item', {index: 5}).trigger(clickEvent)
              return wait()
            })

            itShouldHaveItemSelectedState(0, false)
            itShouldHaveItemSelectedState(1, true)
            itShouldHaveItemSelectedState(2, true)
            itShouldHaveItemSelectedState(3, true)
            itShouldHaveItemSelectedState(4, true)
            itShouldHaveItemSelectedState(5, true)
            itShouldHaveItemSelectedState(6, false)
            itShouldHaveSelectedItemsLength(5)

            describe('When using shift click on item 1', function () {
              beforeEach(function () {
                const clickEvent = $.Event('click')
                clickEvent.shiftKey = true
                $hook('myList-itemContent-item', {index: 1}).trigger(clickEvent)
                return wait()
              })

              itShouldHaveItemSelectedState(0, false)
              itShouldHaveItemSelectedState(1, true)
              itShouldHaveItemSelectedState(2, false)
              itShouldHaveItemSelectedState(3, false)
              itShouldHaveItemSelectedState(4, false)
              itShouldHaveItemSelectedState(5, false)
              itShouldHaveItemSelectedState(6, false)
              itShouldHaveSelectedItemsLength(1)
            })

            describe('When using shift click on item 0', function () {
              beforeEach(function () {
                const clickEvent = $.Event('click')
                clickEvent.shiftKey = true
                $hook('myList-itemContent-item', {index: 0}).trigger(clickEvent)
                return wait()
              })

              itShouldHaveItemSelectedState(0, true)
              itShouldHaveItemSelectedState(1, true)
              itShouldHaveItemSelectedState(2, false)
              itShouldHaveItemSelectedState(3, false)
              itShouldHaveItemSelectedState(4, false)
              itShouldHaveItemSelectedState(5, false)
              itShouldHaveItemSelectedState(6, false)
              itShouldHaveSelectedItemsLength(2)
            })
          })
        })
      })
    })

    describe('When using basic click', function () {
      // Basic click should behave like an isSpecificSelect click now.
      describe('When selecting item 0', function () {
        beforeEach(function () {
          $hook('myList-itemContent-item', {index: 0}).click()
          return wait()
        })

        itShouldHaveItemSelectedState(0, true)
        itShouldHaveItemSelectedState(1, false)
        itShouldHaveSelectedItemsLength(1)

        describe('When selecting item 1', function () {
          beforeEach(function () {
            $hook('myList-itemContent-item', {index: 1}).click()
            return wait()
          })

          itShouldHaveItemSelectedState(0, true)
          itShouldHaveItemSelectedState(1, true)
          itShouldHaveSelectedItemsLength(2)

          describe('When deselecting item 0', function () {
            beforeEach(function () {
              $hook('myList-itemContent-item', {index: 0}).click()
              return wait()
            })

            itShouldHaveItemSelectedState(0, false)
            itShouldHaveItemSelectedState(1, true)
            itShouldHaveSelectedItemsLength(1)
          })
        })
      })
    })
  })

  describe('When singleSelection is true', function () {
    beforeEach(function () {
      const testItems = A([
        Ember.Object.create({id: '0'}),
        Ember.Object.create({id: '1'}),
        Ember.Object.create({id: '2'})
      ])

      this.setProperties({
        items: testItems,
        selectedItems: A([]),
        onSelectionChange: (selectedItems) => {
          this.get('selectedItems').setObjects(selectedItems)
        }
      })

      this.render(hbs`
        {{frost-list
          singleSelection=true
          item=(component 'frost-list-item')
          hook='myList'
          items=items
          selectedItems=selectedItems
          onSelectionChange=onSelectionChange
        }}
      `)
      return wait()
    })

    describe('should only select one item with shift', function () {
      beforeEach(function () {
        $hook('myList-itemContent-item', {index: 0}).click()
        const clickEvent = $.Event('click')
        clickEvent.shiftKey = true
        $hook('myList-itemContent-item', {index: 2}).trigger(clickEvent)
      })

      itShouldHaveItemSelectedState(0, false)
      itShouldHaveItemSelectedState(1, false)
      itShouldHaveItemSelectedState(2, true)
      itShouldHaveSelectedItemsLength(1)
    })

    describe('should only select one item with specific click', function () {
      beforeEach(function () {
        $hook('myList-itemContent-selection', {index: 0}).click()
        $hook('myList-itemContent-selection', {index: 1}).click()
      })

      itShouldHaveItemSelectedState(0, false)
      itShouldHaveItemSelectedState(1, true)
      itShouldHaveSelectedItemsLength(1)
    })
  })

  describe('expansionType', function () {
    describe('Set to always', function () {
      describe('itemExpansion is provided', function () {
        beforeEach(function () {
          registerMockComponent(this, 'mock-item-expansion')
          const testItems = A([
            Ember.Object.create({id: '0'}),
            Ember.Object.create({id: '1'})
          ])

          this.setProperties({
            items: testItems,
            expandedItems: A([])
          })

          this.render(hbs`
            {{frost-list
              expansionType='always'
              expandedItems=expandedItems
              item=(component 'frost-list-item')
              itemExpansion=(component 'mock-item-expansion' class='mock-item-expansion')
              hook='myList'
              items=items
            }}
          `)
          return wait()
        })

        afterEach(function () {
          unregisterMockComponent(this, 'mock-item-expansion')
        })

        it('should not show list-expansion header', function () {
          expect($hook('myList-expansion')).to.have.length(0)
        })

        it('should not show item-expansion arrow', function () {
          expect($hook('myList-itemContent-expansion')).to.have.length(0)
        })

        it('should have all items expanded', function () {
          expect($hook('myList-itemContent-itemExpansion')).to.have.length(2)
        })
      })

      describe('itemExpansion not provided', function () {
        beforeEach(function () {
          const testItems = A([
            Ember.Object.create({id: '0'}),
            Ember.Object.create({id: '1'})
          ])

          this.setProperties({
            items: testItems,
            expandedItems: A([])
          })

          this.render(hbs`
            {{frost-list
              expansionType='always'
              expandedItems=expandedItems
              item=(component 'frost-list-item')
              hook='myList'
              items=items
            }}
          `)
          return wait()
        })

        it('should still render items if itemExpansion not provided', function () {
          expect($hook('myList-itemContent')).to.have.length(2)
        })
      })
    })

    describe('Set to initial', function () {
      beforeEach(function () {
        registerMockComponent(this, 'mock-item-expansion')
        const testItems = A([
          Ember.Object.create({id: '0'}),
          Ember.Object.create({id: '1'})
        ])

        this.setProperties({
          items: testItems,
          expandedItems: A([])
        })

        this.render(hbs`
          {{frost-list
            expansionType='initial'
            expandedItems=expandedItems
            item=(component 'frost-list-item')
            itemExpansion=(component 'mock-item-expansion' class='mock-item-expansion')
            hook='myList'
            items=items
          }}
        `)
        return wait()
      })

      afterEach(function () {
        unregisterMockComponent(this, 'mock-item-expansion')
      })

      it('should show list-expansion header', function () {
        expect($hook('myList-expansion')).to.have.length(1)
      })

      it('should show item-expansion arrow', function () {
        expect($hook('myList-itemContent-expansion')).to.have.length(2)
      })

      it('should have all items expanded', function () {
        expect($hook('myList-itemContent-itemExpansion')).to.have.length(2)
      })
    })
  })
})
