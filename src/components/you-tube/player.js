import PropTypes from "prop-types";
import React, { Component } from "react";

import { ViewPropTypes } from "react-native";

import YouTubeWebView from "./web-view";

export default class YouTubePlayer extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    videoId: PropTypes.string.isRequired,
  };

  get source() {
    return "https://www.youtube.com/embed/" + this.props.videoId + "?autoplay=1&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=0&rel=0";
  }

  render() {
    const HTML = `

    <html>
      <body>
        <style>
          * {
            margin: 0;
            border: 0;
            padding: 0;
          }

          body {
            background-color: black;
          }

          iframe {
            width: 100%;
            min-height: 100%;
          }
        </style>

        <iframe src="${this.source}" id="player" frameborder="0" allowfullscreen></iframe>

        <script type="text/javascript">
          setTimeout(function() {
            var player = document.getElementById("player");
            player.height = window.innerHeight;
          }, 1000);
        </script>
      </body>
    </html>

    `;

    return (
      <YouTubeWebView
        scrollEnabled={false}
        source={{html: HTML}}
        style={this.props.style}
      />
    );
  }
}
