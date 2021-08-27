import { useLocation,useRouteMatch } from 'react-router-dom';

export default function usePath() {
  const match = useRouteMatch('/docs/:path');
  const matchPath = match && match.params ? `/${match.params.path}` : '/';
  const location = useLocation();

  const pathIndex = location.pathname.indexOf(matchPath);
  const path = location.pathname.slice(pathIndex + 1);

  return path.replace(/\/$/,'');
}
