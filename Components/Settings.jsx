const { React } = require("powercord/webpack");
const { SwitchItem } = require("powercord/components/settings");

module.exports = class Settings extends React.PureComponent {
  render() {
    return (
      <div>
        <SwitchItem
          note="Should reddit links be dispalyed as mentions? (On: Mentions, Off: Links)"
          value={this.props.getSetting("mention", true)}
          onChange={() => this.props.toggleSetting("mention", true)}
        >
          Display as mentions
        </SwitchItem>
        <SwitchItem
          note="Should icons be displayed next to the tag in messages? (Note: icons for NSFW subs and users will never be displayed)"
          value={this.props.getSetting("icon", true)}
          onChange={() => this.props.toggleSetting("icon", true)}
        >
          Show icons in messages
        </SwitchItem>
        <SwitchItem
          note="Should icons for NSFW subs and users be displayed next to the tag in messages?"
          value={this.props.getSetting("show-nsfw", false)}
          onChange={() => this.props.toggleSetting("show-nsfw", false)}
        >
          Show NSFW icons
        </SwitchItem>
      </div>
    );
  }
};
