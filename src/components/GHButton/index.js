import React from 'react';
import GitHubButton from 'react-github-btn';

// eslint-disable-next-line no-unused-vars
function GHButton({ type, children, href }) {
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
