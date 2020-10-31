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
    this.loadStylesheet('style.css');

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
        if(!piece.match(/\/?[ur]\/[a-zA-Z_-]{3,20}/g)) {
            final.push(piece);
            return;
        }
        const words = piece.split(/(\/?[ur]\/[a-zA-Z_\-0-9]{3,20})/);
        words.forEach(word => {
          if(!word.match(/\/?[ur]\/[a-zA-Z_-]{3,20}/g)) {
            final.push(word);
            return;
          }
          final.push(React.createElement(RedditLink, {
            redditLink: word
          }))
        })      
    });
    return final;
  }

  pluginWillUnload() {
    uninject("reddit-parser");
  }
};
