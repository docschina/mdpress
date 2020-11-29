/* global MDPRESS_TEMP_PATH */

import { siteData } from '@internal/siteData';
import ClientComputedMixin from '@transform/ClientComputedMixin';
import {
  useLocation
} from 'react-router-dom';
import store from '../store';

prepare(siteData);
store.$set('siteData', siteData);

if (module.hot) {
  module.hot.accept(MDPRESS_TEMP_PATH + '/internal/siteData.js', () => {
    prepare(siteData);
    store.$set('siteData', siteData);
  });
}

export default function useData(){
  const location = useLocation();
  return getData(ClientComputedMixin,siteData,location);
}

function getData (I18n, siteData,location) {
  const I18nConstructor = I18n(store.$get('siteData'));
  const i18n = new I18nConstructor({
    ...location,
    path: location.pathname
  });

  i18n.$withBase = function (path) {
    const base = i18n.$site.base;
    if (path.charAt(0) === '/') {
      return base + path.slice(1);
    } else {
      return path;
    }
  };

  return i18n;
}

function prepare (siteData) {
  if (siteData.locales) {
    Object.keys(siteData.locales).forEach(path => {
      siteData.locales[path].path = path;
    });
  }
  Object.freeze(siteData);
}