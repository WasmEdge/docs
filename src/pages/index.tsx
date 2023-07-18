import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import GHButton from '../components/GHButton';

// Homepage Header Content
function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/start/overview">
            Getting Started with WasmEdge in 5min ⏱️
          </Link>
        </div>
        <br />
        <GHButton type="Star" />
      </div>
    </header>
  );
}

// To render the default home page
export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="WasmEdge Developer Guides">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <div className={clsx('homepageCNCFLogo', styles.homepageCNCFLogo)}>
        <h2 className="hero_subtitle">
          WasmEdge is a{' '}
          <a href="https://cncf.io/">
            CNCF (Cloud Native Computing Foundation)
          </a>{' '}
          sandbox project
        </h2>
        <div className={clsx('cncf-logo', styles.cncfLogo)} />
        <br />
      </div>
    </Layout>
  );
}
