import React from 'react';
import NavLink from './NavLink';
import useData from '@app/hooks/data';
import Content from '@app/components/Content';
import '../styles/home.styl';

export default function Home() {
  const { $page,$withBase,$title,$description } = useData();
  const data = $page.frontmatter;
  const actionLink = {
    link: data.actionLink,
    text: data.actionText
  };

  return <main className="home"  aria-labelledby={data.heroText !== null ? 'main-title' : null}>
    <header className="hero">
      {data.heroImage && <img src={$withBase(data.heroImage)} alt={data.heroAlt || 'hero'}/>}

      {data.heroText !== null &&
        <h1 id="main-title">{data.heroText || $title || 'Hello'}</h1>
      }

      {data.tagline !== null &&
        <p className="description">
          {data.tagline || $description || 'Welcome to your site'}
        </p>
      }

      {data.actionText && data.actionLink &&
      <p className="action">
        <NavLink className={'action-button'} item={actionLink}></NavLink>
      </p>
      }
    </header>

    {data.features && data.features.length &&
    <div className="features">
      { data.features.map((feature,index) => {
        return <div key={index} className="feature">
          <h2>{feature.title}</h2>
          <p>{feature.details}</p>
        </div>;
      })}
    </div>
    }

    <Content className="theme-default-content custom"/>

    {data.footer && <div className="footer">{data.footer}</div>}

  </main>;
}