// tumblr-feedeater.js
// turn a Tumblr feed into HTML.
// january 2012   pete gamache   gamache!#$@!#gmail.com

FEEDEATER = {
  // config variables -- you can set them directly
  tumblr_host: null,  // e.g., 'omgblogz.tumblr.com'
  image_width: 500,   // options: 75, 100, 250, 400, 500, 1280

  // ... or use the set({...}) function to set a hash of options
  set: function (opts) {
    for (var key in opts) {
      if (opts.hasOwnProperty(key)) {
        FEEDEATER[key] = opts[key];
      }
    }
  },

  // render_posts renders all posts into the #tumblr-posts element
  // or the value of opts['target'] if specified
  render_posts: function (opts) {
    if (!FEEDEATER.tumblr_host) {
      alert('You gotta set FEEDEATER.tumblr_host dude');
      return;
    }
    opts = opts || {};
    target = opts['target'] || '#tumblr-posts';
    target = $(target);
    for (var i in tumblr_api_read['posts']) {
      var post = tumblr_api_read['posts'][i];
      target.append(
        FEEDEATER.render(post).append(FEEDEATER.render_date(post))
      );
    }
  },

  // render(post) returns a jQuery rendering of a post
  render: function (post) {
    return FEEDEATER.renderers[post.type](post);
  },
  renderers: {
    regular: function (post) {
      return FEEDEATER.render_div(post)
               .html('<h2 class="title">' + post['regular-title'] + '</h2>' +
                     '<div class="regular-body">' + post['regular-body'] +
                     '</div>');
    },
    link: function (post) {
      return FEEDEATER.render_div(post)
               .html('<a href="' + post['link-url'] + '">' +
                     post['link-text'] + '</a>');
    },
    quote: function (post) {
      return FEEDEATER.render_div(post)
               .html('<dd>' + post['quote-text'] + '</dd>' +
                     '<dt>' + post['quote-source'] + '</dt>');
    },
    photo: function (post) {
      return FEEDEATER.render_div(post)
               .html('<img src="' + post['photo-url-' + FEEDEATER.image_width]
                     + '">' + '<div class="caption">' + post['photo-caption'] +
                     '</div>');
    },
    conversation: function (post) {
      var convo = $('<div class="conversation"></div>');
      for (var i in post['conversation']) {
        var line = post['conversation'][i];
        convo.append('<div class="line"><span class="name">' +
                     line['line-name'] + '</span><span class="text">' +
                     line['line-text'] + '</span></div>');
      }
      return FEEDEATER.render_div(post)
               .html('<h2>' + post['conversation-title'] + '</h2>')
               .append(convo);
    },
    video: function (post) {
      return FEEDEATER.render_div(post)
               .html('<h2>' + post['video-caption'] + '</h2>' +
                     post['video-player']);
    },
    audio: function (post) {
      return FEEDEATER.render_div(post)
               .html('<h2>' + post['audio-caption'] + '</h2>' +
                     post['audio-player']);
    },
    answer: function (post) {
      return FEEDEATER.render_div(post)
               .html('<div class="question">' + post['question'] + '</div>' +
                     '<div class="answer">' + post['answer'] + '</div>');
    }
  },

  // render_div(post) returns an empty jQuery post div
  render_div: function (post) {
    return $('<div class="tumblr-post '+post.type+'"></div>');
  },

  // render_date(post) returns a jQuery rendering of a post's date
  render_date: function (post) {
    return $('<div class="date">' + post['date'] + '</div>');
  }
};

