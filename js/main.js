(function() {
  window.addEventListener('load', function() {
    new FastClick(document.body);
  }, false);

  $(document).ready(function() {
    "use strict";

    var $main = $('#main'),
        $browser = $('#browser'),
        $backBtn = $('#btnBack'),
        $loading = $('#loading'),
        $refresh = $('#btnRefresh');

    $.ajaxSetup({
      type: "GET",
      dataType: "jsonp",
      timeout: 7500,
      error: function() {
        $loading.text("Error! Best check yo internetz");
      }
    });

    var hn = {
      jsonurl: {
        news: "http://node-hnapi.herokuapp.com/news",
        news2: "http://node-hnapi.herokuapp.com/news2"
      },
      state: {
        isMain: true,
        isLoading: true
      },
      concatenateNews: function(data) {
        var str = "";
        $.each(data, function(i, val) {
          str += '<a href="' + val.url + '" class="post" data-hnid="' + val.id + '">' +
                    '<p class="post-title">' + val.title + '</p>' +
                    '<span class="post-points">' + (val.points ? val.points + 'pts' : 'JOB') + '</span>' +
                    '<span class="post-url">' + val.domain + '</span>' +
                    '<span class="post-timeago">' + val.time_ago + '</span>' +
                    '<span class="post-comments">' + val.comments_count + ' cmts.</span>' +
                  '</a>';
        });
        return str;
      },
      fetchList: function() {
        var loadNews;
        loadNews = $.ajax(hn.jsonurl.news);
        loadNews.done(function(data) {
          var str = hn.concatenateNews(data);
          $main.prepend(str);
          hn.state.isLoading = false;
        }).done(function() {
          var $post18 = $('.post:eq(18)');
          $post18.waypoint(function() {
            $post18.waypoint('destroy');
            $.ajax(hn.jsonurl.news2).done(function(data) {
              var str = hn.concatenateNews(data);
              $loading = $loading.detach();
              $main.append(str);
            });
          });
        });
      }
    };

    hn.fetchList();
    $browser.css('height', ($(window).height() - 53) + "px");

    $refresh.on('click', function() {
      if (!hn.state.isLoading) {
        hn.state.isLoading = true;
        $main.empty();
        $loading.appendTo($main);
        hn.fetchList();
      }
    });

    $backBtn.on('click', function(e) {
      if (!hn.state.isMain) {
        window.stop();
        $browser.attr('src', '#');
        $browser.hide();
        $main.show();
        $(this).hide();
        $refresh.show();
        hn.state.isMain = true;
        e.preventDefault();
      }
    });

    $main.on('click', '.post', function(e) {
      $browser.attr('src', $(this).attr('href'));
      $backBtn.show();
      $main.hide();
      $browser.show();
      $refresh.hide();
      hn.state.isMain = false;
      e.preventDefault();
    });
  });
})();
