const { React } = require("powercord/webpack");

class RedditLink extends React.PureComponent {
  render() {
    const { redditLink } = this.props;

    // Filter out the leading / if it has one
    const tag = redditLink.match(/\/?([ur]\/[a-zA-Z_-]{3,20})/)[1];

    return (
      <a
        class={"reddit-mention"}
        title={`https://reddit.com/${tag}`}
        rel={"noreferrer noopener"}
        href={`https://reddit.com/${tag}`}
        role={"button"}
        target={"_blank"}
      >
        {redditLink}
      </a>
    );
  }
}

module.exports = RedditLink;
