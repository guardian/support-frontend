import React from "react";
import { storiesOf } from "@storybook/react";
import Header from "components/headers/header/header";
import { GBPCountries } from "helpers/internationalisation/countryGroup";
const stories = storiesOf('Header', module);
stories.add('Header (navigation)', () => <Header display="navigation" countryGroupId={GBPCountries} />);
stories.add('Header (checkout)', () => <Header display="checkout" countryGroupId={GBPCountries} />);