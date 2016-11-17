import React, { Component, PropTypes } from "react";
import { WebView } from "react-native";

const script2 = `<script>
    window.location.hash = 1;

    var height;

      var body = document.body,
      html = document.documentElement;

      height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

    document.title = height;
</script>
`;

const script = `
;(function() {
var wrapper = document.createElement("div");
wrapper.id = "height-wrapper-hack";
while (document.body.firstChild) {
    wrapper.appendChild(document.body.firstChild);
}
document.body.appendChild(wrapper);
var i = 0;
function updateHeight() {
    document.title = wrapper.clientHeight;
    window.location.hash = ++i;
}
updateHeight();
window.addEventListener("load", function() {
    updateHeight();
    setTimeout(updateHeight, 1000);
});
window.addEventListener("resize", updateHeight);
}());
`;


const style = `
<style>
body, html, #height-wrapper-hack {
    margin: 0;
    padding: 0;
}
#height-wrapper-hack {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}
</style>
<script>
${script}
</script>
`;
const BODY_TAG_PATTERN = /\<\/ *body\>/;
const injectHtml = html => {
  return `
  <!DOCTYPE html>
    <html>
      <head>
      <meta name="viewport" content="width=device-width, user-scalable=no">
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
}
const codeInject = (html) => injectHtml(html).replace(BODY_TAG_PATTERN, style + "</body>");

export default class WebContainer extends Component {
  static propTypes = {
    height: PropTypes.number,
    source: PropTypes.object.isRequired,
  };

  state = {
    height: this.props.height || 0,
  };

  onNavigationStateChange(navState) {
    console.log('bbbbbbbbbbbbbbbbbbbbbbbb', navState.title)
    this.setState({ height: navState.title });
  }

  render() {
    let { source, ...props } = this.props;

    return (
      <WebView
        {...props}
        mediaPlaybackRequiresUserAction={false}
        style={{ height: Number(this.state.height) }}
        scrollEnabled={false}
        source={{ html: codeInject(source.html) }}
        onNavigationStateChange={this.onNavigationStateChange.bind(this)}
      />
    );
  }
}
