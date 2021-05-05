// In MdPress, we have following convention about routing:
//
//   - `/foo/` means source file is `/foo/{README|index}.md`
//   - `/foo.html` means your source file is `/foo.md`
//
// The original design of MdPress relied on above two styles
// of routing, especially the calculation involved of routes at
// default theme. so we can't easily modify `/foo.html` directly
// to `/foo` (i.e. remove html suffix)
//
// This "temporary" utility handles redirect of clean urls, with
// this utility, you'll get:
//
// For unknown request `/foo`
//   - redirect to `/foo.html` if it exists
//   - redirect to `/foo/` if it exists
//
// For unknown request `/foo/`
//   - redirect to `/foo.html` if it exists
//
// If all the above redirect rules don't exist, you'll get a 404

import { useEffect } from 'react';
import { useLocation,useHistory } from 'react-router-dom';

export function handleRedirectForCleanUrls (routes) {
  const route = useLocation();
  const history = useHistory();

  // Info:redirect /foo to /foo/
  useEffect(()=>{
    const pathname = route.pathname;
    // console.info('pathname',pathname);

    if (!isRouteExists(routes,pathname)) {
      if (!/(\/|\.html)$/.test(pathname)) {
        const endingSlashUrl = pathname + '/';
        const endingHtmlUrl = pathname + '.html';

        if (isRouteExists(routes, endingHtmlUrl)) {
          history.replace(endingHtmlUrl);
        } else if (isRouteExists(routes, endingSlashUrl)) {
          history.replace(endingSlashUrl);
        }
      } else if (/\/$/.test(pathname)) {
        const endingHtmlUrl = pathname.replace(/\/$/, '') + '.html';
        if (isRouteExists(routes, endingHtmlUrl)) {
          history.replace(endingHtmlUrl);
        }
      }
    }

  },[route.pathname]);
}

function isRouteExists (routes, path) {
  return routes.filter(route => route.path.toLowerCase() === path.toLowerCase()).length > 0;
}
