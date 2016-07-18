/* jshint expr:true */
import { expect } from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'frost-vertical-item',
  'Integration: FrostVerticalItemComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#frost-vertical-item}}
      //     template content
      //   {{/frost-vertical-item}}
      // `);

      this.render(hbs`{{frost-vertical-item}}`);
      expect(this.$()).to.have.length(1);
    });
  }
);
