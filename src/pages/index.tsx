import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import GHButton from '../components/GHButton';

// Homepage Header Content
function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">
          <Translate
            id="homepage.hero.title"
            description="Homepage hero title (also used as the site title)">
            WasmEdge Developer Guides
          </Translate>
        </h1>
        <p className="hero__subtitle">
          <Translate
            id="homepage.hero.tagline"
            description="Homepage hero subtitle / site tagline">
            Serverless functions anywhere in the cloud, in data / AI pipelines, in SaaS platforms, and on edge devices.
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/start/overview">
            <Translate
              id="homepage.cta.getStarted"
              description="Call-to-action button leading to the Getting Started overview">
              {'Getting Started with WasmEdge in 5min ⏱️'}
            </Translate>
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
  return (
    <Layout
      title={translate({
        id: 'homepage.layout.title',
        message: 'Hello from WasmEdge Developer Guides',
        description: 'Browser tab / HTML <title> for the homepage',
      })}
      description={translate({
        id: 'homepage.layout.description',
        message: 'WasmEdge Developer Guides',
        description: 'HTML meta description for the homepage',
      })}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <div className={clsx('homepageCNCFLogo', styles.homepageCNCFLogo)}>
        <h2 className="hero_subtitle">
          <Translate
            id="homepage.cncf.text"
            description="Sentence on the homepage noting WasmEdge is a CNCF sandbox project. {cncfLink} is replaced with a linked CNCF text."
            values={{
              cncfLink: (
                <a href="https://cncf.io/">
                  <Translate
                    id="homepage.cncf.linkText"
                    description="Linked text inside the CNCF sandbox sentence">
                    CNCF (Cloud Native Computing Foundation)
                  </Translate>
                </a>
              ),
            }}>
            {'WasmEdge is a {cncfLink} sandbox project'}
          </Translate>
        </h2>
        <div className={clsx('cncf-logo', styles.cncfLogo)} />
        <br />
      </div>
    </Layout>
  );
}
