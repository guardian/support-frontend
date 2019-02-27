// @flow
import React from 'react';
import Button from 'components/button/button';
import { Input } from 'components/forms/standardFields/input';
import { Label } from 'components/forms/standardFields/label';

// ----- Component ----- //

const PostcodeFinder = ({ id }: { id: string }) => (
  <div>
    <Label label="Postcode" htmlFor={id}>
      <Input id={id} name="postcode" />
      <Button aria-label={null}>find it</Button>
    </Label>
  </div>
);

// ----- Exports ----- //

export default PostcodeFinder;
