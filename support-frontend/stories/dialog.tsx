import React from "react";
import { storiesOf } from "@storybook/react";
import Dialog from "../assets/components/dialog/dialog";
import Button from "../assets/components/button/button";
import Text from "../assets/components/text/text";
import { withCenterAlignment } from "../.storybook/decorators/withCenterAlignment";
import WithState from "../.storybook/util/withState";

// Teeny helpers
const GreyButton = (props) => (
  <Button icon={null} appearance="greyHollow" {...props} />
);

const OpenButton = (props) => (
  <GreyButton aria-haspopup="dialog" {...props}>
    Open it up
  </GreyButton>
);

const dialogStyle = {
  padding: "1em",
  background: "#121212",
  color: "#fff",
};

// Actual dialog code
const stories = storiesOf("Dialogs", module).addDecorator(withCenterAlignment);

stories.add("Dialog", () => (
  <div
    style={{
      maxWidth: "30em",
    }}
  >
    <Text title="This is an styled dialog example">
      <p>It pops up in the middle of the screen</p>
      <WithState
        initialState={{
          open: false,
        }}
      >
        {(state, setState) => (
          <div>
            <OpenButton
              onClick={() => {
                setState({
                  open: true,
                });
              }}
            />
            <Dialog
              aria-label="Modal dialog"
              closeDialog={() => {
                setState({
                  open: false,
                });
              }}
              open={state.open}
              styled
            >
              <div style={dialogStyle}>
                <Text title={"I'm a dialog!"}>
                  I don&#39;t do much on my own{" "}
                  <span role="img" aria-label="sadface">
                    ☹️
                  </span>
                  .
                </Text>
                <GreyButton
                  appearance="primary"
                  onClick={() => {
                    setState({
                      open: false,
                    });
                  }}
                >
                  Close
                </GreyButton>
              </div>
            </Dialog>
          </div>
        )}
      </WithState>
    </Text>
  </div>
));
