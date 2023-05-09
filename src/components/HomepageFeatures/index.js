import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from "@docusaurus/Link";

const FeatureList = [
    {
        title: 'Develop Wasm applications',
        LinkUrl: '/develop/overview',
        Svg: require('@site/static/img/programmable.svg').default,
        description: (
            <>
                Develop Wasm apps in Rust, JavaScript, Go, and Python. Those apps are compiled into Wasm and run inside the WasmEdge sandbox.
            </>
        ),
    },
    {
        title: 'Embed Wasm functions into a host',
        LinkUrl: '/embed/overview',
        Svg: require('@site/static/img/WebAssembly.svg').default,
        description: (
            <>
                The host app could be written in Rust, C/C++, Go, and Java. Wasm functions are plugged in without re-compiling the host.
            </>
        ),
    },
    {
        title: 'Extend WasmEdge',
        LinkUrl: '/contribute/overview',
        Svg: require('@site/static/img/lowcode.svg').default,
        description: (
            <>
                Create WasmEdge extensions and plugins in Rust and C/C++. Contribute to the WasmEdge project.
            </>
        ),
    },
];
function Feature({ Svg, LinkSvg, LinkUrl, title, description }) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img" />
            </div>
            <div className={`${styles.hoverStyle} text--center padding-horiz--md`}>
                <Link to={LinkUrl}>
                    <div style={{ display: "flex" }}>
                        <h3>{title}</h3>
                        <LinkSvg className={styles.linkSvg} role="img" />
                    </div>
                </Link>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures() {
    const LinkSvg = require('@site/static/img/Click.svg').default
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} LinkSvg={LinkSvg} />
                    ))}
                </div>
            </div>
        </section>
    );
}
