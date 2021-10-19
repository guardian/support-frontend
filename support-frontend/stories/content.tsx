/* eslint-disable react/no-unescaped-entities */
// @ts-ignore
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { text, withKnobs } from "@storybook/addon-knobs";
import { List, ListWithSubText } from "components/list/list";
import Tabs from "components/tabs/tabs";
import Quote from "components/quote/quote";
import BlockLabel from "components/blockLabel/blockLabel";
import InteractiveTable from "components/interactiveTable/interactiveTable";
import { headers, footer, getRows } from "pages/digital-subscription-landing/components/comparison/interactiveTableContents";
const stories = storiesOf('Content components', module).addDecorator(withKnobs({
  escapeHTML: false
}));
stories.add('List', () => <div style={{
  padding: '8px'
}}>
    <List items={[{
    content: 'This is a list'
  }, {
    content: 'You can put items in it, even if they\'re long sentences that will definitely overflow and wrap on mobile'
  }, {
    content: 'It\'s very nice'
  }]} />

    <ListWithSubText bulletColour="dark" bulletSize="small" items={[{
    content: 'This is a list',
    subText: 'With optional sub text'
  }, {
    content: 'It\'s useful in several situations',
    subText: 'Like when you want to add extra information for each list item'
  }, {
    content: 'But you don\'t have to use it'
  }]} />
  </div>);
stories.add('Tabs', () => {
  function TabsContainer() {
    const [tabs, setTabs] = useState([{
      id: 'cat',
      text: 'Cats',
      selected: true,
      content: <p>
            Cat ipsum dolor sit amet, side-eyes your "jerk" other hand while being petted. Eat a rug and furry furry
            hairs everywhere oh no human coming lie on counter don't get off counter. Meow in empty rooms i vomit
            in the bed in the middle of the night cereal boxes make for five star accommodation but sit on human they
            not getting up ever and i'm bored inside, let me out i'm lonely outside, let me in i can't make up my mind
            whether to go in or out, guess i'll just stand partway in and partway out, contemplating the universe for
            half an hour how dare you nudge me with your foot?!?!
          </p>
    }, {
      id: 'dog',
      text: 'Dogs',
      selected: false,
      content: <p>
            Doggo ipsum bork borkdrive very taste wow wow very biscit vvv, heckin angery woofer heck much ruin diet
            thicc, pupperino yapper shooberino. Sub woofer he made many woofs boof puggo porgo boof sub woofer, shoob
            borking doggo doge such treat. You are doin me a concern what a nice floof shoob very taste wow, borking
            doggo heckin good boys and girls. Big ol porgo what a nice floof h*ck I am bekom fat very good spot,
            maximum borkdrive pupper blep. Heckin I am bekom fat thicc wow very biscit most angery pupper I have ever
            seen, heckin good boys lotsa pats snoot. Maximum borkdrive very jealous pupper he made many woofs porgo
            pats, lotsa pats dat tungg tho.
          </p>
    }]);

    function onTabChange(tabId: string) {
      setTabs(tabs.map(tab => {
        if (tab.id === tabId) {
          return { ...tab,
            selected: true
          };
        }

        return { ...tab,
          selected: false
        };
      }));
    }

    return <div style={{
      padding: '48px'
    }}>
        <Tabs tabsLabel="Pets" tabElement="button" tabs={tabs} onTabChange={onTabChange} />
      </div>;
  }

  return <TabsContainer />;
});
stories.add('Quote', () => {
  const name = text('Name', 'Katharine Viner');
  const jobTitle = text('Job title', 'Editor-in-chief');
  const quote = text('Quote', 'The Subscriptions team is my favourite team');
  return <div style={{
    padding: '8px',
    maxWidth: '400px'
  }}>
      <Quote name={name} jobTitle={jobTitle} headshot={<img src="https://media.guim.co.uk/1e8cd6f3fc9af8ba9f84a4f70acc381ca9bf0fb3/0_0_315_315/140.png" alt="" />}>
        {quote}
      </Quote>
    </div>;
});
stories.add('Block label', () => <BlockLabel>Use this for stand-out labels on other content</BlockLabel>);
stories.add('Interactive table', () => <div style={{
  maxWidth: '940px',
  margin: '0 auto',
  backgroundColor: '#DCDCDC'
}}>
    <InteractiveTable caption={<>What&apos;s included in a paid digital subscription</>} headers={headers} rows={getRows('GBPCountries')} footer={footer} />
  </div>);