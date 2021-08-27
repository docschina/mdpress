export function genAnchors(dom) {
  if (!dom || !dom.children) return [];
  const children = Array.from(dom.children);
  const tree = children.reduce((res,child) => {
    let nodeName = child.nodeName.toLowerCase();
    if (nodeName.match(/h[1-6]/)) {
      return res.concat([{
        name: child.innerText.replace(/^#[\n\s]/,''),
        tag: child.nodeName,
        level: +nodeName.replace('h',''),
        id: child.id
      }]);
    }

    return res;

  },[]);

  return format(tree);
}

function format(treeArray) {
  let result = [];
  treeArray.forEach(function (item) {
    if (!result.length) {
      result.push(item);
      return;
    }
    let prevItem = last(result);
    let level = item.level;
    let prevLevel = prevItem.level;
    // 比较级别大小
    let isSmall = level > prevLevel;
    if (isSmall) {
      for (let i = prevLevel + 1; i <= 3; i++) {
        let children = prevItem.children;
        if (!children) {
          prevItem.children = [item];
          break;
        }
        // 重置 lastItem 为 children 的最后一个 item
        prevItem = last(children);
        // item level 小于或等于 lastItem level 都视为与 children 同级
        if (item.level <= prevItem.level) {
          children.push(item);
          break;
        }
      }
    }
    else {
      result.push(item);
    }
  });
  return result;
}

function last(array) {
  return array[array.length - 1];
}
