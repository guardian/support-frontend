// ----- Imports ----- //
import React from "react";
// ----- Types ----- //
type ContributionFormBlurbProps = {
  headerCopy: string | React.ReactNode;
  bodyCopy: string | React.ReactNode;
};
// ----- Component ----- //
export function ContributionFormBlurb({
  headerCopy,
  bodyCopy
}: ContributionFormBlurbProps) {
  return <div className="gu-content__blurb">
      <div className="gu-content__blurb-header-container">
        <h1 className="gu-content__blurb-header">{headerCopy}</h1>
      </div>

      <p className="gu-content__blurb-blurb">{bodyCopy}</p>
    </div>;
}