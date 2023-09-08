/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const FeatureList = [
    {
        id: 0,
        title: 'Develop Wasm applications',
        LinkUrl: '/develop/overview',
        Svg: require('@site/static/img/programmable.svg').default,
        description: (
            <>
                Develop Wasm apps in Rust, JavaScript, Go, and Python. Those apps are
                compiled into Wasm and run inside the WasmEdge sandbox.
            </>
        ),
    },
    {
        id: 1,
        title: 'Embed Wasm functions into a host',
        LinkUrl: '/embed/overview',
        Svg: require('@site/static/img/WebAssembly.svg').default,
        description: (
            <>
                The host app could be written in Rust, C/C++, Go, and Java. Wasm
                functions are plugged in without re-compiling the host.
            </>
        ),
    },
    {
        id: 2,
        title: 'Extend WasmEdge',
        LinkUrl: '/contribute/overview',
        Svg: require('@site/static/img/lowcode.svg').default,
        description: (
            <>
                Create WasmEdge extensions and plugins in Rust and C/C++. Contribute to
                the WasmEdge project.
            </>
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
