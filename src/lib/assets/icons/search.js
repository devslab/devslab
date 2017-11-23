import React from "react"

const Search = props => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 15 15"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <desc>Created using Figma</desc>
    <use xlinkHref="#asearch" transform="rotate(-45 7.95 4.707)" fill="#BDBDBD" />
    <use xlinkHref="#bsearch" transform="translate(11 11.002)" fill="#BDBDBD" />
    <defs>
      <path
        id="asearch"
        d="M10.814 5.657a5.157 5.157 0 0 1-5.157 5.157v1c3.4 0 6.157-2.757 6.157-6.157h-1zm-5.157 5.157A5.157 5.157 0 0 1 .5 5.657h-1c0 3.4 2.757 6.157 6.157 6.157v-1zM.5 5.657A5.157 5.157 0 0 1 5.657.5v-1A6.157 6.157 0 0 0-.5 5.657h1zM5.657.5a5.157 5.157 0 0 1 5.157 5.157h1c0-3.4-2.757-6.157-6.157-6.157v1z"
      />
      <path
        id="bsearch"
        d="M2.846 3.553a.5.5 0 1 0 .707-.707l-.707.707zM.354-.354a.5.5 0 1 0-.708.708l.708-.708zm3.2 3.2l-3.2-3.2-.708.708 3.2 3.2.707-.708z"
      />
    </defs>
  </svg>
)

export default Search
