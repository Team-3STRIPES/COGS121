$.ajax({
      url : "/ready",
      type: "POST",
      data : {
              input_user: localStorage.getItem('user'),
              input_password: localStorage.getItem('pass'),
             },
      success: function(data, textStatus, jqXHR)
      {
        $("#points").text(data.points);
        $("#name").text(data.out_name);
        var theme = data.theme
        var $nav = $('nav');
        var curTheme = theme.replace(/([A-Z])/g, '-$1').toLowerCase() + "-bg";
        $nav.addClass(curTheme);

        localStorage.setItem('name', data.out_name);
        localStorage.setItem('points', data.points);
        localStorage.setItem('theme', data.theme);
        localStorage.setItem('animation', data.gif);
        localStorage.setItem('isUpdated', 'true');
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        $('nav').addClass('default-bg');
      }
    });