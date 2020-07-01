import React from 'react'
import { motion } from 'framer-motion';

type PropTypes = {|onClick: function|};

export const CloseButton = (props: PropTypes) => {
  const brightness7 = '#121212'
  const brightness86 = '#dcdcdc'
  const brightness100 = '#ffffff'

  const rectVariants = {
    hover: { fill: brightness86 }
  }

  return (
    <motion.svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="close-button"
      onClick={props.onClick}
      whileHover={'hover'}
    >
      <motion.rect
        x="0.5"
        y="0.5"
        width="43"
        height="43"
        rx="21.5"
        stroke={brightness7}
        fill={brightness100}
        variants={rectVariants}
      />
      <motion.path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.325 24.025L29.5499 30.6499L30.6249 29.5749L24.025 22.325L30.6249 15.075L29.5499 14L22.325 20.625L15.075 14.025L14 15.1L20.625 22.325L14 29.5499L15.075 30.6249L22.325 24.025Z"
        fill={brightness7}
      />
    </motion.svg>
  )
}
