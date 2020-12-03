import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/index.styl';
const msgs = [
  'There\'s nothing here.',
  'How did we get here?',
  'That\'s a Four-Oh-Four.',
  'Looks like we\'ve got some broken links.'
];

export default function NotFound() {
  const getMsg = () => {
    return msgs[Math.floor(Math.random() * msgs.length)];
  };
  return <div className="theme-container">
    <div className="theme-default-content">
      <h1>404</h1>
      <blockquote>{getMsg()}</blockquote>

      <Link to="/">
        Take me home.
      </Link>
    </div>
  </div>;
}