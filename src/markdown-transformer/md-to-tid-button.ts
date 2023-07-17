/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { widget as Widget } from '$:/core/modules/widgets/widget.js';
import { md2tid } from '$:/plugins/linonetwo/markdown-transformer/md-to-tid.js';
import { IParseTreeNode, IWidgetInitialiseOptions } from 'tiddlywiki';

class MdToTidButtonWidget extends Widget {
  /**
   * Lifecycle method: call this.initialise and super
   */
  constructor(parseTreeNode: IParseTreeNode, options?: IWidgetInitialiseOptions) {
    super(parseTreeNode, options);
    this.initialise(parseTreeNode, options);
  }

  /**
   * Lifecycle method: Render this widget into the DOM
   */
  render(parent: Element, nextSibling: Element | null) {
    this.parentDomNode = parent;
    this.computeAttributes();
    const transformButton = this.document.createElement('button');
    $tw.utils.addClass(transformButton, 'tc-btn-invisible');
    transformButton.innerHTML = `${
      $tw.wiki.getTiddlerText(
        '$:/plugins/linonetwo/markdown-transformer/md-to-tid-button-icon',
      ) ?? ''
    }<span class="tc-btn-text tc-button-md-to-tid-button-caption">${
      $tw.wiki.getTiddlerText(
        '$:/plugins/linonetwo/markdown-transformer/md-to-tid-button-icon-caption',
      ) ?? ''
    }</span>`;
    transformButton.addEventListener('click', this.onExecuteButtonClick.bind(this));
    transformButton.title = transformButton.ariaLabel = 'MD2Tid';
    nextSibling ? nextSibling.before(transformButton) : parent.append(transformButton);
    this.domNodes.push(transformButton);
  }

  /**
   * Event listener of button
   */
  async onExecuteButtonClick() {
    const title = this.getAttribute('title');
    if (!title) return;
    const type = this.getAttribute('type') || 'text/vnd.tiddlywiki';
    if (!['text/x-markdown', 'text/markdown', 'application/markdown', 'application/x-markdown'].includes(type)) return;
    const previousMDText = $tw.wiki.getTiddlerText(title);
    if (!previousMDText) return;
    const tidText = await md2tid(previousMDText);
    $tw.wiki.setText(title, 'text', undefined, tidText);
    $tw.wiki.setText(title, 'type', undefined, 'text/vnd.tiddlywiki');
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
exports['md-to-tid-button'] = MdToTidButtonWidget;
