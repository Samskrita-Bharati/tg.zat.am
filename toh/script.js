{(function () {
  //Service worker registeration
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('sw.js') //Service worker path
    .then(function(registeration){
      //Successfully registred
      console.log("Service worker registred successfully.");
    }, function(err) {
      //Failed to register
      console.log("Service worker failed to register.")
    })
  }



  /*global $, console */
  $(document).ready(function () {
  	'use strict';

    //Save the level in navigator.
    {(function(){
      var localLevel = localStorage.getItem('tgztohgl');
      if(localLevel){
        $('.level').val(localLevel);
        $('.disk-num').text(Number(localLevel) + 2);
      } else (
        localStorage.setItem('tgztohgl', 1)
      )
    })();}


    {(function(){
      //body height
      $('body').height($(window).height())
      $(window).resize(function() {
        $('body').height($(window).height())
      })
    })()}

    var tower = [ $('.tower._1'), $('.tower._2'), $('.tower._3') ],
    level = Number( $('.level').val() );
    function handle() {
      level = level;
      //to make the towers empty of any fake/un needed elements
      tower[0].empty();
      tower[1].empty();
      tower[2].empty();
      //inject disks into the first tower
      for (var i = 1; i <= level+2; i++) {
        tower[0].append('<div class="disk size' + i + '"></div>');
      }
      //put the disks into right order in right position
      $('.disk').each(function () {
        $(this).css({
          bottom : $(this).nextAll().length * 30
        });
      });
      //to recorrect disks positions and order when moveing between two towers
      $(window).click(function() {
        $('.disk').each(function () {
          $(this).css({
            bottom : $(this).nextAll().length * 30
          });
        });
      })
    }
    handle();





    var interval = 0,
    timer = [];
    let s = 0, m = 0, h = 0;
    var status = 'stoped';
    function time(){
      let S, M, H;
      s++;
      if(s == 60){
        m += 1;
        s = 0;
      }
      if(m == 60){
        h +=1;
        m = 0;
      }
      if (s < 10){
        S = "0" + s;
      } else {
        S = s;
      }
      if (m < 10){
        M = "0" + m;
      } else {
        M = m;
      }
      if (h < 10){
        H = "0" + h;
      } else {
        H = h;
      }
      $(".timer").text(Sanscript.t(String(H),'iast', 'devanagari') + " : " + Sanscript.t(String(M),'iast', 'devanagari') + " : " + Sanscript.t(String(S),'iast', 'devanagari'));
    }



    //to check if he won
    function ckeckifwon() {
      // if the second tower or the third tower are full of disks
      if ((tower[1].children().length == level+2) || (tower[2].children().length == level+2)) {
        $('.won').fadeIn(200);
        status = 'stoped';
        clearInterval(timer[interval-1]);
        $(".timer").text('00 : 00 : 00');
        s = 0, m = 0, h = 0;
      }
    }



  	$(".start").click(function (){
      handle();
      $('.lock').hide(0);
      clearInterval(timer[interval-1]);
      timer[interval] = setInterval(time, 1000);
      interval++;
      status = 'running';
  	});




    $('.stop').click(function () {
      clearInterval(timer[interval-1]);
      $(".timer").text('00 : 00 : 00');
      handle();
      $('.lock').show(0);
      status = "stoped";
    })

    $('.pause').click(function () {
      if (status == 'running') {
        $('.lock').show(0);
        $(this).text('Go on');
        clearInterval(timer[interval-1]);
        status = 'paused';
      } else if (status == 'paused') {
        $('.lock').hide(0);
        $(this).text('Pause');
        timer[interval] = setInterval(time, 1000);
        interval++;
        status = 'running';
      }

    })


    $('.next-level').click(function () {
      level++;
      $('.level').val(Sanscript.t(String(level),'iast', 'devanagari'));
      $('.disk-num').text(level + 2);
      handle();
      $('.lock').show(0);
      $('.won').fadeOut(200);
      localStorage.setItem('tgztohgl', level)
    })


    $('.replay').click(function () {
      handle();
      $('.lock').show(0);
      $('.won').fadeOut(200);
    })


    //the main movement algo.
    $('.tower').click(function () {
      if ($(this).children().first().hasClass('upToMove')) {
        $(this).children().first().removeClass('upToMove');
      } else {
        if ($(this).siblings().children().hasClass('upToMove')) {
        } else {
          $(this).children().first().addClass('upToMove');
        }
      }
      if ($(this).siblings().children().find('.upToMove')) {
        if ($(this).children().first().width() < $(this).siblings().children('.upToMove').width()) {
          $('.alert').animate({
            left: 20
          }, 200).delay(4000)
          .animate({
            left: -600
          }, 200)
        } else {
          $(this).prepend($(this).siblings().children('.upToMove').removeClass('upToMove'));
        }
      }
      ckeckifwon();
    });


  });

})()}
