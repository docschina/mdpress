import markdown from '@mdpress/markdown-browser';
import Store from './Store';

class MdPress extends Store {
  constructor(){
    super();
    this.mdConfig = {};
  }

  createMD(config = this.mdConfig){
    return markdown(config);
  }
}

export default MdPress;
