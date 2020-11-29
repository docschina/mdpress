import React from 'react';
import useData from '@app/hooks/data';
import OutboundLink from '@app/components/OutboundLink';
import isNil from 'lodash/isNil';
import { endingSlashRE, outboundRE } from '../util';
import '../styles/page-edit.styl';

export default function PageEdit() {
  const { $page,$site,$themeLocaleConfig } = useData();

  const createEditLink = (repo, docsRepo, docsDir, docsBranch, path) => {
    const bitbucket = /bitbucket.org/;
    if (bitbucket.test(docsRepo)) {
      const base = docsRepo;
      return (
        base.replace(endingSlashRE, '')
          + '/src'
          + `/${docsBranch}/`
          + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
          + path
          + `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
      );
    }

    const gitlab = /gitlab.com/;
    if (gitlab.test(docsRepo)) {
      const base = docsRepo;
      return (
        base.replace(endingSlashRE, '')
              + '/-/edit'
              + `/${docsBranch}/`
              + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
              + path
      );
    }

    const base = outboundRE.test(docsRepo)
      ? docsRepo
      : `https://github.com/${docsRepo}`;
    return (
      base.replace(endingSlashRE, '')
        + '/edit'
        + `/${docsBranch}/`
        + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
        + path
    );
  };

  const lastUpdated = $page.lastUpdated;

  const lastUpdatedText = (() => {
    if (typeof $themeLocaleConfig.lastUpdated === 'string') {
      return $themeLocaleConfig.lastUpdated;
    }
    if (typeof $site.themeConfig.lastUpdated === 'string') {
      return $site.themeConfig.lastUpdated;
    }
    return 'Last Updated';
  })();

  const editLink = (()=>{
    const showEditLink = isNil($page.frontmatter.editLink)
      ? $site.themeConfig.editLinks
      : $page.frontmatter.editLink;

    const {
      repo,
      docsDir = '',
      docsBranch = 'master',
      docsRepo = repo
    } = $site.themeConfig;

    if (showEditLink && docsRepo && $page.relativePath) {
      return createEditLink(
        repo,
        docsRepo,
        docsDir,
        docsBranch,
        $page.relativePath
      );
    }
    return null;
  })();

  const editLinkText = (
    $themeLocaleConfig.editLinkText ||
      $site.themeConfig.editLinkText ||
      'Edit this page'
  );
  return     <footer className={'page-edit'}>
    {editLink &&
    <div className="edit-link">
      <a href={editLink}
        target="_blank"
        rel="noopener noreferrer"
      >{ editLinkText }</a>
      <OutboundLink/>
    </div>
    }

    {lastUpdated && <div className={'last-updated'}>
      <span className="prefix">{lastUpdatedText}: </span>
      <span className="time">{lastUpdated}</span>
    </div>}
  </footer>;
}
