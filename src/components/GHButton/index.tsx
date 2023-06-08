/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import GitHubButton from 'react-github-btn';

interface IProps {
    type: 'Star' | string;
    children?: typeof React.Children;
    href?: URL;
}

// For GitHub button on the homepage
function GHButton(props: IProps) {
    const { type } = props;
    return type === 'Star' ? (
        <GitHubButton
            href="https://github.com/WasmEdge/WasmEdge"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star WasmEdge on GitHub"
            data-color-scheme="no-preference: dark; light: dark; dark: dark;">
            Star
        </GitHubButton>
    ) : (
        <GitHubButton
            href="https://github.com/WasmEdge"
            data-color-scheme="no-preference: dark; light: dark; dark: dark;"
            data-size="large"
            data-show-count="true"
            aria-label="Follow @WasmEdge">
            Follow @WasmEdge
        </GitHubButton>
    );
}

export default GHButton;
