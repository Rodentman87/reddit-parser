const { React } = require('powercord/webpack');

class RedditLink extends React.PureComponent {
    render() {
        const { redditLink } = this.props;

        if(redditLink.startsWith("/")){
            return <a 
                class={"reddit-mention"}
                title={`https://reddit.com${redditLink}`}
                rel={"noreferrer noopener"}
                href={`https://reddit.com${redditLink}`}
                role={"button"}
                target={"_blank"}
            >
                {redditLink}
            </a>;
        } else {
            return <a 
                class={"reddit-mention"}
                title={`https://reddit.com/${redditLink}`}
                rel={"noreferrer noopener"}
                href={`https://reddit.com/${redditLink}`}
                role={"button"}
                target={"_blank"}
            >
                {redditLink}
            </a>;
        }
    }
}

module.exports = RedditLink;