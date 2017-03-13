import React, { PropTypes } from "react";

import Layout from "./layout";
import Player from "./you-tube/player";

import styles from "../styles/show-video-layout";

const ShowVideoLayout = props => {
  const { videoId } = props;

  return (
    <Layout contentStyle={styles.layout}>
      <Player videoId={videoId} style={styles.player} />
    </Layout>
  );
};

ShowVideoLayout.propTypes = {
  videoId: PropTypes.string.isRequired,
};

export default ShowVideoLayout;
