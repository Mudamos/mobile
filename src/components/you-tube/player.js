import React, { Component, PropTypes } from "react";

import {
  View,
} from "react-native";

import YouTubeWebView from "./web-view";

export default class YouTubePlayer extends Component {
  static propTypes = {
    style: View.propTypes.style,
    videoId: PropTypes.string.isRequired,
  };

  render() {
    const source = "https://www.youtube.com/embed/" + this.props.videoId;

    const HTML = `

    <html>
      <body>
        <style>
          * {
            margin: 0;
            border: 0;
            padding: 0;
          }

          iframe {
            width: 100%;
            min-height: 100%;
          }
        </style>

        <iframe src="${source}" id="player" frameborder="0" allowfullscreen></iframe>

        <script type="text/javascript">
          var player = document.getElementById("player");
          player.height = window.innerHeight;
        </script>
      </body>
    </html>

    `;

    return (
      <YouTubeWebView
        scrollEnabled={false}
        source={{ html: HTML }}
        style={this.props.style}
      />
    );
  }
}
