// @flow
import React from 'react';
import type { Node } from 'react';

type PropTypes = {|
  labelChildren: Node,
  hintChildren?: Node,
  inputChildren: Node,
  error: boolean,
|}

export const guardianTextSansWeb = '\'Guardian Text Sans Web\', \'Helvetica Neue\', Helvetica, Arial, \'Lucida Grande\', sans-serif';

export function StripeCardFormField(props: PropTypes) {
  return (
    <>
      <div
        css={{
          fontSize: '17px',
          fontWeight: 700,
          lineHeight: 1.5,
          fontFamily: guardianTextSansWeb,
          marginBottom: '4px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {props.labelChildren}
      </div>
      {props.hintChildren || null}
      <div
        css={{
          border: props.error ? '4px solid #C70000': '2px solid #999999',
          height: '34px',
          padding: '10px 8px 0px 8px',
        }}
      >
        {props.inputChildren}
      </div>
    </>
  )
}
