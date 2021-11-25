/* **********************************************************************
	NETIVE UI  : nameSpace 생성
********************************************************************** */
;(function(win, doc){
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
        deviceClass: function() {
            var devsize = [1920, 1600, 1440, 1280, 1024, 960, 840, 720, 600, 480, 400, 360];
            var html5tags = ['article', 'aside', 'details', 'figcaption', 'figure', 'footer', 'header', 'hgroup', 'nav', 'main', 'section', 'summary'];
            var width = document.documentElement.offsetWidth,
                colClass = width >= devsize[5] ? 'col12' : width > devsize[8] ? 'col8' : 'col4',
                size_len = devsize.length,
                max = html5tags.length,
                sizeMode,
                timer;

            win[global].breakpoint = width >= devsize[5] ? true : false;

            var deviceSizeClassName = function(w) {
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
            win.addEventListener('resize', function() {
                clearTimeout(timer);			
                timer = setTimeout(function () {
                    var dcHtml = doc.querySelector('html');
                    
                    width = win.innerWidth; 
                    // document.body.offsetWidth === $(win).outerWidth()
                    // win.innerWidth : scroll 포함된 width (+17px)
                    // win.outerWidth === screen.availWidth 
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
        osClass: function() {
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
        
            //touch, mobile 환경 구분
            support.touch = browser.ios || browser.android || (doc.ontouchstart !== undefined && doc.ontouchstart !== null);
            browser.mobile = support.touch && ( browser.ios || browser.android);
            //navigator.platform ? filter.indexOf(navigator.platform.toLowerCase()) < 0 ? browser.mobile = false : browser.mobile = true : '';
            
            //false 삭제
            // for (j in browser) {
            // 	if (!browser[j]) {
            // 		delete browser[j]
            // 	}
            // }
            
            //os 구분
            browser.os = (navigator.appVersion).match(/(mac|win|linux)/i);
            browser.os = browser.os ? browser.os[1].toLowerCase() : '';
        
            //version 체크
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
                browser.ie = ie = parseInt( ie[1] || ie[2] );
                ( 11 > ie ) ? support.pointerevents = false : '';
                ( 9 > ie ) ? support.svgimage = false : '';
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

    // 실행
    $plugins.device.deviceClass();
    $plugins.device.osClass();





})(window, document);
