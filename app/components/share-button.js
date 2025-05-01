import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ShareButtonComponent extends Component {
  @action
  async onShare() {
    const content = {
      title: 'ShareDrop',
      text:
        'ShareDrop – easily and securely share files of any size directly between devices using your browser.',
      url: window.location.href,
    };

    navigator
      .share(content)
      .then(() => {
        console.log('Content shared successfully');
      })
      .catch((error) => {
        console.error('Error sharing content:', error);
      });
  }
}
