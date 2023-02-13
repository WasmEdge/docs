import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from "@docusaurus/Link";

const FeatureList = [
    {
        title: 'Develop Wasm applications',
        LinkUrl: '/docs/develop/overview',
        Svg: require('@site/static/img/programmable.svg').default,
        description: (
            <>
                Develop Wasm applications from Rust, JavaScript, C++ and Tinygo.
            </>
        ),
    },
    {
        title: 'Embed WasmEdge into a host app',
        LinkUrl: '/docs/embed/overview',
        Svg: require('@site/static/img/WebAssembly.svg').default,
        description: (
            <>
                Embed WasmEdge into a host app using WasmEdge Rust SDK, C SDK, Go SDK, and Java SDK.
            </>
        ),
    },
    {
        title: 'Contribute to WasmEdge',
        LinkUrl: '/docs/contribute/overview',
        Svg: require('@site/static/img/lowcode.svg').default,
        description: (
            <>
                Becoming a contributor to WasmEdge.
            </>
        ),
    },
];
function Feature({Svg, LinkSvg, LinkUrl, title, description}) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img"/>
            </div>
            <div className={`${styles.hoverStyle} text--center padding-horiz--md`}>
                <div style={{display: "flex"}}>
                    <h3>{title}</h3>
                        <Link to={LinkUrl}>
                            <LinkSvg className={styles.linkSvg} role="img"/>
                        </Link>
                </div>
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
                        <Feature key={idx} {...props} LinkSvg={LinkSvg}/>
                    ))}
                </div>
            </div>
        </section>
    );
}
