export default (md) => {
  const defaultImgRender = md.renderer.rules.image;

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    let src = token.attrGet('src');

    if (window.__MDPRESS__ && window.__MDPRESS__.base) {
      src = withBase(window.__MDPRESS__.base,src);
    }
    token.attrSet('src', src);

    return defaultImgRender(tokens, idx, options, env, self);
  };

  return md;
};

function withBase(base,path) {
  if (!base) return path;
  if (path.charAt(0) === '/') {
    return base + path.slice(1);
  } else {
    return path;
  }
}