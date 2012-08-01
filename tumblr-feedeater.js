/**
 * Creates an instance of FEEDEATER.  Valid options:
 *   'feed' specifies a tumblr feed.  Defaults to tumblr_api_read.
 *   'target' specifies default target element.  Defaults to 'tumblr-posts'.
 *   'image_width' specifies desired image width.  Defaults to 500.
 *   'renderers' allows addition/override of rendering routines.  Must be an
 *     object of the form {'postType': rendering_fn, ...}.
 *
 * @constructor
 * @this {FEEDEATER}
 * @param {object} opts Desired options.
 */

FEEDEATER = function FEEDEATER(opts) {
  opts = opts || {};

  this.feed = opts['feed'] || tumblr_api_read;
  this.target = opts['target'] || 'tumblr-posts';
  this.image_width = opts['image_width'] || 500;

  this.load_renderers();
  if (opts['renderers']) this.load_renderers(opts['renderers']);
};

/**
 * Renders a Tumblr feed into a target element, according to desired options.
 * Class method.
 * See FEEDEATER constructor for valid options.
 *
 * @param {object} opts Desired options.
 */
FEEDEATER.render_posts = function render_posts(opts) {
  var f = new FEEDEATER(opts);
  f.render();
};

/**
 * Renders a Tumblr feed into a target element, according to desired options.
 * Instance method.
 * See FEEDEATER constructor for valid options.
 *
 * @param {object} opts Desired options.
 */
FEEDEATER.prototype.render = function render(opts) {
  opts = opts || {};
  var target = opts['target'] || this.target;
  var html = this.render_to_string(opts);
  this.render_html_into_target(html, target);
};

/**
 * Renders a Tumblr feed to an HTML string, according to desired options.
 * See FEEDEATER constructor for valid options.
 *
 * @param {object} opts Desired options.
 * @return {string} HTML string.
 */
FEEDEATER.prototype.render_to_string = function render_to_string(opts) {
  opts = opts || {};
  var posts = opts['posts'] || this.feed.posts;
  var html = '';
  for (var i in posts) {
    html += this.render_post_to_html(posts[i]);
  }
  return html;
};


//// private methods follow.

/**
 * @private
 *
 * Renders given html into given target.
 * Target may be specified as an HTML element, as a jQuery selector,
 * as an element ID name, or as a jQuery selector string.
 *
 * @param {string} html The HTML to render.
 * @param target The target to render into.
 */
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
      jQuery(target).html(html);
    }
  }
};

/**
 * @private
 *
 * Returns an HTML rendering of a post.
 *
 * @param {post} post A Tumblr post object.
 */
FEEDEATER.prototype.render_post_to_html = function render_post_to_html(post){
  return '<div class="tumblr-post ' + post.type + '">' +
         this.renderers[post.type](post, this) +
         '</div>';
};

/**
 * @private
 *
 * Loads the specified renderers into this.
 *
 * @param {object} renderers Renderers to load.  Defaults to FEEDEATER.renderers.
 */
FEEDEATER.prototype.load_renderers = function load_renderers(renderers) {
  renderers = renderers || FEEDEATER.renderers;
  this.renderers = this.renderers || {};
  for (var r in renderers) {
    this.renderers[r] = renderers[r];
  }
};

/**
 * @private
 *
 * Rendering functions for each post.type, keyed by post.type.
 * All functions receive 'post' as first argument, 'this' (the FEEDEATER 
 * instance) as second argument.
 * Renderers are loaded into a FEEDEATER object at instantiation time
 * by use of load_renderers().
 */
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
  photo: function render_photo(post, that) {
    return '<img src="' + post['photo-url-'+that.image_width] + '"/>' +
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

