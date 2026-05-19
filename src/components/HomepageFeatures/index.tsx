/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

const FeatureList = [
  {
    id: 'develop',
    LinkUrl: '/develop/overview',
    Svg: require('@site/static/img/programmable.svg').default,
    title: (
      <Translate
        id="homepage.feature.develop.title"
        description="Title of the homepage feature card for developing Wasm applications">
        Develop Wasm applications
      </Translate>
    ),
    description: (
      <Translate
        id="homepage.feature.develop.description"
        description="Description of the homepage feature card for developing Wasm applications">
        Develop Wasm apps in Rust, JavaScript, Go, and Python. Those apps are compiled into Wasm and run inside the WasmEdge sandbox.
      </Translate>
    ),
  },
  {
    id: 'embed',
    LinkUrl: '/embed/overview',
    Svg: require('@site/static/img/WebAssembly.svg').default,
    title: (
      <Translate
        id="homepage.feature.embed.title"
        description="Title of the homepage feature card for embedding Wasm functions">
        Embed Wasm functions into a host
      </Translate>
    ),
    description: (
      <Translate
        id="homepage.feature.embed.description"
        description="Description of the homepage feature card for embedding Wasm functions">
        The host app could be written in Rust, C/C++, Go, and Java. Wasm functions are plugged in without re-compiling the host.
      </Translate>
    ),
  },
  {
    id: 'extend',
    LinkUrl: '/contribute/overview',
    Svg: require('@site/static/img/lowcode.svg').default,
    title: (
      <Translate
        id="homepage.feature.extend.title"
        description="Title of the homepage feature card for extending WasmEdge">
        Extend WasmEdge
      </Translate>
    ),
    description: (
      <Translate
        id="homepage.feature.extend.description"
        description="Description of the homepage feature card for extending WasmEdge">
        Create WasmEdge extensions and plugins in Rust and C/C++. Contribute to the WasmEdge project.
      </Translate>
    ),
  },
];

function Feature({ Svg, LinkUrl, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className={`${styles.hoverStyle} text--center padding-horiz--md`}>
        <div style={{ display: 'flex' }}>
          <Link to={LinkUrl}>
            <h3>{title}</h3>
          </Link>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((feature) => (
            <Feature key={feature.id} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
