(function(){

  FEEDEATER = function FEEDEATER(opts) {
    opts = opts || {};
    this.feed = opts['feed'] || tumblr_api_read;
    this.target = opts['target'] || 'tumblr-posts';

    this.load_renderers();
    if (opts['renderers']) {
      for (var r in opts['renderers']) {
        this.renderers.r = opts['renderers'][r];
      }
    }
  };

  // class method, for backward compatibility
  FEEDEATER.render_posts = function (opts) {
    var f = new FEEDEATER(opts);
    f.render();
  };

  // public instance method: render()
  FEEDEATER.prototype.render = function render(opts) {
    opts = opts || {};
    var target = opts['target'] || this.target;
    var posts = opts['posts'] || this.feed.posts;
    var html = '';
    for (var i in posts) {
      html += this.render_post_to_html(posts[i]);
    }
    this.render_html_into_target(html, target);
  };


  // private instance methods follow.
  FEEDEATER.prototype.render_html_into_target = function render_html_into_target(html, target) {
    if (jQuery && target.html) { // jQuery selector object
      target.html(html);
    }
    else if (target.innerHTML) { // element
      target.innerHTML = html;
    }
    else if (target) {
      // target is string; try to use it as an element id, otherwise if
      // jQuery's loaded, use it as a jQuery selector string
      var elt = document.getElementById(target);
      if (elt) {
        elt.innerHTML = html;
      }
      else if (jQuery) {
        $(target).html(html);
      }
    }
  };

  FEEDEATER.prototype.render_post_to_html = function render_post_to_html(post){
    return '<div class="tumblr-post ' + post.type + '">' +
           this.renderers[post.type](post) +
           '</div>';
  };


  FEEDEATER.prototype.load_renderers = function load_renderers(renderers) {
    renderers = renderers || FEEDEATER.renderers;
    this.renderers = this.renderers || {};
    for (var r in renderers) {
      this.renderers[r] = renderers[r];
    }
  };

  FEEDEATER.renderers = {
    regular: function render_regular(post) {
      return '<h2 class="title">' + post['regular-title'] + '</h2>' +
             '<div class="date">' + post['date'] + '</div>' +
             '<div class="regular-body">' + post['regular-body'] + '</div>';
    },
    link: function render_link(post) {
      return '<a href="' + post['link-url'] + '">' + post['link-text'] + '</a>' +
             '<div class="date">' + post['date'] + '</div>';
    },
    quote: function render_quote(post) {
      return '<dd>' + post['quote-text'] + '</dd>' +
             '<dt>' + post['quote-source'] + '</dt>' +
             '<div class="date">' + post['date'] + '</div>';
    },
    photo: function render_photo(post) {
      return '<img src="' + post['photo-url-'+this.image_width] + '"/>' +
             '<div class="caption">' + post['photo-caption'] + '</div>' +
             '<div class="date">' + post['date'] + '</div>';
    },
    conversation: function render_conversation(post) {
      var convo = '',
          lines = post['conversation'];

      convo = '<h2 class="title">' + post['conversation-title'] + '</h2>' +
              '<div class="date">' + post['date'] + '</div>';
      for (var i in lines) {
        convo += '<div class="line"><span class="name">' + lines[i].name +
                 '</span><span class="phrase">' + lines[i].phrase + '</span></div>';
      }
      return convo;
    },
    video: function render_video(post) {
      return '<h2 class="title">' + post['video-caption'] + '</h2>' +
             '<div class="date">' + post['date'] + '</div>' + post['video-player'];
    },
    audio: function render_audio(post) {
      return '<h2 class="title">' + post['audio-caption'] + '</h2>' +
             '<div class="date">' + post['date'] + '</div>' + post['audio-player'];
    },
    answer: function render_answer(post) {
      return '<div class="question">'+ post['question'] + '</div>' +
             '<div class="answer">' + post['answer'] + '</div>' +
             '<div class="date">' + post['date'] + '</div>';
    }
  };

})();
