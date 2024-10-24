/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { md2tid } from '$:/plugins/linonetwo/markdown-transformer/md-to-tid.js';

exports.name = 'md-to-tid-message';
exports.platforms = ['browser', 'node'];
exports.after = ['startup'];
exports.synchronous = true;
exports.startup = function() {
  $tw.rootWidget.addEventListener('tm-md-tiddler-to-tid', function(event) {
    const title = event.param || event.tiddlerTitle;
    if (!title) return;
    const type = $tw.wiki.getTiddler(title)?.fields?.type || 'text/vnd.tiddlywiki';
    if (!['text/x-markdown', 'text/markdown', 'application/markdown', 'application/x-markdown'].includes(type)) return;
    const previousMDText = $tw.wiki.getTiddlerText(title);
    if (!previousMDText) return;
    void md2tid(previousMDText).then(tidText => {
      $tw.wiki.setText(title, 'text', undefined, tidText);
      $tw.wiki.setText(title, 'type', undefined, 'text/vnd.tiddlywiki');
    });
    return false;
  });
};
