import React from "react";
import { storiesOf } from "@storybook/react";
import Text, { Title, Callout, LargeParagraph, SansParagraph } from "components/text/text";
import { withCenterAlignment } from "../.storybook/decorators/withCenterAlignment";
const stories = storiesOf('Type', module).addDecorator(withCenterAlignment);
stories.add('Text', () => <div style={{
  maxWidth: '30em'
}}>
    <Text title="If you have to show text, wrap it in <Text>">
      <LargeParagraph>Easy, right?</LargeParagraph>
      <p>
        For your convenience you
        can add a heading right at the top but you can also use
        the <code>Title</code> export. up to you!
      </p>
      <SansParagraph>
        <code>Text</code> will format some stuff like links
        for you and you can nest it inside a wrapper.
      </SansParagraph>
      <Callout>It also exports just about everything you can put in it</Callout>
      <Title size={3}>Even more titles!</Title>
    </Text>
  </div>);