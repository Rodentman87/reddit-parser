/**
 * reddit-parser
 *
 */

const { Plugin } = require("powercord/entities");
const { inject, uninject } = require("powercord/injector");
const { React, getModule } = require('powercord/webpack');

const RedditLink = require('./Components/RedditMention');

module.exports = class RedditParser extends Plugin {
  async startPlugin() {
    const parser = await getModule(['parse', 'parseTopic']);

    const process = this.process.bind(this);
    inject(`reddit-parser`, parser, "parse", process);
  }

  process(args, res, ops = {}) {
    const final = [];
    res.forEach(piece => {
        if(!(typeof piece === "string")) {
            final.push(piece);
            return;
        }
        if(!piece.match(/\/?[ur]\/\w{3,20}/g)) {
            final.push(piece);
            return;
        }
        let piecesToPush = [];
        const words = piece.split(" ");
        words.forEach(word => {
            if(!word.match(/\/?[ur]\/\w{3,20}/)) {
                piecesToPush.push(word);
                return;
            }
            final.push(piecesToPush.join(" ") + " ");
            piecesToPush = [];
            final.push(React.createElement(RedditLink, {
                redditLink: word
            }));
        })
        
    });
    return final;
  }

  pluginWillUnload() {
    uninject("reddit-parser");
  }
};
