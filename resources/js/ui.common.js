; (function (win, doc) {
  'use strict';

  var global = '$plugins';
  var namespace = 'netiveUI.plugins';

  //global namespace
  if (!!win[global]) {
    throw new Error("already exists global!> " + global);
  } else {
    win[global] = createNameSpace(namespace, {
      uiNameSpace: function (identifier, module) {
        return createNameSpace(identifier, module);
      }
    });
  }
  function createNameSpace(identifier, module) {
    var name = identifier.split('.'),
      w = win,
      p;

    if (!!identifier) {
      for (var i = 0, len = name.length; i < len; i += 1) {
        (!w[name[i]]) ? (i === 0) ? w[name[i]] = {} : w[name[i]] = {} : '';
        w = w[name[i]];
      }
    }

    if (!!module) {
      for (p in module) {
        if (!w[p]) {
          w[p] = module[p];
        } else {
          throw new Error("module already exists! >> " + p);
        }
      }
    }
    return w;
  }

  $plugins.device = {
    deviceClass: function () {
      var devsize = [1920, 1600, 1440, 1280, 1024, 960, 840, 720, 600, 480, 400, 360];
      var html5tags = ['article', 'aside', 'details', 'figcaption', 'figure', 'footer', 'header', 'hgroup', 'nav', 'main', 'section', 'summary'];
      var width = document.documentElement.offsetWidth,
        colClass = width >= devsize[5] ? 'col12' : width > devsize[8] ? 'col8' : 'col4',
        size_len = devsize.length,
        max = html5tags.length,
        sizeMode,
        timer;

      win[global].breakpoint = width >= devsize[5] ? true : false;

      var deviceSizeClassName = function (w) {
        for (var i = 0; i < size_len; i++) {
          if (w >= devsize[i]) {
            sizeMode = devsize[i];
            win[global].breakpoint = width >= devsize[5] ? true : false;
            break;
          } else {
            w < devsize[size_len - 1] ? sizeMode = 300 : '';
          }
        }
      };

      for (var i = 0; i < max; i++) {
        doc.createElement(html5tags[i]);
      }

      deviceSizeClassName(width);
      var sizeCls = 's' + sizeMode;

      doc.documentElement.classList.add(sizeCls);
      doc.documentElement.classList.add(colClass);
      win.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          var dcHtml = doc.querySelector('html');

          width = win.innerWidth;
          deviceSizeClassName(width);

          colClass = width >= devsize[5] ? 'col12' : width > devsize[8] ? 'col8' : 'col4';
          dcHtml.classList.remove('s1920', 's1600', 's1440', 's1280', 's1024', 's940', 's840', 's720', 's600', 's480', 's400', 's360', 's300', 'col12', 'col8', 'col4');
          win[global].breakpoint = width >= devsize[5] ? true : false;

          deviceSizeClassName(width);
          sizeCls = 's' + sizeMode;
          dcHtml.classList.add(sizeCls);
          dcHtml.classList.add(colClass);
        }, 100);
      });
    },
    osClass: function () {
      var ua = navigator.userAgent,
        ie = ua.match(/(?:msie ([0-9]+)|rv:([0-9\.]+)\) like gecko)/i),
        deviceInfo = ['android', 'iphone', 'ipod', 'ipad', 'blackberry', 'windows ce', 'samsung', 'lg', 'mot', 'sonyericsson', 'nokia', 'opeara mini', 'opera mobi', 'webos', 'iemobile', 'kfapwi', 'rim', 'bb10'],
        filter = "win16|win32|win64|mac|macintel",
        uAgent = ua.toLowerCase(),
        deviceInfo_len = deviceInfo.length;

      var browser = win[global].browser = {},
        support = win[global].support = {},
        version,
        device;

      for (var i = 0; i < deviceInfo_len; i++) {
        if (uAgent.match(deviceInfo[i]) != null) {
          device = deviceInfo[i];
          break;
        }
      }

      browser.local = (/^http:\/\//).test(location.href);
      browser.firefox = (/firefox/i).test(ua);
      browser.webkit = (/applewebkit/i).test(ua);
      browser.chrome = (/chrome/i).test(ua);
      browser.opera = (/opera/i).test(ua);
      browser.ios = (/ip(ad|hone|od)/i).test(ua);
      browser.android = (/android/i).test(ua);
      browser.safari = browser.webkit && !browser.chrome;
      browser.app = ua.indexOf('appname') > -1 ? true : false;

      //touch, mobile
      support.touch = browser.ios || browser.android || (doc.ontouchstart !== undefined && doc.ontouchstart !== null);
      browser.mobile = support.touch && (browser.ios || browser.android);

      //os
      browser.os = (navigator.appVersion).match(/(mac|win|linux)/i);
      browser.os = browser.os ? browser.os[1].toLowerCase() : '';

      //version 
      if (browser.ios || browser.android) {
        version = ua.match(/applewebkit\/([0-9.]+)/i);
        version && version.length > 1 ? browser.webkitversion = version[1] : '';
        if (browser.ios) {
          version = ua.match(/version\/([0-9.]+)/i);
          version && version.length > 1 ? browser.ios = version[1] : '';
        } else if (browser.android) {
          version = ua.match(/android ([0-9.]+)/i);
          version && version.length > 1 ? browser.android = parseInt(version[1].replace(/\./g, '')) : '';
        }
      }

      if (ie) {
        browser.ie = ie = parseInt(ie[1] || ie[2]);
        (11 > ie) ? support.pointerevents = false : '';
        (9 > ie) ? support.svgimage = false : '';
      } else {
        browser.ie = false;
      }

      var clsBrowser = browser.chrome ? 'chrome' : browser.firefox ? 'firefox' : browser.opera ? 'opera' : browser.safari ? 'safari' : browser.ie ? 'ie ie' + browser.ie : 'other';
      var clsMobileSystem = browser.ios ? "ios" : browser.android ? "android" : 'etc';
      var clsMobile = browser.mobile ? browser.app ? 'ui-a ui-m' : 'ui-m' : 'ui-d';
      // var $html = doc.querySelector('html');

      // $html.classList.add(browser.os);
      // $html.classList.add(clsBrowser);
      // $html.classList.add(clsMobileSystem);
      // $html.classList.add(clsMobile);
      $('html').addClass(browser.os);
      $('html').addClass(clsBrowser);
      $('html').addClass(clsMobileSystem);
      $('html').addClass(clsMobile);
    }
  };

  win[global].option = {
    pageName: function () {
      var page = document.URL.substring(document.URL.lastIndexOf("/") + 1),
        pagename = page.split('?');

      return pagename[0]
    },
    keys: {
      'tab': 9, 'enter': 13, 'alt': 18, 'esc': 27, 'space': 32, 'pageup': 33, 'pagedown': 34, 'end': 35, 'home': 36, 'left': 37, 'up': 38, 'right': 39, 'down': 40
    },
    effect: {
      //http://cubic-bezier.com - css easing effect
      linear: '0.250, 0.250, 0.750, 0.750',
      ease: '0.250, 0.100, 0.250, 1.000',
      easeIn: '0.420, 0.000, 1.000, 1.000',
      easeOut: '0.000, 0.000, 0.580, 1.000',
      easeInOut: '0.420, 0.000, 0.580, 1.000',
      easeInQuad: '0.550, 0.085, 0.680, 0.530',
      easeInCubic: '0.550, 0.055, 0.675, 0.190',
      easeInQuart: '0.895, 0.030, 0.685, 0.220',
      easeInQuint: '0.755, 0.050, 0.855, 0.060',
      easeInSine: '0.470, 0.000, 0.745, 0.715',
      easeInExpo: '0.950, 0.050, 0.795, 0.035',
      easeInCirc: '0.600, 0.040, 0.980, 0.335',
      easeInBack: '0.600, -0.280, 0.735, 0.045',
      easeOutQuad: '0.250, 0.460, 0.450, 0.940',
      easeOutCubic: '0.215, 0.610, 0.355, 1.000',
      easeOutQuart: '0.165, 0.840, 0.440, 1.000',
      easeOutQuint: '0.230, 1.000, 0.320, 1.000',
      easeOutSine: '0.390, 0.575, 0.565, 1.000',
      easeOutExpo: '0.190, 1.000, 0.220, 1.000',
      easeOutCirc: '0.075, 0.820, 0.165, 1.000',
      easeOutBack: '0.175, 0.885, 0.320, 1.275',
      easeInOutQuad: '0.455, 0.030, 0.515, 0.955',
      easeInOutCubic: '0.645, 0.045, 0.355, 1.000',
      easeInOutQuart: '0.770, 0.000, 0.175, 1.000',
      easeInOutQuint: '0.860, 0.000, 0.070, 1.000',
      easeInOutSine: '0.445, 0.050, 0.550, 0.950',
      easeInOutExpo: '1.000, 0.000, 0.000, 1.000',
      easeInOutCirc: '0.785, 0.135, 0.150, 0.860',
      easeInOutBack: '0.680, -0.550, 0.265, 1.550'
    },
    uiComma: function (n) {
      //숫자 세자리수마다 , 붙이기
      var parts = n.toString().split(".");

      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    },
    partsAdd0: function (x) {
      //숫자 한자리수 일때 0 앞에 붙이기
      return Number(x) < 10 ? '0' + x : x;
    }
  };

  //jquery easing add
  var easings = {
    linear: function (t, b, c, d) { return c * t / d + b; },
    easeInQuad: function (t, b, c, d) { return c * (t /= d) * t + b; },
    easeOutQuad: function (t, b, c, d) { return -c * (t /= d) * (t - 2) + b; },
    easeInOutQuad: function (t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t + b; return -c / 2 * ((--t) * (t - 2) - 1) + b; },
    easeOutInQuad: function (t, b, c, d) { if (t < d / 2) return easings.easeOutQuad(t * 2, b, c / 2, d); return easings.easeInQuad((t * 2) - d, b + c / 2, c / 2, d); },
    easeInCubic: function (t, b, c, d) { return c * (t /= d) * t * t + b; },
    easeOutCubic: function (t, b, c, d) { return c * ((t = t / d - 1) * t * t + 1) + b; },
    easeInOutCubic: function (t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t + b; return c / 2 * ((t -= 2) * t * t + 2) + b; },
    easeOutInCubic: function (t, b, c, d) { if (t < d / 2) return easings.easeOutCubic(t * 2, b, c / 2, d); return easings.easeInCubic((t * 2) - d, b + c / 2, c / 2, d); },
    easeInQuart: function (t, b, c, d) { return c * (t /= d) * t * t * t + b; },
    easeOutQuart: function (t, b, c, d) { return -c * ((t = t / d - 1) * t * t * t - 1) + b; },
    easeInOutQuart: function (t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b; return -c / 2 * ((t -= 2) * t * t * t - 2) + b; },
    easeOutInQuart: function (t, b, c, d) { if (t < d / 2) return easings.easeOutQuart(t * 2, b, c / 2, d); return easings.easeInQuart((t * 2) - d, b + c / 2, c / 2, d); },
    easeInQuint: function (t, b, c, d) { return c * (t /= d) * t * t * t * t + b; },
    easeOutQuint: function (t, b, c, d) { return c * ((t = t / d - 1) * t * t * t * t + 1) + b; },
    easeInOutQuint: function (t, b, c, d) { if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b; return c / 2 * ((t -= 2) * t * t * t * t + 2) + b; },
    easeOutInQuint: function (t, b, c, d) { if (t < d / 2) return easings.easeOutQuint(t * 2, b, c / 2, d); return easings.easeInQuint((t * 2) - d, b + c / 2, c / 2, d); },
    easeInSine: function (t, b, c, d) { return -c * Math.cos(t / d * (Math.PI / 2)) + c + b; },
    easeOutSine: function (t, b, c, d) { return c * Math.sin(t / d * (Math.PI / 2)) + b; },
    easeInOutSine: function (t, b, c, d) { return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b; },
    easeOutInSine: function (t, b, c, d) { if (t < d / 2) return easings.easeOutSine(t * 2, b, c / 2, d); return easings.easeInSine((t * 2) - d, b + c / 2, c / 2, d); },
    easeInExpo: function (t, b, c, d) { return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001; },
    easeOutExpo: function (t, b, c, d) { return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b; },
    easeInOutExpo: function (t, b, c, d) { if (t === 0) return b; if (t == d) return b + c; if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005; return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b; },
    easeOutInExpo: function (t, b, c, d) { if (t < d / 2) return easings.easeOutExpo(t * 2, b, c / 2, d); return easings.easeInExpo((t * 2) - d, b + c / 2, c / 2, d); },
    easeInCirc: function (t, b, c, d) { return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b; },
    easeOutCirc: function (t, b, c, d) { return c * Math.sqrt(1 - (t = t / d - 1) * t) + b; },
    easeInOutCirc: function (t, b, c, d) { if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b; return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b; },
    easeOutInCirc: function (t, b, c, d) { if (t < d / 2) return easings.easeOutCirc(t * 2, b, c / 2, d); return easings.easeInCirc((t * 2) - d, b + c / 2, c / 2, d); },
    easeInElastic: function (t, b, c, d, a, p) { if (!t) return b; if ((t /= d) == 1) return b + c; var s, p = (!p || typeof (p) != 'number') ? d * .3 : p, a = (!a || typeof (a) != 'number') ? 0 : a; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else s = p / (2 * Math.PI) * Math.asin(c / a); return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; },
    easeOutElastic: function (t, b, c, d, a, p) { if (!t) return b; if ((t /= d) == 1) return b + c; var s, p = (!p || typeof (p) != 'number') ? d * .3 : p, a = (!a || typeof (a) != 'number') ? 0 : a; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else s = p / (2 * Math.PI) * Math.asin(c / a); return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b); },
    easeInOutElastic: function (t, b, c, d, a, p) { if (t === 0) return b; if ((t /= d / 2) == 2) return b + c; var s, p = d * (.3 * 1.5), a = 0; var s, p = (!p || typeof (p) != 'number') ? d * (.3 * 1.5) : p, a = (!a || typeof (a) != 'number') ? 0 : a; if (!a || a < Math.abs(c)) { a = c; s = p / 4; } else s = p / (2 * Math.PI) * Math.asin(c / a); if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b; return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b; },
    easeOutInElastic: function (t, b, c, d, a, p) { if (t < d / 2) return easings.easeOutElastic(t * 2, b, c / 2, d, a, p); return easings.easeInElastic((t * 2) - d, b + c / 2, c / 2, d, a, p); },
    easeInBack: function (t, b, c, d, s) { var s = (!s || typeof (s) != 'number') ? 1.70158 : s; return c * (t /= d) * t * ((s + 1) * t - s) + b; },
    easeOutBack: function (t, b, c, d, s) { var s = (!s || typeof (s) != 'number') ? 1.70158 : s; return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b; },
    easeInOutBack: function (t, b, c, d, s) { var s = (!s || typeof (s) != 'number') ? 1.70158 : s; if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b; return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b; },
    easeOutInBack: function (t, b, c, d, s) { if (t < d / 2) return easings.easeOutBack(t * 2, b, c / 2, d, s); return easings.easeInBack((t * 2) - d, b + c / 2, c / 2, d, s); },
    easeInBounce: function (t, b, c, d) { return c - easings.easeOutBounce(d - t, 0, c, d) + b; },
    easeOutBounce: function (t, b, c, d) { if ((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b; else if (t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b; else if (t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b; else return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b; },
    easeInOutBounce: function (t, b, c, d) { if (t < d / 2) return easings.easeInBounce(t * 2, 0, c, d) * .5 + b; else return easings.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b; },
    easeOutInBounce: function (t, b, c, d) { if (t < d / 2) return easings.easeOutBounce(t * 2, b, c / 2, d); return easings.easeInBounce((t * 2) - d, b + c / 2, c / 2, d); }
  };
  var easing;
  for (easing in easings) {
    $.easing[easing] = (function (easingname) {
      return function (x, t, b, c, d) {
        return easings[easingname](t, b, c, d);
      };
    })(easing);
  }

  // count number
  win[global] = win[global].uiNameSpace(namespace, {
    uiCountSlot: function (opt) {
      return createUiCountSlot(opt);
    }
  });
  function createUiCountSlot(opt) {
    var $base = $('#' + opt.id),
      countNum = !!opt.value === true ? opt.value : $base.text(),
      base_h = $base.outerHeight(),
      textNum = 0,
      len = countNum.toString().length,
      speed = !!opt.speed === true ? opt.speed + 's' : '1.0s',
      eff = !!opt.eff === true ? opt.eff : 'easeOutQuart',
      transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend',
      i = 0,
      step,
      // re, 
      timer,
      r;

    if ($base.data('ing') !== true) {

      $base.css('opacity', 1)

      textNum = win[global].option.uiComma(countNum);
      // base_h === 0 ? base_h = $base.text('0').outerHeight() : '';
      base_h === 0 ? base_h = $base.outerHeight() : '';
      $base.data('ing', true).empty().css('height', base_h);
      len = textNum.length;
      step = len;
      // re = Math.ceil(len / 9); 
      (step < 9) ? step = 9 - len : step = 1;

      // 숫자 단위만큼 
      for (i; i < len; i++) {
        var n = Number(textNum.substr(i, 1)),
          $thisNum, $base_div;

        if (isNaN(n)) {
          // 숫자가 아닐때 ', . ' 
          $base.append('<div class="n' + i + '"><div class="ui-count-og" style="top:' + base_h + 'px">' + textNum.substr(i, 1) + '</div></div>');
          $base.find('.n' + i).append('<span>' + textNum.substr(i, 1) + '</span>');
        }
        else {
          // 숫자일때
          $base.append('<div class="n' + i + '"><div class="ui-count-og" style="top:' + base_h + 'px">' + n + '</div></div>');
          $base.find('.n' + i).append('<span>9<br>8<br>7<br>6<br>5<br>4<br>3<br>2<br>1<br>0<br>' + n + '</span>');
          step = step + 1;
        }

        $base_div = $base.children('.n' + i);
        $base_div.find('span').wrapAll('<div class="ui-count-num" style="top:' + base_h + 'px; transition:top ' + speed + ' cubic-bezier(' + win[global].option.effect[eff] + ');"></div>');
        $thisNum = $base_div.find('.ui-count-num');
        $thisNum.data('height', $thisNum.height());
      }

      r = len;
      timer = setInterval(function () {
        count(r)
        r = r - 1;
        (r < 0) ? clearInterval(timer) : '';
      }, 150);


    }
    function count(r) {
      var $current_num = $base.children('.n' + r).find('.ui-count-num'),
        num_h = Number($current_num.data('height'));
      $current_num.css('top', (num_h - base_h) * -1);

      if (r === 0) {
        $current_num.one(transitionEnd, function () {
          $base.text(textNum).data('ing', false);
        });
      }
    }
  }

  // modal
  $plugins.modal = {
    gTarget: null,
    // gId: null,
    gModal: null,
    gWinH: null,
    gHtml: null,
    gScrollT: null,
    sFixedClass: 'ui-fixed',
    callback: null,
    scrollVal: function () {
      var o = this;
      // o.gScrollT = o.gHtml.scrollTop();
      o.gScrollT = $(window).scrollTop();
    },
    hideModal: function (direction) {
      var o = this;
      o.gHtml.removeClass(o.sFixedClass).removeAttr('style').scrollTop(o.gScrollT);

      if (!o.gTarget.hasClass('ui-full')) {
        $('.dimed').remove();
        o.gTarget.removeClass('active').removeAttr('style');
      } else {
        if (direction !== undefined && direction !== '') {
          o.gTarget.removeClass('active');
          setTimeout(function () {
            o.gTarget.removeAttr('style');
          }, 300);
        } else {
          o.gTarget.animate({
            opacity: 0
          }, 300, function () {
            o.gTarget.removeClass('active').removeAttr('style');
          });
        }
      }
    },
    showModal: function (direction) {
      var o = this;
      o.scrollVal();

      setTimeout(function () {
        o.gHtml.addClass(o.sFixedClass).height(o.gWinH).scrollTop(o.gScrollT);
      }, 100);

      if (!o.gTarget.hasClass('ui-full')) {
        if (!o.gHtml.hasClass(o.sFixedClass)) {
          $('body').append('<div class="dimed"></div>');
        } 

        // o.gTarget.height() 가 디바이스 높이 보다 크면 디바이스 높이의 60%로 높이 설정
        if (o.gTarget.height() >= o.gWinH) {
          o.gTarget.find('.modalContainer > .inner').height(o.gWinH * 0.6);
        }
        o.gTarget.css({
          'top': '50%',
          'marginTop': -(o.gTarget.height() / 2 - 30) + 'px'
        }).css({
          'marginTop': -(o.gTarget.height() / 2) + 'px',
          'opacity': 1
        });
        o.gTarget.addClass('active');
      }
      // position - bottom
      if (o.gTarget.hasClass('bottom')) {
        o.gTarget.css({
            'top': 'auto',
            'bottom': '0',
            'margin': '0',
        })
      }
      else {
        if (direction !== undefined && direction !== '') {
          o.gTarget.show().css('opacity', '1');
          setTimeout(function () {
            o.gTarget.addClass('active');
          }, 300);
        } else {
          o.gTarget.animate({
            opacity: 1
          }, 100);
          o.gTarget.addClass('active');
        }
      }
    },
    init: function (v, direction, callback) {
      var o = this;
      o.gTarget = $(v);
      o.gWinH = $(window).height();
      o.gHtml = $('body, html');

      if (direction !== undefined && direction !== '') {
        o.showModal(direction);
      } else {
        o.showModal();
      }

      if (typeof callback === 'function') {
        o.callback = callback;
        o.callback();
      }

      o.gTarget.find('.btn-close').off().on('click', function () {
        if (direction !== undefined) {
          o.hideModal(direction);
        } else {
          o.hideModal();
        }
      });
      $('.dimed').on('click', function () {
        o.hideModal();
      });

    }
  }

  // modal - alert
  $plugins.alert = function (id, msg) {
    var gId = $('#' + id),
      gCloseBtn = gId.find('.btn-close'),
      gMsg = gId.find('.msg');

    gMsg.html('').append(msg);

    $('body').append('<div class="dimed"></div>');

    gId.css({
      'top': '50%',
      'marginTop': -(gId.height() / 2 + 85) + 'px'
    }).show().css({
      'marginTop': -(gId.height() / 2 + 70) + 'px'
    });

    gCloseBtn.off('click.close').on('click.close', function () {
      gId.hide().removeAttr('style');
      $('.dimed').remove();
    });
  }

  // modal - confirm
  $plugins.confirm = function (id, msg, callback) {
    var gId = $('#' + id),
      gCancelBtn = gId.find('.btn-close').eq(0),
      gConfirmBtn = gId.find('.btn-close').eq(1),
      gMsg = gId.find('.msg');

    if (msg !== undefined) {
      gMsg.html('').append(msg);
    }

    $('body').append('<div class="dimed"></div>');

    gId.css({
      'top': '50%',
      'marginTop': -(gId.height() / 2 + 85) + 'px'
    });
    gId.show().css({
      'marginTop': -(gId.height() / 2 + 70) + 'px'
    });

    if (typeof callback === 'function') {
      callback();
    }

    // gConfirmBtn.off('click.close').on('click.close', function() {
    //     gId.hide().removeAttr('style');
    //     $('.dimed').remove();

    //     if(typeof callback === 'function') {
    //         callback(true);
    //     }
    // });

    // gCancelBtn.off('click.close').on('click.close', function() {
    //     gId.hide().removeAttr('style');
    //     $('.dimed').remove();

    //     if(typeof callback === 'function') {
    //         callback(false);
    //     }
    // });
  }

  // input[type=date]에 active 넣어주기
  $plugins.focusDate = function () {
    var gTarget = $('.ui-date-group'),
      gItem = gTarget.find('input[type=date]');
    gTarget.on('focusin', function () {
      $(this).addClass('active');
    }).on('focusout', function () {
      if (gItem.val() === '') {
        $(this).removeClass('active');
      } else {
        $(this).removeClass('active').addClass('actived');
      }
    });
  }

  // radio 부모에 checked 넣어주기
  $plugins.radioFn = function () {
    var gParent = $('.ui-radio-group'),
      gTarget = gParent.find('.ui-item'),
      gRadio = gTarget.find('input[type=radio]');

    gRadio.each(function () {
      var $t = $(this);
      if ($t.is(':checked')) {
        $t.closest(gTarget).addClass('checked');
      }
    });

    gRadio.off('click').on('click', function () {
      // if($(this).is(':checked')) {
      $(this).closest(gParent).find(gTarget).removeClass('checked');
      $(this).closest(gTarget).addClass('checked');
      // }
    });
  }

  // select에 active 넣어주기
  $plugins.selectFn = function () {
    var gTarget = $('.ui-selects, .ui-select');
    gTarget.on('focusin', function () {
      $(this).removeClass('actived').addClass('active');
    }).on('focusout', function () {
      if ($(this).val() === '') {
        $(this).removeClass('active');
      } else {
        $(this).removeClass('active').addClass('actived');
      }
    });

    gTarget.each(function (i) {
      if (gTarget.eq(i).val() !== '') {
        gTarget.eq(i).addClass('actived');
      }
    });
  }

  // 검색 결과 리스트 더보기
  $plugins.resultMore = function () {
    var gTarget = '.resultList > li',
      gBtn = $(gTarget).find('.ui-btn.typeMore, .ui-btn.typeClose');

    gBtn.off('click.listMore').on('click.listMore', function () {
      var gMyParent = $(this).closest(gTarget);
      if (gMyParent.hasClass('active')) {
        gMyParent.removeClass('active');
      } else {
        gMyParent.addClass('active');

        // 활성화 후 페이지 스크롤
        $plugins.pageScroll(gMyParent);
      }
    });
  }

  // 유의사항
  $plugins.caution = function () {
    var gTarget = '.ui-caution',
      gCnt = $(gTarget).find('>dd'),
      gBtn = $(gTarget).find('dt .ui-btn'),
      gBtnTxt = gBtn.find('span');

    $(gTarget).each(function (j) {
      var $t = $(this);
      if ($t.hasClass('active')) {
        $t.removeClass('active');
        setTimeout(function () {
          gBtn.eq(j).trigger('click');
        }, 300);
      }
      gBtn.eq(j).off('click.caution').on('click.caution', function () {
        activeFn($(this));
      });
    });

    var activeFn = function (v) {
      var gMyParent = v.closest(gTarget),
        gMyCnt = $(gMyParent).find('>dd'),
        gMyBtn = $(gMyParent).find('dt .ui-btn'),
        gMyBtnTxt = gMyBtn.find('span');

      if (gMyParent.hasClass('active')) {
        gMyParent.removeClass('active');
        gMyCnt.height(0);
        gMyBtnTxt.html('펼치기');
      } else {
        gMyParent.addClass('active');

        var sumH = 0;
        for (var i = 0, len = gMyParent.find('dd').children.length; i < len; i++) {
          sumH += gMyParent.find('dd').children().eq(i).outerHeight();
        }
        gMyCnt.height(sumH);
        gMyBtnTxt.html('접기');

        if (event !== undefined) {
          // 활성화 후 페이지 스크롤
          setTimeout(function () {
            if (gMyBtn.closest('.ui-full').length) {
              $plugins.pageScroll(gMyParent, gMyBtn.closest('.ui-full').find('.modalContainer'));
            } else {
              $plugins.pageScroll(gMyParent);
            }
          }, 300);
        }
      }
    }
  }

  // accodian, 아코디언
  $plugins.acco = function (callback) {
    var gTarget = '.ui-acco-wrap',
      gCnt = $(gTarget).find('>.ui-acco-content'),
      gBtn = $(gTarget).find('.ui-acco-header .ui-btn'),
      gBtnTxt = gBtn.find('span');

    gBtn.off('click.acco').on('click.acco', function () {
      var gMyParent = $(this).closest(gTarget),
        gMyCnt = $(gMyParent).find('>.ui-acco-content'),
        gMyBtn = $(gMyParent).find('.ui-acco-header .ui-btn'),
        gMyBtnTxt = gMyBtn.find('span');

      if (gMyParent.hasClass('active')) {
        gMyParent.removeClass('active');
        gMyCnt.height(0);
        gMyBtnTxt.html('펼치기');
      } else {
        gMyParent.addClass('active');

        var sumH = 0;
        for (var i = 0, len = gMyParent.find('.ui-acco-content').children.length; i < len; i++) {
          sumH += gMyParent.find('.ui-acco-content').children().eq(i).outerHeight();
        }
        gMyCnt.height(sumH + 5);
        gMyBtnTxt.html('접기');

        // 활성화 후 페이지 스크롤
        setTimeout(function () {
          $plugins.pageScroll(gMyParent);
        }, 300);
      }
    });

    if (typeof callback === 'function') {
      callback();
    }
  }

  $plugins.pageScroll = function (v, tg) {
    var $win = $(window),
      $wT = $win.scrollTop(), // window 스크롤값
      $wH = $win.height(), // window 높이값
      $hH = $('.mmctHeader').innerHeight(), // 페이지 헤더 높이값
      $t = $(v),
      $top = $t.positionInfo(), // offset top
      $tH = $t.innerHeight(),
      $wAH = $wT + $wH, // window 스크롤값 + window 높이값
      $tAH = $top + $tH,
      $floatingBtnH = $('.floatingBtn').innerHeight(),
      sExpresstion1, sExpresstion2,
      scrollTarget, $scrollTargetTop;

    ($t.parent('.mmctContainer').hasClass('hasFloatingBtn')) // hasFloatingBtn가 있는지에 따라 조건식 다르게
      ? sExpresstion1 = $wAH - $floatingBtnH < $top + $tH
      : sExpresstion1 = $wAH < $top + $tH;

    if (sExpresstion1) {
      if (tg !== undefined) {
        sExpresstion2 = $tH > $wH;
        scrollTarget = tg;
        $scrollTargetTop = $(scrollTarget).scrollTop();
      } else {
        sExpresstion2 = $tH > ($wH - $hH - $floatingBtnH);
        scrollTarget = 'html, body';
        $scrollTargetTop = $wT;
      }

      if (sExpresstion2) {
        $(scrollTarget).animate({ // modal, 가맹점 승인서 유의사항, 신용카드 취급 유의사항, 내용이 긴 경우
          scrollTop: $scrollTargetTop - ($wT - $top) - $hH
        }, 300);
      } else {
        $(scrollTarget).animate({
          scrollTop: $scrollTargetTop - ($wAH - $tAH) + $floatingBtnH
        }, 300);
      }
    }
  }

  // offset top 만큼 스크롤하기
  $plugins.scrollThis = function (v, tg) {
    var $t = $(v),
      $top = $t.positionInfo(),
      $headerH,
      scrollTarget = $(tg),
      scrollTargetContainer;
    if (tg !== undefined) {
      $headerH = scrollTarget.find('.modalHeader').innerHeight();
      if (scrollTarget.hasClass('ui-full')) {
        scrollTargetContainer = scrollTarget.find('.modalContainer');
      } else {
        $top = $t.positionInfo() - scrollTarget.positionInfo();
        scrollTargetContainer = scrollTarget.find('.modalContainer > .inner');
      }

      scrollTargetContainer.animate({
        scrollTop: ($top - $headerH - 20)
      }, 300);
    } else {
      $headerH = $('.mmctHeader').innerHeight();
      $('html, body').animate({
        scrollTop: ($top - $headerH - 20)
      }, 300);
    }
  }

  // 객체의 offset().top 구하기
  $.fn.positionInfo = function () {
    return $(this).offset().top;
  }

  // 공통 입력창(레이블 클릭시 입력창 형태 변경)
  $.fn.uiForm = function () {
    return this.each(function () {
      $plugins.uiForm = {
        gTarget: null,
        gClickObj: null,
        gfocusObj: null,
        gClearObj: null,
        flag: null,
        clearFn: function (v) {
          var o = this, $t = $(v);
          $t.siblings(o.gfocusObj).val('').focus();
          $t.closest(o.gTarget).removeClass('writing');
          // o.flag = false;
        },
        writingFn: function (v) {
          var o = this, $t = $(v);
          // o.flag = true;
          if ($t.val() !== '') {
            $t.closest(o.gTarget).addClass('writing');
            // o.flag = true;

            if ($t.context.localName == 'textarea') {
              if (event.keyCode === 13) {
                $t.closest(o.gTarget).css('height', 'auto');
                $t.innerHeight('140px');
              }
            }
          } else {
            $t.closest(o.gTarget).removeClass('writing');
            // o.flag = false;

            if ($t.context.localName == 'textarea') {
              $t.innerHeight('33px');
            }
          }
        },
        activeFn: function (v) {
          var o = this;
          $(v).closest(o.gTarget).removeClass('actived').addClass('active');

          setTimeout(function () { // 키보드 올라오는 시간을 감안
            var $h, $ih, $tih;
            // 부모에 'hasFloatingBtn' 클래스가 있는지 판단
            $(v).closest('.hasFloatingBtn').length ? $h = $('.floatingBtn').innerHeight() + 10 : $h = 0;

            $ih = window.innerHeight - $h; // 키보드 올라온 상테의 window.innerHeight (플로팅 버튼 영역 제외)

            $tih = $(v).offset().top - $(window).scrollTop() + $(v).parent(o.gTarget).outerHeight(); // 포커스 요소의 화면상 top 값 + 부모 영역 높이

            if ($tih > $ih) {
              // 포커스 요소 보이게 스크롤
              $('body, html').animate({
                scrollTop: $(window).scrollTop() + $tih - $ih
              }, 300);
            }
          }, 400);
        },
        inActiveFn: function (v) {
          var o = this, $t = $(v);

          setTimeout(function () {
            if (!o.flag) {
              if ($t.val() === '') {
                $t.closest(o.gTarget).removeClass('active');
              } else {
                $t.closest(o.gTarget).removeClass('active').addClass('actived');
              }
            }
          }, 100);
        },
        fixedCancelFn: function (bool) {
          bool ? $('.floatingBtn').addClass('fixedCancel') : $('.floatingBtn').removeClass('fixedCancel');
        },
        init: function (v) {
          var o = this;
          o.flag = false;
          o.gTarget = $(v);
          o.gfocusObj = o.gTarget.find('>input, >textarea');
          o.gClearObj = o.gTarget.find('>.typeClear');

          if (o.gTarget.hasClass('noEffect')) {
            o.gClickObj = o.gTarget.find('>input');
          } else {
            o.gClickObj = o.gTarget.find('>label');
          }

          o.gfocusObj.off('keyup.active').on('keyup.active', function () {
            // readonly 일 경우 제외
            if (!$(this).prop('readonly')) {
              o.writingFn(this);
            }
          });
          o.gfocusObj.off('focus.active').on('focus.active', function () {
            // readonly 일 경우 제외
            if (!$(this).prop('readonly')) {
              o.activeFn(this);
            }
          });
          o.gfocusObj.off('focusout.active').on('focusout.active', function () {
            // readonly 일 경우 제외
            if (!$(this).prop('readonly')) {
              o.inActiveFn(this);
              o.writingFn(this);
            }
          });
          o.gTarget.on('focusin', function () {
            o.flag = true;
            o.fixedCancelFn(true);
          });
          o.gTarget.on('focusout', function () {
            o.flag = false;
            o.fixedCancelFn(false);
          });
          o.gClearObj.off('click.delete').on('click.delete', function () {
            // console.log('clear')
            o.clearFn(this);
          });

          // input 에 value 가 있을 경우 활성화
          // o.gfocusObj.val()
          o.gfocusObj.each(function (i) {
            if (o.gfocusObj.eq(i).val() !== '') {
              o.gfocusObj.eq(i).closest(o.gTarget).addClass('actived');
              o.gfocusObj.eq(i).focus(function () {
                o.gfocusObj.eq(i).closest(o.gTarget).addClass('writing');
              });
            }
            // disabled 일 경우 ui-form 에 disabled 클래스 추가
            if (o.gfocusObj.eq(i).prop('disabled')) {
              o.gfocusObj.eq(i).closest(o.gTarget).addClass('disabled');
            }
            // readonly 일 경우 ui-form 에 readonly 클래스 추가
            if (o.gfocusObj.eq(i).prop('readonly')) {
              o.gfocusObj.eq(i).closest(o.gTarget).addClass('readonly');
            }
          });

        }
      }
      $plugins.uiForm.init(this);
    });
  }

  // 공통 입력창 리셋 reset (input text, num, radio)
  // $plugins.uiFormReset('#userName','#birthDate','gender','local');
  $plugins.uiFormReset = function () {
    // 넘어온 arguments 값에 #이 있으면 id 로 간주, 없으면 name 으로 간주함.
    var t = arguments,
      len = t.length;
    for (var i = 0; i < len; i++) {
      if (t[i].substr(0, 1) == '#') {
        $(t[i]).closest('.ui-form').removeClass('active writing actived');
        $(t[i]).val('');
      } else {
        $('[name=' + t[i] + ']').eq(0).click();
      }
    }
  }
  // 공통 약관 전체선택
  $.fn.uiCheckAll = function () {
    return this.each(function () {
      $plugins.uiCheckAll = {
        gTarget: null,
        gAllObj: null,
        gItemObj: null,
        gLength: null,
        gCheckedLength: 0,
        gList: null,
        gCnt: null,
        gBtn: null,
        checkAllFn: function (v) {
          var o = this,
            $t = $(v),
            $boolean = $t.is(':checked'),
            $parent = $t.parent();

          o.gItemObj.prop('checked', $boolean);
          if ($boolean) {
            o.gCheckedLength = o.gLength;
            $parent.addClass('ez-checked');
            o.gItemObjParent.addClass('ez-checked');
          } else {
            o.gCheckedLength = 0;
            $parent.removeClass('ez-checked');
            o.gItemObjParent.removeClass('ez-checked');
          }
        },
        checkItemFn: function (v) {
          var o = this,
            $t = $(v),
            $boolean = $t.is(':checked'),
            $parent = $t.parent();

          if ($boolean) {
            o.gCheckedLength = o.gCheckedLength + 1;
            $parent.addClass('ez-checked');
          } else {
            o.gCheckedLength = o.gCheckedLength - 1;
            $parent.removeClass('ez-checked');
          }

          if (o.gCheckedLength === o.gLength) {
            o.gAllObj.prop('checked', true);
            o.gAllObjParent.addClass('ez-checked');
          } else {
            o.gAllObj.prop('checked', false);
            o.gAllObjParent.removeClass('ez-checked');
          }
        },
        viewFn: function (v) {
          var o = this,
            $t = $(v),
            $parent = $t.parent();

          if (!$parent.hasClass('active')) {
            o.gList.removeClass('active actived');
            o.gCnt.removeAttr('style');

            $parent.addClass('active');
            $parent.find('.agreementContent').animate({
              height: $('.active .agreementScroll .inner').innerHeight() + 15
            }, 250, function () {
              $parent.addClass('actived');

              // 활성화 후 페이지 스크롤
              setTimeout(function () {
                $plugins.pageScroll(o.gTarget);
              }, 300);
            });
          } else {
            $parent.find('.agreementContent').animate({
              height: 0
            }, 250, function () {
              $parent.removeClass('active actived');
            });
          }
        },
        init: function (v) {
          var o = this;
          o.gTarget = $(v);
          o.gAllObjParent = o.gTarget.find('.chk-all .ez-chkbox');
          o.gAllObj = o.gAllObjParent.find('input[type=checkbox]');
          o.gItemObjParent = o.gTarget.find('.chklist .ez-chkbox');
          o.gItemObj = o.gItemObjParent.find('input[type=checkbox]');
          o.gLength = o.gItemObj.length;
          o.gList = o.gTarget.find('.chklist > ul > li');
          o.gCnt = o.gList.find('.agreementContent');
          o.gBtn = o.gTarget.find('.chklist .ui-view');

          // 전체 체크, 체크 해제
          o.gAllObj.on('click.allChk', function () {
            o.checkAllFn(this);
          });

          // 개별 체크
          o.gItemObj.on('click.itemChk', function () {
            o.checkItemFn(this);
          });

          //o.gBtn.on('click', function() {
          // o.viewFn(this);
          //});
        }
      }
      $plugins.uiCheckAll.init(this);
    });
  }

  // 평가, 별점, 이메일 상담 내역 상세
  $.fn.uiRating = function () {
    return this.each(function () {
      $plugins.uiRating = {
        gTarget: null,
        gItemObjParent: null,
        gItemObj: null,
        gLength: null,
        gCheckedLength: 0,
        checkItemFn: function (v) {
          var o = this,
            $t = $(v),
            $boolean = $t.is(':checked'),
            $parent = $t.closest('.ui-item'),
            $idx = o.gItemObj.index($t);

          if ($boolean) {

            o.gItemObj.each(function (i) {
              if ($idx > i) {
                // console.log($idx)
                o.gItemObj.eq(i).prop('checked', true);
                o.gItemObj.eq(i).closest('.ui-item').addClass('checked');
              }
            });

            o.gCheckedLength = o.gCheckedLength + 1;
            $parent.addClass('checked');
          } else {

            o.gItemObj.each(function (i) {
              if ($idx < i) {
                // console.log($idx)
                o.gItemObj.eq(i).prop('checked', false);
                o.gItemObj.eq(i).closest('.ui-item').removeClass('checked');
              }
            });

            o.gCheckedLength = o.gCheckedLength - 1;
            $parent.removeClass('checked');
          }
        },
        init: function (v) {
          var o = this;
          o.gTarget = $(v);
          o.gItemObjParent = o.gTarget.find('.ui-item');
          o.gItemObj = o.gItemObjParent.find('input[type=checkbox]');
          o.gLength = o.gItemObj.length;

          // 개별 체크
          o.gItemObj.on('click.itemChk', function () {
            o.checkItemFn(this);
          });
        }
      }
      $plugins.uiRating.init(this);
    });
  }

  // tooltip
  $.fn.uiToolTip = function () {
    return this.each(function () {
      var $t = $(this),
        _parent = '.ui-tooltip-wrap',
        _tooltip = '.toolTip',
        _edge = '.toolTip > i',
        _closeBtn = '.typeModalClose',
        $parent = $t.closest(_parent),
        $tootip = $t.closest(_parent).find(_tooltip),
        $edge = $t.closest(_parent).find(_edge),
        $closeBtn = $tootip.find(_closeBtn);

      $t.on('click', function () {
        $tootip.show();
        $edge.css('left', $t.offset().left - $tootip.offset().left);
        setTimeout(function () {
          $parent.addClass('active');
        }, 300);

        $closeBtn.on('click', function () {
          $parent.removeClass('active');
          setTimeout(function () {
            $tootip.hide();
          }, 100);
        });
      });
    });
  }

  // tab
  $.fn.uiTab = function (btncallback) {
    return this.each(function () {
      $plugins.uiTab = {
        gTarget: null,
        _activeClass: null,
        _clickObj: null,
        $activeObj: null,
        $clickObj: null,
        $activeIdx: null,
        $prevIdx: null,
        $idArray: [],
        $tabLength: null,
        $href: null,
        tabShow: function (v) {
          var o = this,
            idx = o.$clickObj.index(v);

          o.$activeObj.removeClass('active');
          $('#' + o.$idArray[o.$prevIdx]).hide();

          $(v).parent().addClass('active');
          $('#' + o.$idArray[idx]).show();
          o.$activeIdx = idx;
          o.$prevIdx = o.$activeIdx;
          o.$activeObj = o.gTarget.find(o._activeClass);

          if (typeof btncallback === 'function') {
            btncallback();
          }
        },
        init: function (v) {
          var o = this;
          o.gTarget = $(v);
          o._activeClass = '.active';
          o._clickObj = '.ui-tab-link';
          o.$activeObj = o.gTarget.find(o._activeClass);
          o.$clickObj = o.gTarget.find(o._clickObj);
          o.$activeIdx = o.$clickObj.parent().index(o.$activeObj);
          o.$tabLength = o.$clickObj.length;

          o.$clickObj.each(function (i) {
            o.$href = o.$clickObj.eq(i).attr('href');
            var str = o.$href.substring(1, o.$href.length);
            o.$idArray.push(str);
            $('#' + str).hide();
          });

          // active 내용 보이기
          $('#' + o.$idArray[o.$activeIdx]).show();
          o.$prevIdx = o.$activeIdx;

          o.$clickObj.on('click', function (e) {
            e.preventDefault();
            o.tabShow(this)
          });
        }
      }
      $plugins.uiTab.init(this);
      /*
      var $t = $(this),
          _activeClass = '.active',
          _clickObj = '.ui-tab-link',
          $activeObj = $t.find(_activeClass),
          $clickObj = $t.find(_clickObj),
          $activeIdx = $clickObj.parent().index($activeObj),
          $prevIdx,
          $idArray = [],
          $tabLength = $clickObj.length,
          $href;
      
      $clickObj.each(function() {
          $href = $(this).attr('href');
          var str = $href.substring(1,$href.length);
          $idArray.push(str);
          $('#'+str).hide();
      });

      // active 내용 보이기
      $('#'+$idArray[$activeIdx]).show();
      $prevIdx = $activeIdx;

      $clickObj.on('click', function(e) {
          e.preventDefault();

          var idx = $clickObj.index(this);
          
          $activeObj.removeClass('active');
          $('#'+$idArray[$prevIdx]).hide();

          $(this).parent().addClass('active');
          $('#'+$idArray[idx]).show();
          $activeIdx = idx;
          $prevIdx = $activeIdx;
          $activeObj = $t.find(_activeClass);

          if(typeof btncallback === 'function') {
              btncallback();
          }
      });
      */
    });
  }

  //progressbar
  $.fn.uiProgressbar = function () {
    var getPercent = ($('.progress-cont').data('progress-percent') / 100);
    var getProgressWrapWidth = $('.progress-cont').width();
    var progressTotal = getPercent * getProgressWrapWidth;
    var animationLength = 1000;

    $('.progress-bar').stop().animate({
      left: progressTotal
    }, animationLength);
  }

  // floating 버튼 상위(부모)에 'hasFloatingBtn' 클래스 넣어주기
  // 부모가 form 인 경우 form 의 부모를 선택함
  $plugins.floatClass = function () {
    var gTarget = $('.floatingBtn'),
      sClassName = 'hasFloatingBtn',
      gParent = gTarget.parent(),
      gArrary = ['mmctContainer', 'ui-modal', 'fullWrap'];

    for (var i = 0, len = gArrary.length - 1; i <= len; i++) {
      if (gParent.hasClass(gArrary[i])) {
        gTarget.parent($(gArrary[i])).addClass(sClassName);
      } else if (gParent.is('form')) {
        gParent.parent().addClass(sClassName);
      }
    }
  }

  // 전체메뉴, gnb
  $plugins.gnbNavi = {
    gOpenBtn: null,
    gCloseBtn: null,
    gNavi: null,
    gWinH: null,
    gHtml: null,
    gScrollT: null,
    gEventObj: null,
    sFixedClass: 'ui-fixed',
    sActiveClass: 'active',
    sActivedClass: 'actived',
    scrollVal: function () {
      var o = this;
      // o.gScrollT = o.gHtml.scrollTop();
      o.gScrollT = $(window).scrollTop();
    },
    showNavi: function () {
      var o = this;
      o.scrollVal();
      o.gNavi.addClass(o.sActiveClass);
      setTimeout(function () {
        o.gNavi.addClass(o.sActivedClass);
        setTimeout(function () {
          o.gHtml.addClass(o.sFixedClass).height(o.gWinH).scrollTop(o.gScrollT);
        }, 500);
      }, 100);

      o.showEvent();
    },
    hideNavi: function () {
      var o = this;
      o.gEventObj.removeClass('load').removeAttr('style');
      o.gHtml.removeClass(o.sFixedClass).removeAttr('style').scrollTop(o.gScrollT);
      o.gNavi.removeClass(o.sActivedClass);
      setTimeout(function () {
        o.gNavi.removeClass(o.sActiveClass);
      }, 500);

      // 하단 이벤트 배너 스크롤 효과 제거
      o.gEventObj.scrollLookFn(false, '.gnbNavi');
    
    },
    showEvent: function () {
      var o = this;

      setTimeout(function () {
        o.gEventObj.addClass('load');
        o.gNavi.css('paddingBottom', o.gEventObj.innerHeight());

        // 하단 이벤트 배너 스크롤 효과 실행
        o.gEventObj.scrollLookFn(true, '.gnbNavi');
      }, 1000);
    },
    init: function () {
      var o = this;
      o.gNavi = $('.mmctHeader .gnbNavi');
      o.gOpenBtn = $('.mmctHeader .btnMenu');
      o.gCloseBtn = $('.mmctHeader .btnClose');
      o.gWinH = $(window).height();
      o.gHtml = $('body, html');
      o.gEventObj = $('.eventSec');

      o.gOpenBtn.on('click', function () {
        o.showNavi();
      });
      o.gCloseBtn.on('click', function () {
        o.hideNavi();
      });

    }
  }

  // 객체의 위치 구해서 active 클래스 넣어주기
  $.fn.addActive = function () {
    return this.each(function () {
      var $win = $(window),
        $wT = $win.scrollTop(),
        $wH = $win.height(),
        $t = $(this),
        $class = ['.dash', 'active'];

      if ($wH + $wT > $t.positionInfo() - 50) {
        $t.children($class[0]).length
          ? $t.children($class[0]).addClass($class[1])
          : $t.addClass($class[1]);

        if ($t.hasClass('imgEffect') || $t.hasClass('mainFullArea')) {
          $t.addClass($class[1]);
        }
      }
      // else {
      //     $t.children($class[0]).length
      //         ? $t.children($class[0]).removeClass($class[1])
      //         : $t.removeClass($class[1]);
      // }
    });
  }

  // 이벤트 상세 패럴렉스
  $.fn.parallaxEvent = function () {
    return this.each(function () {
      var $win = $(window),
        $wT = $win.scrollTop(),
        $t = $(this),
        $tH = $t.innerHeight(),
        $val;
      $val = 1 - ($wT / $tH);
      if ($wT <= $tH) {
        $t.children().css({ 'opacity': $val });
      } else {
        $t.children().css({ 'opacity': 0 });
      }
    });
  }

  // 스크롤시 전체메뉴의 하단 이벤트 배너 감추기
  $plugins.scrollLookTimer = '';
  $.fn.scrollLookFn = function (flag, scrollTargetElement) {
    return this.each(function () {
      var $t = $(this), scrollTarget, didScroll;
      var intervalFn = function () {
        $plugins.scrollLookTimer = setInterval(function () {
          if (didScroll) {
            $t.removeClass('load').removeAttr('style');
            didScroll = false;
          } else {
            $t.addClass('load').css({ 'top': 'calc(100% - ' + ($t.height() - 5) + 'px)' });
          }
        }, 500);
      }
      if (flag) {
        scrollTargetElement === undefined ? scrollTarget = window : scrollTarget = scrollTargetElement;
        $(scrollTarget).on('scroll.lock', function () {
          didScroll = true;
        });
        intervalFn();
      } else {
        $(scrollTarget).off('scroll.lock');
        clearInterval($plugins.scrollLookTimer);
      }
    });
  }
  // 스크롤시 하단 알리미 감추기
  $plugins.scrollLookFn = {
    gTarget: null,
    didScroll: null,
    timer: null,
    intervalFn: function () {
      var o = this;
      o.timer = setInterval(function () {
        if (o.didScroll) {
          o.gTarget.removeClass('load');
          o.didScroll = false;
        } else {
          o.gTarget.addClass('load');
        }
      }, 500);
    },
    init: function (flag, v, scrollTargetElement) {
      /*
          flag: true || false
          v : target
          scrollTargetElement : 부모창이 아닌 경우(모달?) classname or id
      */
      var o = this, scrollTarget;
      o.gTarget = v;
      if (flag) {
        scrollTargetElement === undefined ? scrollTarget = window : scrollTarget = scrollTargetElement;
        $(scrollTarget).on('scroll.lock', function () {
          o.didScroll = true;
        });
        o.intervalFn();
      } else {
        $(scrollTarget).off('scroll.lock');
        clearInterval(o.timer);
      }
    }
  }

  // run
  $(doc).ready(function () {
    $plugins.device.deviceClass();
    $plugins.device.osClass();
    $plugins.gnbNavi.init();
    $plugins.focusDate();
    $plugins.radioFn();
    $plugins.selectFn();
    $plugins.caution();
    $plugins.acco();
    $plugins.resultMore();
    $('.ui-form').uiForm();
    $plugins.floatClass();
    
  });

})(window, document);