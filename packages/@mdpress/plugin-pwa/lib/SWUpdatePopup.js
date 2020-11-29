/* global SW_UPDATE_POPUP */

import React,{ useState } from 'react';
import { Transition } from 'react-transition-group';
import event from '@app/store';
import { normalizeConfig } from '@app/util';
import useData from '@app/hooks/data';
import { useComponentWillMount } from '@app/hooks/lifecycle';
import { popupConfig as defaultPopupConfig } from './i18n';
import './style.styl';

export default function SWUpdatePopup(props) {
  const { render } = props;
  const [rawPopupConfig] = useState(SW_UPDATE_POPUP ? defaultPopupConfig : SW_UPDATE_POPUP);
  const [updateEvent,setUpdateEvent] = useState(null);
  const popupConfig = normalizeConfig(useData(), rawPopupConfig);
  const enabled = !!(popupConfig && updateEvent);
  const message = (() => {
    const c = popupConfig;
    return (c && c.message) || defaultPopupConfig['/'].message;
  })();
  const buttonText = (() => {
    const c = popupConfig;
    return (c && c.buttonText) || defaultPopupConfig['/'].buttonText;
  })();

  const onSWUpdated = (e) => {
    setUpdateEvent(e);
  };

  const reload = () =>{
    if (updateEvent) {
      updateEvent.skipWaiting().then(() => {
        location.reload(true);
      });
      setUpdateEvent(null);
    }
  };

  useComponentWillMount(()=>{
    event.$on('sw-updated', onSWUpdated);
  });

  return <Transition
    name="sw-update-popup"
    timeout={{
      appear: 500,
      enter: 300,
      exit: 500,
    }}
  >
    <React.Fragment>
      {render ? render(enabled, reload, message, buttonText) : enabled &&
            <div
              className="sw-update-popup"
            >
              {message }

              <br/>

              <button onClick={reload}>
                {buttonText}
              </button>
            </div>
      }

    </React.Fragment>
  </Transition>;
}