// This is a test mock for any instances where we're importing an image file inside
// a JS or JSX file, to prevent Jest/babel-jest from trying to parse SVG as JSX or do other silly things
module.exports = 'div';