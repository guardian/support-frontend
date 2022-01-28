/* eslint-disable react/no-multi-comp */
import React from "react";
import { storiesOf } from "@storybook/react";
import Dialog from "components/dialog/dialog";
import Button from "components/button/button";
import Text from "components/text/text";
import { withCenterAlignment } from "../.storybook/decorators/withCenterAlignment";
import WithState from "../.storybook/util/withState";
import Menu, { ButtonItem } from "components/menu/menu";

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

const inlineDialogStyle = (bounds) => ({
  top: bounds.top,
  left: bounds.left,
  position: "absolute",
});

// Actual dialog code
const stories = storiesOf("Dialogs", module).addDecorator(withCenterAlignment);
stories.add("Styled dialog", () => (
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
stories.add("Unstyled dialog", () => (
  <div
    style={{
      maxWidth: "30em",
    }}
  >
    <Text title="This is an unstyled dialog example">
      <p>You can make it look like anything.</p>
      <WithState
        initialState={{
          open: false,
          bounds: {
            top: 0,
            left: 0,
          },
        }}
        refs={[null]}
      >
        {(state, setState, refs) => (
          <div>
            <OpenButton
              getRef={(r) => {
                refs[0] = r;
              }} // eslint-disable-line no-param-reassign
              onClick={() => {
                setState({
                  open: true,
                });

                if (refs[0]) {
                  setState({
                    bounds: refs[0].getBoundingClientRect(),
                  });
                }
              }}
            />
            <Dialog
              aria-label="Modal dialog"
              closeDialog={() => {
                setState({
                  open: false
                });
              }}
              open={state.open}
              blocking={false} // this lets you click outside to close
              styled={false}
            >
              <Menu style={inlineDialogStyle(state.bounds)}>
                <ButtonItem>This could be a dropdown menu</ButtonItem>
                <ButtonItem>Click outside to close</ButtonItem>
                <ButtonItem>
                  BUT! you still need a close button for keyboard + srd users
                  even if its visibly hidden
                </ButtonItem>
                <ButtonItem
                  onClick={() => {
                    setState({
                      open: false,
                    });
                  }}
                >
                  Close
                </ButtonItem>
              </Menu>
            </Dialog>
            ;
          </div>
        )}
      </WithState>
    </Text>
  </div>
));
