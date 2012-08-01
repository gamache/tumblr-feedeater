describe('feedeater', function() {

  var nposts = 8;

  it('defines FEEDEATER', function() {
    expect(FEEDEATER).not.toEqual(undefined);
  });

  it('can be instantiated', function() {
    var f = new FEEDEATER();
    expect(f).not.toEqual(undefined);
  });

  it('class can render_posts() into default #tumblr-posts', function () {
    $('#tumblr-posts').remove();    
    $('body').append($('<div id="tumblr-posts"></div>').css('display', 'none'));
    expect($('#tumblr-posts').html()).toEqual('');
    FEEDEATER.render_posts();
    expect($('#tumblr-posts').html()).not.toEqual('');
  });

  it('class can render_posts() into given target', function () {
    $('body').append($('<div id="test"></div>').css('display', 'none'));
    expect($('#test').html()).toEqual('');
    FEEDEATER.render_posts({target: '#test'});
    expect($('#test').html()).not.toEqual('');
  });

  it('instance can render() into default #tumblr-posts', function() {
    var f = new FEEDEATER();
    $('#tumblr-posts').remove();
    $('body').append($('<div id="tumblr-posts"></div>').css('display', 'none'));
    expect($('#tumblr-posts').html()).toEqual('');
    f.render();
    expect($('#tumblr-posts').html()).not.toEqual('');
  });

  it('renders all posts', function() {
    var n = 0;
    $('#tumblr-posts .tumblr-post').each(function(){ n++; });
    expect(n).toEqual(nposts);
  });

  it('renders each post with a date', function() {
    var n = 0;
    $('#tumblr-posts .tumblr-post .date').each(function(){ n++; });
    expect(n).toEqual(nposts);
  });

  it('includes post type in every post', function () {
    var n = 0;
    $('#tumblr-posts')
      .children('.regular,.link,.quote,.photo,.conversation,.video,.audio,.answer')
      .each(function(){ n++; });
    expect(n).toEqual(nposts);
  });

  it('renders non-blank h2.title for regular, conversation, video, audio', function () {
    var n = 0;
    $('#tumblr-posts').children('.regular,.conversation,.video,.audio')
      .each(function(){ n++; });
    expect(n).not.toEqual(0);
    $('#tumblr-posts').children('.regular,.conversation,.video,.audio')
      .children('h2.title')
      .each(function(idx,val){
        expect($(val).html()).not.toEqual('');
        n--;
      });
    expect(n).toEqual(0);
  });

});
