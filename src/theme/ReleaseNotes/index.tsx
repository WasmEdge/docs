/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './styles.module.css';

export default function App(props) {
  const [releaseNotes, setReleaseNotes] = useState<any>();
  let contents: string[];

  useEffect(() => {
    // eslint-disable-next-line react/destructuring-assignment
    fetch(props.url)
      .then((response) => response.text())
      .then((result: any) => {
        // eslint-disable-next-line no-param-reassign
        result = result
          .split('## ')
          .filter((item: string | string[]) => !item.includes('# Changelog'))
          .map((version: string) => {
            let number: string;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [...contents] = version.split('\n');
            const joinedContents = contents.join('\n');
            return {
              number: number.replace('\\[', '').replace(']', ''),
              notes: joinedContents,
            };
          })
          .filter(({ number }) => !number.includes('Not Published'));
        setReleaseNotes(result);
      });
    // eslint-disable-next-line react/destructuring-assignment
  }, [props.url]);

  return (
    <BrowserOnly fallback={<div>Release notes not supported</div>}>
      {() => {
        if (!releaseNotes) {
          return <h2>Loading release notes...</h2>;
        }
        return (
          <div>
            {releaseNotes.map((version: any, index: React.Key) => (
              // eslint-disable-next-line react/no-array-index-key
              <details open={index === 0} key={index}>
                <summary className={classNames(styles.summary)}>
                  <h3>{version.number}</h3>
                </summary>
                <ReactMarkdown>{version.notes}</ReactMarkdown>
              </details>
            ))}
          </div>
        );
      }}
    </BrowserOnly>
  );
}
