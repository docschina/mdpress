/* global TENCENT_CLOUD_ENV,CMS_DOCUMENT,CMS_SIDEBAR */

let db = {};
if (typeof window !== 'undefined') {
  const cloudbase = require('@cloudbase/js-sdk').default;

  const config = {
    env: TENCENT_CLOUD_ENV // 前往「腾讯云控制台」-「云开发 CloudBase」获取
  };
  const app = cloudbase.init(config);
  db = app.database();
}


/**
 * 获取云数据库数据
 */
export async function getDocData(path) {
  try {
    const result = await db.collection(CMS_DOCUMENT).where({
      path
    }).get();
    if (result.code) {
      throw new Error(
        `获取「文档」失败, 错误码是${result.code}: ${result.message}`
      );
    }
    return result.data.map(item => {
      if (item.createTime instanceof Date) {
        item.createTime = item.createTime.toLocaleString();
      }
      if (item.updateTime instanceof Date) {
        item.updateTime = item.updateTime.toLocaleString();
      }
      // item.cover = getBucketUrl(item.cover); // 处理云存储的特殊链接
      return item;
    });
  } catch (e) {
    return;
  }
}

const _ = db.command;
export async function getSidebarData(page) {
  try {
    const result = await db.collection(CMS_SIDEBAR)
      .where({
        pages: _.in([page])
      })
      .get();
    if (result.code) {
      throw new Error(
        `获取「侧边栏」失败, 错误码是${result.code}: ${result.message}`
      );
    }
    return result.data[0].value;
  } catch (e) {
    return;
  }
}