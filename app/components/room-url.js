import TextField from '@ember/component/text-field';
import $ from 'jquery';

export default TextField.extend({
  classNames: ['room-url'],

  didInsertElement() {
    $(this.element).focus().select();
  },
});
