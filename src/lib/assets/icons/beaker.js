import React from 'react'
import PropTypes from 'prop-types'

const Beaker = (props) => {
  const svgProps = Object.assign({}, props)
  delete svgProps.lightColor

  return (
    <svg
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={24}
      height={42}
      viewBox="0 0 24 42"
      {...svgProps}
    >
      <title>Canvas.svg</title>
      <desc>Created using Figma</desc>
      <path
        d="M23 37.737L21.35 41H2.803L1 37.578l8.8-10.72v-8.701h4.4v8.702L23 37.737zM7.6 17.069l1.1 1.088h6.6l1.1-1.088-1.1-1.088H8.7L7.6 17.07z"
        fill="#fff"
        fillRule="evenodd"
      />
      <path
        d="M5.557 32.813l12.9.093 4.31 6.53L21.35 41H2.803L.907 39.129z"
        fill={props.lightColor}
        fillRule="evenodd"
      />
      <path
        d="M23 39.528l.41-.285a.5.5 0 0 1-.077.658L23 39.529zM21.35 41l.333.373a.5.5 0 0 1-.333.127V41zM2.803 41v.5a.5.5 0 0 1-.335-.13l.335-.37zM1 39.37l-.335.37a.5.5 0 0 1-.074-.658L1 39.37zm8.8-12.511h.5a.502.502 0 0 1-.091.288l-.409-.288zm0-8.702h-.5a.5.5 0 0 1 .5-.5v.5zm4.4 0v-.5a.5.5 0 0 1 .5.5h-.5zm0 8.702l-.41.285a.5.5 0 0 1-.09-.285h.5zm9.133 13.043l-1.65 1.471-.666-.746 1.65-1.472.666.746zM21.35 41.5H2.803v-1H21.35v1zm-18.882-.13L.665 39.74l.67-.741 1.803 1.63-.67.742zM.59 39.083l8.8-12.51.818.575-8.8 12.51-.818-.575zM9.3 26.859v-8.702h1v8.702h-1zm.5-9.202h4.4v1H9.8v-1zm4.9.5v8.702h-1v-8.702h1zm-.089 8.417l8.8 12.67-.821.57-8.8-12.67.821-.57z"
        fill="currentColor"
      />
      <path
        d="M7.6 17.069l-.352.355a.5.5 0 0 1 0-.71l.352.355zm1.1 1.088v.5a.5.5 0 0 1-.352-.145l.352-.355zm6.6 0l.352.355a.5.5 0 0 1-.352.145v-.5zm1.1-1.088l.352-.356a.5.5 0 0 1 0 .711l-.352-.355zm-1.1-1.088v-.5a.5.5 0 0 1 .352.145l-.352.355zm-6.6 0l-.352-.355a.5.5 0 0 1 .352-.145v.5zm-.748.732l1.1 1.088-.704.711-1.1-1.088.704-.71zm.748.944h6.6v1H8.7v-1zm6.248.144l1.1-1.088.704.711-1.1 1.088-.704-.71zm1.1-.377l-1.1-1.087.704-.711 1.1 1.087-.704.711zm-.748-.943H8.7v-1h6.6v1zm-6.248-.144l-1.1 1.087-.704-.71 1.1-1.088.704.71zM9.8 20.832a.5.5 0 0 1 0-1v1zm2.2-1a.5.5 0 0 1 0 1v-1zm-2.2 0H12v1H9.8v-1zM9.8 23.008a.5.5 0 0 1 0-1v1zm2.2-1a.5.5 0 0 1 0 1v-1zm-2.2 0H12v1H9.8v-1z"
        fill="currentColor"
      />
      <g>
        <path d="M13.47 35.613h4.4v-1h-4.4v1z" fill="currentColor" />
        <path d="M15.17 32.906v4.415h1v-4.415h-1z" fill="currentColor" />
      </g>
      <g>
        <path d="M12 12.066h4.4v-1H12v1z" fill="currentColor" />
        <path d="M13.7 9.358v4.416h1V9.358h-1z" fill="currentColor" />
      </g>
      <g>
        <path d="M7.6 37.82H12v-1H7.6v1z" fill="currentColor" />
        <path d="M9.3 35.113v4.415h1v-4.415h-1z" fill="currentColor" />
      </g>
      <g transform="translate(-2029 -8)">
        <path
          d="M2038.8 18.83c0 1.22-.985 2.208-2.2 2.208-1.215 0-2.2-.989-2.2-2.208 0-1.219.985-2.207 2.2-2.207 1.215 0 2.2.988 2.2 2.207z"
          fill="#fff"
        />
        <mask id="bbeaker">
          <use
            xlinkHref="#abeaker"
            transform="translate(2034.4 16.623)"
            width="100%"
            height="100%"
            fill="#fff"
          />
        </mask>
        <g mask="url(#bbeaker)">
          <use
            xlinkHref="#cbeaker"
            transform="translate(2034.4 16.623)"
            width="100%"
            height="100%"
            fill="currentColor"
          />
        </g>
      </g>
      <g transform="translate(-2029 -8)">
        <path
          d="M2043.93 12.208c0 1.219-.985 2.207-2.2 2.207-1.215 0-2.2-.988-2.2-2.207 0-1.22.985-2.208 2.2-2.208 1.215 0 2.2.988 2.2 2.208z"
          fill="#fff"
        />
        <mask id="dbeaker">
          <use
            xlinkHref="#abeaker"
            transform="translate(2039.53 10)"
            width="100%"
            height="100%"
            fill="#fff"
          />
        </mask>
        <g mask="url(#dbeaker)">
          <use
            xlinkHref="#cbeaker"
            transform="translate(2039.53 10)"
            width="100%"
            height="100%"
            fill="currentColor"
          />
        </g>
      </g>
      <defs>
        <path
          id="kbeaker"
          d="M4.805 14.575c-1.982-.116-3.542-1.15-4.534-2.13l1.26-2.947c.541.577 3.124 2.019 4.896 1.702.48-.087 1.021-.49 1.021-1.096.03-.404-.33-.78-.63-.924-.301-.201-1.232-.23-1.833-.26-.69-.028-1.471-.115-2.312-.432C1.14 7.767.06 6.267 0 4.681c0-1.875.78-2.914 1.592-3.548C3.213-.08 5.466-.194 7.028.209c1.23.289 1.625.574 2.436 1.324L8.409 4.594c-.3-.202-1.712-.837-2.252-.98-.841-.232-1.892-.116-2.373.172-.15.087-.36.404-.3.808 0 .288.27.692.48.808.42.202.811.317 1.382.346.78 0 2.102 0 3.093.461 1.652.866 2.613 2.337 2.493 4.039-.09 1.47-1.141 2.913-2.523 3.605-1.051.577-2.433.808-3.604.722z"
        />
        <path
          id="ebeaker"
          d="M11.833 0v8.51a7.88 7.88 0 0 0-4.235-1.24C3.424 7.27 0 10.556 0 14.595c0 4.01 3.424 7.298 7.598 7.298a7.88 7.88 0 0 0 4.235-1.24v1.067h3.634V0h-3.634zM7.598 18.404c-2.192 0-3.964-1.731-3.964-3.808 0-2.106 1.772-3.808 3.964-3.808 2.193 0 3.965 1.702 3.965 3.808 0 2.077-1.772 3.808-3.965 3.808z"
        />
        <path
          id="jbeaker"
          d="M14.716 8.365C15.526 4.125 12.253 0 7.508 0 3.364 0 0 3.23 0 7.211c0 3.981 3.364 7.212 7.508 7.212 2.343 0 5.045-.952 6.457-2.683l-2.433-2.077c-.9.923-2.282 1.414-3.934 1.356-1.772-.058-3.273-.98-3.784-2.654h10.902zM3.874 5.77c.48-1.356 2.012-2.48 3.634-2.48 1.652 0 3.183 1.124 3.634 2.48H3.874z"
        />
        <path
          id="ibeaker"
          d="M9.61 14.452H6.307L0 .029h3.874L7.99 9.692 12.043 0l3.934.029L9.61 14.452z"
        />
        <path
          id="hbeaker"
          d="M4.115 18.404a.49.49 0 0 1-.48-.49c0-.087-.03-.174-.03-.26 0-.087.03-.174.03-.26V1.73C3.635.779 2.824 0 1.803 0 .812 0 0 .779 0 1.73v14.856c0 1.356-.06 2.625.84 3.75a4.31 4.31 0 0 0 3.274 1.558c1.021 0 1.832-.779 1.832-1.76 0-.952-.81-1.73-1.832-1.73z"
        />
        <path
          id="gbeaker"
          d="M13.454 0c-.99 0-1.591.75-1.591 1.644v.144C10.57.778 9.07.115 7.268.115 3.244.115 0 3.26 0 7.096s3.244 6.952 7.268 6.952c1.802 0 3.303-.635 4.595-1.702v.346c0 .894.6 1.644 1.592 1.644.99 0 1.741-.75 1.741-1.644V1.644C15.196.75 14.446 0 13.454 0zM7.268 10.673c-2.072 0-3.784-1.587-3.784-3.577S5.196 3.49 7.268 3.49c2.042 0 3.754 1.616 3.754 3.606 0 1.99-1.712 3.577-3.754 3.577z"
        />
        <path
          id="fbeaker"
          d="M7.868 7.298c-1.561 0-3.003.461-4.234 1.211V1.76C3.634.809 2.823 0 1.832 0 .811 0 0 .808 0 1.76v18.345c0 .952.81 1.731 1.832 1.731.81 0 1.502-.52 1.742-1.211 1.201.807 2.703 1.269 4.294 1.269 4.175 0 7.599-3.26 7.599-7.298 0-4.039-3.424-7.298-7.599-7.298zm0 11.105c-2.192 0-3.964-1.701-3.964-3.807s1.772-3.808 3.964-3.808c2.163 0 3.965 1.702 3.965 3.808s-1.802 3.808-3.965 3.808z"
        />
        <path
          id="abeaker"
          d="M4.4 2.208c0 1.219-.985 2.207-2.2 2.207-1.215 0-2.2-.988-2.2-2.207C0 .988.985 0 2.2 0c1.215 0 2.2.988 2.2 2.208z"
        />
        <path
          id="cbeaker"
          d="M3.4 2.208c0 .67-.54 1.207-1.2 1.207v2c1.77 0 3.2-1.44 3.2-3.207h-2zM2.2 3.415c-.66 0-1.2-.537-1.2-1.207h-2a3.204 3.204 0 0 0 3.2 3.207v-2zM1 2.208C1 1.538 1.54 1 2.2 1v-2C.43-1-1 .44-1 2.208h2zM2.2 1c.66 0 1.2.537 1.2 1.208h2A3.204 3.204 0 0 0 2.2-1v2z"
        />
      </defs>
    </svg>
  )
}

Beaker.defaultProps = {
  lightColor: '#cce7ff'
}

Beaker.propTypes = {
  lightColor: PropTypes.string
}

export default Beaker
