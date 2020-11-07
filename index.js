/**
 * reddit-parser
 *
 */

const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { React, getModule } = require("powercord/webpack");

const RedditLink = require("./Components/RedditMention");

const Settings = require("./Components/Settings");

const componentTypesToCheck = ["u", "em", "strong"];

const tagRegex = /(?<!\w)\/?[ur]\/[a-zA-Z_\-0-9]{3,20}/g;

module.exports = class RedditParser extends Plugin {
  async startPlugin() {
    powercord.api.settings.registerSettings("reddit-mentions", {
      category: this.entityID,
      label: "Reddit Mentions",
      render: Settings,
    });

    this.loadStylesheet("style.css");

    const parser = await getModule(["parse", "parseTopic"]);

    const process = this.process.bind(this);
    inject(`reddit-parser`, parser, "parse", process);
  }

  process(args, res, ops = {}) {
    const final = [];
    res.forEach((piece) => {
      if (!(typeof piece === "string")) {
        if (componentTypesToCheck.includes(piece.type)) {
          // This piece of the message is one of the react elements I want to check, I can just run this function recursively
          piece.props.children = this.process({}, piece.props.children);
        }
        if (piece.type.name && piece.type.name === "StringPart") {
          // This is a Base64 tooltip caught by Message Tooltips
          piece.props.parts = this.process({}, piece.props.parts);
        }
        final.push(piece);
        return;
      }
      if (!piece.match(tagRegex)) {
        final.push(piece);
        return;
      }
      const words = piece.split(/(\/?[ur]\/[a-zA-Z_\-0-9]{3,20})/);
      words.forEach((word) => {
        if (!word.match(tagRegex)) {
          final.push(word);
          return;
        }
        final.push(
          React.createElement(RedditLink, {
            redditLink: word,
            displayAsMention: this.settings.get("mention", true),
            showIcon: this.settings.get("icon", true),
            showNSFW: this.settings.get("show-nsfw", false),
          })
        );
      });
    });
    return final;
  }

  pluginWillUnload() {
    uninject("reddit-parser");
    powercord.api.settings.unregisterSettings("reddit-mentions");
  }
};
