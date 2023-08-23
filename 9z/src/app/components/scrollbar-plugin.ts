
import { ScrollbarPlugin } from 'smooth-scrollbar';

export class ScrollbarCustomPlugin extends ScrollbarPlugin {
  static pluginName = 'custom';

  static defaultOptions = {
    open: false,
  };

  transformDelta(delta: any) {
    return this.options.open ? { x: 0, y: 0 } : delta;
  }
}
