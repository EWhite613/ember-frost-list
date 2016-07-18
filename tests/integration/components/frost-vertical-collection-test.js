/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'frost-vertical-collection',
  'Integration: FrostVerticalCollectionComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#frost-vertical-collection}}
      //     template content
      //   {{/frost-vertical-collection}}
      // `);

      this.render(hbs`{{frost-vertical-collection}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
