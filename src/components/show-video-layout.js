import React, { PropTypes } from "react";

import Layout from "./layout";
import Player from "./you-tube/player";

const ShowVideoLayout = props => {
  const { videoId } = props;

  return (
    <Layout contentStyle={{backgroundColor: "yellow"}}>
      <Player videoId={videoId} style={{flex: 1, height: 300}} />
    </Layout>
  );
};

ShowVideoLayout.propTypes = {
  videoId: PropTypes.string.isRequired,
};

export default ShowVideoLayout;
