describe('feedeater', function() {

  it('can render_posts into default #tumblr-posts', function () {
    $('body').append($('<div id="tumblr-posts"></div>').css('display', 'none'));
    expect($('#tumblr-posts').html()).toEqual('');
    FEEDEATER.render_posts();
    expect($('#tumblr-posts').html()).not.toEqual('');
  });

  it('can render_posts into given target', function () {
    $('body').append($('<div id="test"></div>').css('display', 'none'));
    expect($('#test').html()).toEqual('');
    FEEDEATER.render_posts({target: '#test'});
    expect($('#test').html()).not.toEqual('');
  });

  it('renders eight posts', function() {
    var n = 0;
    $('#tumblr-posts .tumblr-post').each(function(){ n++; });
    expect(n).toEqual(8);
  });

  it('renders each post with a date', function() {
    var n = 0;
    $('#tumblr-posts .tumblr-post .date').each(function(){ n++; });
    expect(n).toEqual(8);
  });


});
