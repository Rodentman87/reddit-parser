const { React, getModuleByDisplayName } = require("powercord/webpack");
const { get } = require("powercord/http");

const Tooltip = getModuleByDisplayName("Tooltip", false);

class RedditLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: "Loading...",
    };
  }

  render() {
    const { redditLink } = this.props;

    // Filter out the leading / if it has one
    const tag = redditLink.match(/\/?([ur]\/[a-zA-Z_\-0-9]{3,20})/)[1];

    return (
      <Tooltip position={"top"} text={this.state.tooltip}>
        {(props) => (
          <span {...props}>
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
          </span>
        )}
      </Tooltip>
    );
  }

  componentWillMount() {
    this.getTooltip(
      this.props.redditLink.match(/\/?([ur]\/[a-zA-Z_\-0-9]{3,20})/)[1]
    ).then((tooltip) => {
      this.setState({
        tooltip,
      });
    }, this);
  }

  async getTooltip(tag) {
    if (tag.startsWith("u")) {
      // Tooltip for a user
      const result = await get(
        `https://www.reddit.com/user/${tag.substring(2)}/about.json`
      );
      if(result.status === 404) return "User does not exist!";
      const iconImage = result.body.data.icon_img.substring(
        0,
        result.body.data.icon_img.indexOf("?")
      );
      return (
        <span>
          {iconImage !== "" ? <img src={iconImage} style={{ width: "30px", height: "30px" }} /> : null}
          <span class="reddit-tooltip">
            {tag}
            {result.body.data["over_18"] ? (
              <span class="reddit-nsfw-tag">NSFW</span>
            ) : null}
          </span>
        </span>
      );
    } else {
      // Tooltip for a subreddit
      const result = await get(`https://www.reddit.com/${tag}/about.json`);
      const iconImage = result.body.data.icon_img;
      if(result.status === 404) return "Subreddit does not exist!";
      return (
        <span class="reddit-tooltip-wrapper">
          {iconImage !== "" ? <img src={iconImage} style={{ width: "30px", height: "30px" }} /> : null}
          <span class="reddit-tooltip">
            {tag}
            {result.body.data["over18"] ? (
              <span class="reddit-nsfw-tag">NSFW</span>
            ) : null}
          </span>
        </span>
      );
      return tag;
    }
  }
}

module.exports = RedditLink;
