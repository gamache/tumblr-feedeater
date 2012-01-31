// tumblr-feedeater.js
// turn a Tumblr feed into HTML.
// january 2012   pete gamache   gamache!#$@!#gmail.com

FEEDEATER = {
  // config variables -- set them directly
  tumblr_host: null,
  image_width: 500,

  // ... or use the set() function to set multiple options
  set: function (opts) {
    for (var key in opts) {
      if (opts.hasOwnProperty(key)) {
        FEEDEATER[key] = opts[key];
      }
    }
  },

  // render_all_posts renders all posts (duh) into the #tumblr-posts element
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
        FEEDEATER.render(post)
          .append(FEEDEATER.render_date(post))
      );
    }
  },

  // render[post.type](post) returns a jQuery rendering of a post
  render: function (post) {
    return FEEDEATER.renderers[post.type](post);
  },
  renderers: {
    regular: function (post) {
      return $('<div class="tumblr-post '+post.type+'"></div>')
               .html('<h2 class="title">' + post['regular-title'] + '</h2>' +
                     '<div class="regular-body">' + post['regular-body'] +
                     '</div>');
    },
    link: function (post) {
      return $('<div class="tumblr-post '+post.type+'"></div>')
               .html('<a href="' + post['link-url'] + '">' +
                     post['link-text'] + '</a>');
    },
    quote: function (post) {
      return $('<div class="tumblr-post '+post.type+'"></div>')
               .html('<dd>' + post['quote-text'] + '</dd>' +
                     '<dt>' + post['quote-source'] + '</dt>');
    },
    photo: function (post) {
      return $('<div class="tumblr-post '+post.type+'"></div>')
               .html('<img src="' + post['photo-url-500'] + '">' +
                     '<div class="caption">' + post['photo-caption'] +
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
      return $('<div class="tumblr-post '+post.type+'"></div>')
               .html('<h2>' + post['conversation-title'] + '</h2>')
               .append(convo);
    },
    video: function (post) {
      return $('<div class="tumblr-post '+post.type+'"></div>')
               .html('<h2>' + post['video-caption'] + '</h2>' +
                     post['video-player']);
    },
    audio: function (post) {
      return $('<div class="tumblr-post '+post.type+'"></div>')
               .html('<h2>' + post['audio-caption'] + '</h2>' +
                     post['audio-player']);
    },
    answer: function (post) {
      return $('<div class="tumblr-post '+post.type+'"></div>')
               .html('<div class="question">' + post['question'] + '</div>' +
                     '<div class="answer">' + post['answer'] + '</div>');
    }
  },

  // render_date(post) returns a jQuery rendering of a post's date
  render_date: function (post) {
    return $('<div class="date">' + post['date'] + '</div>');
  }
};

