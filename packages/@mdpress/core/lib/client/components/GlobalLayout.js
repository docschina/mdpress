import React from 'react';
import { setGlobalInfo } from '@app/util';
import useData from '@app/hooks/data';
import useUpdateMeta from '@app/hooks/updateMeta';
import { getLayoutAsyncComponent,getSyncComponent } from '@app/util';

export default function GlobalLayout(props) {
  const { $page } = useData();
  useUpdateMeta(props);

  const getLayout = ()  => {
    if ($page && $page.path) {
      const layout = $page.frontmatter.layout;
      if (layout && (getLayoutAsyncComponent(layout)
          || getSyncComponent(layout))) {
        return layout;
      }
      return 'Layout';
    }
    return 'NotFound';
  };

  const layout = getLayout();
  setGlobalInfo('layout', layout);
  const Comp = getLayoutAsyncComponent(layout) || (() => <div>Error!</div>);
  return <div><Comp/></div>;
}