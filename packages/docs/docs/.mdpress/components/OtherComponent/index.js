import React, { PureComponent } from 'react';
import './style.scss';

class OtherComponent extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <label className="switch">
          <input type="checkbox"/>
          <span className="slider round"></span>
        </label>
      </div>
    );
  }
}

export default OtherComponent;