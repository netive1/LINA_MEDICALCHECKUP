'use strict';

//Polyfill

if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }
  
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
  
      do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

if (!Object.create) {
	Object.create = function (o) {
		if (arguments.length > 1) {
			throw new Error('Sorry the polyfill Object.create only accepts the first parameter.');
		}
		function F() {}
		F.prototype = o;
		return new F();
	};
}
if (!Array.indexOf){ 
	Array.prototype.indexOf = function(obj){ 
		for(var i=0; i<this.length; i++){ 
			if(this[i]==obj){ return i; } 
		} 
		return -1; 
	};
}
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(callback,thisArg) {
		var T,k;
		if(this === null) {
			throw new TypeError('error');
		}
		var O = Object(this);
		var len = O.length >>> 0;
		if(typeof callback !== "function"){
			throw new TypeError('error');
		}
		if(arguments.length > 1){
			T = thisArg;
		}
		k = 0;
		while(k < len){
			var kValue;
			if(k in O) {
				kValue = O[k];
				callback.call(T, kValue, k, O);
			}
			k++;
		}
	};
}
if (!Array.isArray) {
	Array.isArray = function(arg){
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}
if (!Object.keys){
	Object.keys = (function() {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({ toDtring : null }).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'varructor'
			],
			dontEnumsLength = dontEnums.length;
		
		return function(obj) {
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non=object');
			}
			var result = [], prop, i;
			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}
			if (hasDontEnumBug) {
				for (i=0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}()); 
}

//utils module
;(function (win, doc, undefined) {

	'use strict';

	const global = 'netive';

	win[global] = {};

	const Global = win[global];
	const UA = navigator.userAgent.toLowerCase();
	const deviceSize = [1920, 1600, 1440, 1280, 1024, 960, 840, 720, 600, 480, 400, 360];
	const deviceInfo = ['android', 'iphone', 'ipod', 'ipad', 'blackberry', 'windows ce', 'windows','samsung', 'lg', 'mot', 'sonyericsson', 'nokia', 'opeara mini', 'opera mobi', 'webos', 'iemobile', 'kfapwi', 'rim', 'bb10'];
	//const filter = "win16|win32|win64|mac|macintel";

	//requestAnimationFrame
	win.requestAFrame = (function () {
		return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame ||
			//if all else fails, use setTimeout
			function (callback) {
				return win.setTimeout(callback, 1000 / 60); //shoot for 60 fp
			};
	})();
	win.cancelAFrame = (function () {
		return win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame ||
			function (id) {
				win.clearTimeout(id);
			};
	})();

	//components state 
	Global.callback = {};

	Global.state = {
		device: {
			info: (function() {
				for (let i = 0, len = deviceInfo.length; i < len; i++) {
					if (UA.match(deviceInfo[i]) !== null) {
						return deviceInfo[i];
					}
				}
			})(),
			width: window.innerWidth,
			height: window.innerHeight,
			breakpoint: null,
			colClass: null,
			ios: (/ip(ad|hone|od)/i).test(UA),
			android: (/android/i).test(UA),
			app: UA.indexOf('appname') > -1 ? true : false,
			touch: null,
			mobile: null,
			os: (navigator.appVersion).match(/(mac|win|linux)/i)
		},
		browser: {
			ie: UA.match(/(?:msie ([0-9]+)|rv:([0-9\.]+)\) like gecko)/i),
			local: (/^http:\/\//).test(location.href),
			firefox: (/firefox/i).test(UA),
			webkit: (/applewebkit/i).test(UA),
			chrome: (/chrome/i).test(UA),
			opera: (/opera/i).test(UA),
			safari: (/applewebkit/i).test(UA) && !(/chrome/i).test(UA),	
			size: null
		},
		keys: { 
			tab: 9, 
			enter: 13, 
			alt: 18, 
			esc: 27, 
			space: 32, 
			pageup: 33, 
			pagedown: 34, 
			end: 35, 
			home: 36, 
			left: 37, 
			up: 38, 
			right: 39, 
			down: 40
		},
		scroll: {
			y: 0,
			direction: 'down'
		},
		pageName: function() {
			const page = document.URL.substring(document.URL.lastIndexOf("/") + 1);
			const pagename = page.split('?');

			return pagename[0]
		},
		breakPoint: [600, 905],
		effect: { //http://cubic-bezier.com - css easing effect
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
		}
	}
	
	Global.parts = {
		//resize state
		resizeState: function() {
			let timerWin;

			const act = function() {
				const browser = Global.state.browser;
				const device = Global.state.device;

				device.width = window.innerWidth;
				device.height = window.innerHeight;

				device.touch = device.ios || device.android || (doc.ontouchstart !== undefined && doc.ontouchstart !== null);
				device.mobile = device.touch && (device.ios || device.android);
				device.os = device.os ? device.os[0] : '';
				device.os = device.os.toLowerCase();

				device.breakpoint = device.width >= deviceSize[5] ? true : false;
				device.colClass = device.width >= deviceSize[5] ? 'col-12' : device.width > deviceSize[8] ? 'col-8' : 'col-4';

				if (browser.ie) {
					browser.ie = browser.ie = parseInt( browser.ie[1] || browser.ie[2] );
					( 11 > browser.ie ) ? support.pointerevents = false : '';
					( 9 > browser.ie ) ? support.svgimage = false : '';
				} else {
					browser.ie = false;
				}

				const clsBrowser = browser.chrome ? 'chrome' : browser.firefox ? 'firefox' : browser.opera ? 'opera' : browser.safari ? 'safari' : browser.ie ? 'ie ie' + browser.ie : 'other';
				const clsMobileSystem = device.ios ? "ios" : device.android ? "android" : 'etc';
				const clsMobile = device.mobile ? device.app ? 'ui-a ui-m' : 'ui-m' : 'ui-d';
				const el_html = doc.querySelector('html');

				el_html.classList.remove('col-12', 'col-8', 'col-4');
				el_html.classList.add(device.colClass, clsBrowser, clsMobileSystem, clsMobile);
			
				const w = window.innerWidth;

				clearTimeout(timerWin);
				timerWin = setTimeout(function(){
					el_html.classList.remove('size-tablet');
					el_html.classList.remove('size-desktop');
					el_html.classList.remove('size-mobile');
						el_html.classList.remove('size-desktop');

					if (w < Global.state.breakPoint[0]) {
						Global.state.browser.size = 'mobile';
						el_html.classList.add('size-mobile');
					} else if (w < Global.state.breakPoint[1]) {
						Global.state.browser.size = 'tablet';
						el_html.classList.add('size-tablet');
					} else {
						Global.state.browser.sizee = 'desktop';
						el_html.classList.add('size-desktop');
					}
				},200);
			}
			win.addEventListener('resize', act);
			act();
		},

		/**
		* append html : 지정된 영역 안에 마지막에 요소 추가하기
		* @param {object} el target element
		* @param {string} str 지정된 영역에 들어갈 값
		* @param {string} htmltag HTML tag element
		*/
		appendHtml: function(el, str, htmltag) {
			const _htmltag = !!htmltag ? htmltag : 'div';
			const div = doc.createElement(_htmltag);

			div.innerHTML = str;

			while (div.children.length > 0) {
				el.appendChild(div.children[0]);
			}
		},

		/**
		* delete parent tag : 지정된 요소의 부모태그 삭제
		* @param {object} child target element
		*/
		deleteParent: function(child) {
			const parent = child.parentNode;

			parent.parentNode.removeChild(parent);
		},

		/**
		* wrap tag : 지정된 요소의 tag 감싸기
		* @param {object} child target element
		*/
		wrapTag: function(front, selector, back) {
			const org_html = selector.innerHTML;
			const new_html = front + org_html + back;

			selector.innerHTML = '';
 			selector.insertAdjacentHTML('beforeend', new_html) ;
		},

		//숫자 세자리수마다 ',' 붙이기
		comma: function(n) {
			var parts = n.toString().split(".");

			return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
		},

		//숫자 한자리수 일때 0 앞에 붙이기
		add0: function(x) {
			return Number(x) < 10 ? '0' + x : x;
		},

		//주소의 파라미터 값 가져오기
		para: function(paraname) {
			const tempUrl = win.location.search.substring(1);
			const tempArray = tempUrl.split('&');
			const tempArray_len = tempArray.length;
			let keyValue;
	
			for (var i = 0, len = tempArray_len; i < len; i++) {
				keyValue = tempArray[i].split('=');
	
				if (keyValue[0] === paraname) {
					return keyValue[1];
				}
			}
		},

		//기본 선택자 설정
		selectorType: function(v) {
			let base = document.querySelector('body');

			if (v !== null) {
				if (typeof v === 'string') {
					base = document.querySelector(v);
				} else {
					base = v;
				} 
			}

			return base;
		},

		RAF: function(start, end, startTime, duration){
			const _start = start;
			const _end = end;
			const _duration = duration ? duration : 300;
			const unit = (_end - _start) / _duration;
			const endTime = startTime + _duration;

			let now = new Date().getTime();
			let passed = now - startTime;

			if (now <= endTime) {
				Global.parts.RAF.time = _start + (unit * passed);
				requestAnimationFrame(scrollTo);
			} else {
				!!callback && callback();
				console.log('End off.')
			}
		},

		getIndex: function (ele) {
			let _i = 0;

			while((ele = ele.previousSibling) != null ) {
				_i++;
			}

			return _i;
		},
		toggleSlide: function(opt) {
			const el = opt.el;
			const state = opt.state;
			let n;

			if (state === 'toggle') {
				(0 === el.offsetHeight) ? show() : hide();
			} else {
				(state === 'show') ? show() : hide();
			}

			function show(){
				el.setAttribute('aria-hidden', false);
				el.style.height = "auto";
				n = el.offsetHeight;
				el.style.height = 0;
				void el.offsetHeight;
				el.style.height = n + 'px';
			}
			function hide(){
				el.setAttribute('aria-hidden', true);
				el.style.height = 0;
			}
		}
	}
	Global.parts.resizeState();

	Global.option = {
		join : function(org, add){
			console.log(org, add);

			const object1 = {};

			Object.defineProperties(object1, org, add);

			console.log(object1);
		}
	}

	Global.loading = {
		timerShow : {},
		timerHide : {},
		options : {
			selector: null,
			message : null,
			styleClass : 'orbit' //time
		},
		show : function(option){
			//const opt = {...this.options, ...option};
			//const opt = Object.assign({}, this.options, option);
			//Global.option.join(this.options, option);
            // const {selector, styleClass, message} = opt;

            const selector = option !== undefined && option.selector !== undefined ? option.selector : null;
            const styleClass = option !== undefined && option.styleClass !== undefined ? option.styleClass : 'orbit';
            const message = option !== undefined && option.message !== undefined ? option.message : null;
			
			console.log(selector, styleClass, message);
			const el = (selector !== null) ? selector : doc.querySelector('body');
			const el_loadingHides = doc.querySelectorAll('.ui-loading:not(.visible)');

			for (let i = 0, len = el_loadingHides.length; i < len; i++) {
				el_loadingHides[i].remove();
			}

			let htmlLoading = '';

			(selector === null) ?
				htmlLoading += '<div class="ui-loading '+ styleClass +'">':
				htmlLoading += '<div class="ui-loading type-area '+ styleClass +'">';
			htmlLoading += '<div class="ui-loading-wrap">';

			(message !== null) ?
				htmlLoading += '<strong class="ui-loading-message"><span>'+ message +'</span></strong>':
				htmlLoading += '';

			htmlLoading += '</div>';
			htmlLoading += '</div>';

			clearTimeout(this.timerShow);
			clearTimeout(this.timerHide);
			this.timerShow = setTimeout(showLoading, 300);
			
			function showLoading(){
				!el.querySelector('.ui-loading') && el.insertAdjacentHTML('beforeend', htmlLoading);
				htmlLoading = null;		

				const el_loadings = doc.querySelectorAll('.ui-loading');

                for (let i = 0, len = el_loadings.length; i < len; i++) {
					el_loadings[i].classList.add('visible');
					el_loadings[i].classList.remove('close');
				}
			}
		},
		hide: function(){
			clearTimeout(this.timerShow);
			this.timerHide = setTimeout(function(){
				const el_loadings = doc.querySelectorAll('.ui-loading');

                for (let i = 0, len = el_loadings.length; i < len; i++) {
                    const that = el_loadings[i];

					that.classList.add('close');
					setTimeout(function(){
						that.classList.remove('visible')
						that.remove();
					},300);
				}
			},300);
		}
	}

	Global.ajax = {
		options : {
			page: true,
			add: false,
			prepend: false,
			effect: false,
			loading:false,
			callback: false,
			errorCallback: false,
			type: 'GET',
			cache: false,
			async: true,
			contType: 'application/x-www-form-urlencoded',
			dataType: 'html'
		},
		init : function(option){
			if (option === undefined) {
				return false;
			}

			const xhr = new XMLHttpRequest();

            const area = option.area;
            const url = option.url;

            const loading = option.loading !== undefined ? option.loading : false;
            const effect = option.effect !== undefined ? option.effect : false;
            const type = option.type !== undefined ? option.type : 'GET';
            
            const page = option.page !== undefined ? option.page : true;
            const add = option.add !== undefined ? option.add : false;
            const prepend = option.prepend !== undefined ? option.prepend : false;
            const mimeType = option.mimeType !== undefined ? option.mimeType : false;
            const contType = option.contType !== undefined ? option.contType : 'application/x-www-form-urlencoded';

			const callback = option.callback !== undefined ? option.callback : false;
			const errorCallback = option.errorCallback !== undefined ? option.errorCallback : false;
	
			loading && Global.loading.show();

			if (!!effect && !!document.querySelector(effect)) {
				area.classList.remove(effect + ' action');
				area.classList.add(effect);
			}

			xhr.open(type, url);
			xhr.setRequestHeader("n", contType);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (xhr.readyState !== XMLHttpRequest.DONE) {
					return;
				}

				if (xhr.status === 200) {
					loading && Global.loading.hide();

					if (page) {
						if (add){
							prepend ? 
								area.insertAdjacentHTML('afterbegin', xhr.responseText) : 
								area.insertAdjacentHTML('beforeend', xhr.responseText);
						} else {							
							area.innerHTML = xhr.responseText;
						}

						callback && callback();
						effect && area.classList.add('action');
					} else {
						callback && callback(xhr.responseText);
					}

				} else {
					loading && Global.loading.hide();
					errorCallback ? errorCallback() : '';
				}
			};
		}
	}

	Global.scroll = {
		options : {
			selector: document.querySelector('html, body'),
			focus: false,
			top: 0,
			left:0,
			add: 0,
			align: 'default',
			effect:'smooth', //'auto'
			callback: false,	
		},
		init: function(){
			const el_areas = document.querySelectorAll('.ui-scrollmove-btn[data-area]');

            for (let i = 0, len = el_areas.length; i < len; i++) {
                const el_this = el_areas[i];

				el_this.removeEventListener('click', this.act);
				el_this.addEventListener('click', this.act);
			}
		},
		act: function(e){
			const that = e.currentTarget;
			const area = that.dataset.area;
			const name = that.dataset.name;
			const add = that.dataset.add === undefined ? 0 : that.dataset.add;
			const align = that.dataset.align === undefined ? 'default' : that.dataset.align;
			const callback = that.dataset.callback === undefined ? false : that.dataset.callback;

			const el_area = doc.querySelector('.ui-scrollmove[data-area="'+ area +'"]');
			const el_item = el_area.querySelector('.ui-scrollmove-item[data-name="'+ name +'"]');
			
			let top = (el_area.getBoundingClientRect().top - el_item.getBoundingClientRect().top) - el_area.scrollTop;
			let left = (el_area.getBoundingClientRect().left - el_item.getBoundingClientRect().left) - el_area.scrollLeft;

			if (align === 'center') {
				top = top - (el_item.offsetHeight / 2);
				left = left - (el_item.offsetWidth / 2);
			}

			Global.scroll.move({
				top: top,
				left: left,
				add: add,
				selector: el_area,
				align: align,
				focus: el_item,
				callback: callback
			});
		},
		move : function(option){
            const selector = option !== undefined && option.selector !== undefined ? option.selector : document.querySelector('html, body');
			const focus = option !== undefined && option.focus !== undefined ? option.focus : false;
			const top = option !== undefined && option.top !== undefined ? option.top : 0;
			const left = option !== undefined && option.left !== undefined ? option.left : 0;
			const add = option !== undefined && option.add !== undefined ? option.add : 0;
			const align = option !== undefined && option.align !== undefined ? option.align : 'default';
			const effect = option !== undefined && option.effect !== undefined ? option.effect :'smooth';
			const callback = option !== undefined && option.callback !== undefined ? option.callback : false;	

			//jquery selector인 경우 변환
			// if (!!selector[0]) {
			// 	selector = selector[0];
			// }

			switch (align) {
				case 'default':
                    if (!Global.state.browser.ie) {
                        selector.scrollTo({
                            top: Math.abs(top) + add,
                            left: Math.abs(left) + add,
                            behavior: effect
                        });
                    } else {
                        selector.scrollTop = Math.abs(top) + add;
                        selector.scrollLeft = Math.abs(left) + add;
                    }
					
					break;

				case 'center':
                    if (!Global.state.browser.ie) {
                        selector.scrollTo({
                            top: Math.abs(top) - (selector.offsetHeight / 2) + add,
                            left: Math.abs(left) - (selector.offsetWidth / 2) + add,
                            behavior: effect
                        });
                    } else {
                        selector.scrollTop = Math.abs(top) - (selector.offsetHeight / 2) + add;
                        selector.scrollLeft = Math.abs(left) - (selector.offsetWidth / 2) + add;
                    }
					break;
			}

			this.checkEnd({
				selector : selector,
				nowTop : selector.scrollTop, 
				nowLeft : selector.scrollLeft,
				align : align,
				callback : callback,
				focus : focus
			});
		},
		checkEndTimer : {},
		checkEnd: function(option){
			const el_selector = option.selector;
            const focus = option !== undefined && option.focus !== undefined ? option.focus : false;
			const align = option !== undefined && option.align !== undefined ? option.align : 'default';
			const callback = option !== undefined && option.callback !== undefined ? option.callback : false;	
			
			let nowTop = option.nowTop;
			let nowLeft = option.nowLeft;

			Global.scroll.checkEndTimer = setTimeout(function(){
				//스크롤 현재 진행 여부 판단
				if (nowTop === el_selector.scrollTop && nowLeft === el_selector.scrollLeft) {
					clearTimeout(Global.scroll.checkEndTimer);
					//포커스가 위치할 엘리먼트를 지정하였다면 실행
 					if (!!focus ) {
						focus.setAttribute('tabindex', 0);
						focus.focus();
					}
					//스크롤 이동후 콜백함수 실행
					if (!!callback) {
						if (typeof callback === 'string') {
							Global.callback[callback]();
						} else {
							callback();
						}
					}
				} else {
					nowTop = el_selector.scrollTop;
					nowLeft = el_selector.scrollLeft;

					Global.scroll.checkEnd({
						selector: el_selector,
						nowTop: nowTop,
						nowLeft: nowLeft,
						align: align,
						callback: callback,
						focus: focus
					});
				}
			},100);
		},

		optionsParllax: {
			selector : null,
			area : null
		},
		parallax: function(option) {
            const selector = option !== undefined && option.selector !== undefined ? option.selector : null;
			const area = option !== undefined && option.area !== undefined ? option.area : null;

			const el_area = area ? area : window;
			const el_parallax = selector ? selector : doc.querySelector('.ui-parallax');
			const el_wraps = el_parallax.querySelectorAll(':scope > .ui-parallax-wrap');

			act();
			el_area.addEventListener('scroll', act);

			function act() {
				const isWin = el_area === window;
				const areaH = isWin ? window.innerHeight : el_area.offsetHeight;
				const areaT = isWin ? Math.floor(window.scrollY) : Math.floor(el_area.scrollTop);
				const baseT = Math.floor(el_wraps[0].getBoundingClientRect().top);
				
                for (let i = 0, len = el_wraps.length; i < len; i++) {
                    const el_wrap = el_wraps[i];

                    const el_items = el_wrap.querySelectorAll('.ui-parallax-item');
					const attrStart = el_wrap.dataset.start === undefined ? 0 : el_wrap.dataset.start;
					const attrEnd = el_wrap.dataset.end === undefined ? 0 : el_wrap.dataset.end;
					const h = Math.floor(el_wrap.offsetHeight);
					let start = Math.floor(el_wrap.getBoundingClientRect().top);
					let end = h + start;
					const s = areaH * Number(attrStart) / 100;
					const e = areaH * Number(attrEnd) / 100;

					if (opt.area !== 'window') {
						start = (start + areaT) - (baseT + areaT);
						end = (end + areaT) - (baseT + areaT);
					}

					(areaT >= start - s) ? 
						el_wrap.classList.add('parallax-s') : 
						el_wrap.classList.remove('parallax-s');
					(areaT >= end - e) ? 
						el_wrap.classList.add('parallax-e') : 
						el_wrap.classList.remove('parallax-e');

                    for (let j = 0, len = el_items.length; j < len; j++) {
                        const el_item = el_items[j];

						const n = ((areaT - (start - s)) * 0.003).toFixed(2);
						const callbackname = el_item.dataset.act;

						//n = n < 0 ? 0 : n > 1 ? 1 : n;

						if (!!Global.callback[callbackname]) {
							Global.callback[callbackname]({
								el: el_item, 
								n: n
							});
						}

						el_item.setAttribute('data-parallax', n);
					}
				}
			}
		}
	}

	Global.para = {
		get: function(paraname){
			const _tempUrl = win.location.search.substring(1);
			const _tempArray = _tempUrl.split('&');
			let _keyValue;

			for (let i = 0, len = _tempArray.length; i < len; i++) {
				_keyValue = _tempArray[i].split('=');

				if (_keyValue[0] === paraname) {
					return _keyValue[1];
				}
			}
		}
	}

	Global.focus = {
		options: {
			callback: false
		},
		loop : function(option){
			if (option === undefined) {
				return false;
			}
			const el = option.selector;
			const callback = option.callback !== undefined ? option.callback : false;

			if(!el.querySelector('[class*="ui-focusloop-"]')) {
				el.insertAdjacentHTML('afterbegin', '<div tabindex="0" class="ui-focusloop-start"><span>시작지점입니다.</span></div>');
				el.insertAdjacentHTML('beforeend', '<div tabindex="0" class="ui-focusloop-end"><span>마지막지점입니다.</span></div>');
			}

			const el_start = el.querySelector('.ui-focusloop-start');
			const el_end = el.querySelector('.ui-focusloop-end');
		
			el_start.addEventListener('keydown', keyStart);
			el_end.addEventListener('keydown', keyEnd);

			function keyStart(e) {
				if (e.shiftKey && e.keyCode == 9) {
					e.preventDefault();
					el_end.focus();
					// !!callback && callback();
				}
			}

			function keyEnd(e) {
				if (!e.shiftKey && e.keyCode == 9) {
					e.preventDefault();
					el_start.focus();
					// !!callback && callback();
				}
			}
		}
	}
    
	Global.cookie = {
		set: function(opt){
            const name = opt.name;
            const value = opt.value;
            const term = opt.term;
            const path = opt.path;
            const domain = opt.domain;

			let cookieset = name + '=' + value + ';';
			let expdate;

			if (term) {
				expdate = new Date();
				expdate.setTime( expdate.getTime() + term * 1000 * 60 * 60 * 24 ); // term 1 is a day
				cookieset += 'expires=' + expdate.toGMTString() + ';';
			}
			(path) ? cookieset += 'path=' + path + ';' : '';
			(domain) ? cookieset += 'domain=' + domain + ';' : '';

			document.cookie = cookieset;
		},
		get: function(name){
			const match = ( document.cookie || ' ' ).match( new RegExp(name + ' *= *([^;]+)') );

			return (match) ? match[1] : null;
		},
		del: function(name){
			const expireDate = new Date();

			expireDate.setDate(expireDate.getDate() + -1);
			this.set({ 
				name: name, 
				term: '-1' 
			});
		}
	}

	Global.form = {
		init: function(opt){
			const el_inps = doc.querySelectorAll('.inp-base');

            for (let i = 0, len = el_inps.length; i < len; i++) {
                const that = el_inps[i];

				const el_wrap = that.parentNode;
				const el_form = that.closest('[class*="ui-form"]');
				const unit = that.dataset.unit;
				const prefix = that.dataset.prefix;
				const el_label = el_form.querySelector('.form-item-label');
				let el_unit = el_wrap.querySelector('.unit');
				let el_prefix = el_wrap.querySelector('.prefix');
				let space = 0;

				that.removeAttribute('style');
				el_unit && el_unit.remove();
				el_prefix && el_prefix.remove();

				const pdr = parseFloat(doc.defaultView.getComputedStyle(that).getPropertyValue('padding-right'));
				const pdl = parseFloat(doc.defaultView.getComputedStyle(that).getPropertyValue('padding-left'));

				if (unit !== undefined) {
					el_wrap.insertAdjacentHTML('beforeend', '<div class="unit">'+unit+'</div>');
					el_unit = el_wrap.querySelector('.unit');
					space = Math.floor(el_unit.offsetWidth) + (pdr / 2) ;
				}

				that.style.paddingRight = Number(space + pdr);;
				that.dataset.pdr = space + pdr;
				that.setAttribute('pdr', space + pdr);
				space = 0;
				
				if (prefix !== undefined) {					
					el_wrap.insertAdjacentHTML('afterbegin', '<div class="prefix">'+prefix+'</div>');
					el_prefix = el_wrap.querySelector('.prefix');
					space = Math.floor(el_prefix.offsetWidth) + pdl;
					that.style.paddingLeft = (space + pdl) + 'px';
					that.dataset.pdl = space + pdl;
					el_label.style.marginLeft = space + 'px';
				}

				this.isValue(that, false);
				that.style.paddingLeft = space + pdl;
				that.dataset.pdl = space + pdl;

				const select_btns = doc.querySelectorAll('.ui-select-btn');
				const datepicker_btns = doc.querySelectorAll('.ui-datepicker-btn');

                for (let j = 0, len = select_btns.length; j < len; j++) {
                    const btn = select_btns[j];
				
					btn.removeEventListener('click', this.actValue);
					btn.addEventListener('click', this.actValue);
				}

                for (let k = 0, len = datepicker_btns.length; k < len; k++) {
                    const btn = datepicker_btns[k];

					btn.removeEventListener('click', this.actValue);
					btn.addEventListener('click', this.actValue);
					btn.addEventListener('click', this.actDaterpicker);
				}

				that.removeEventListener('keyup', this.actValue);
				that.removeEventListener('focus', this.actValue);
				that.removeEventListener('blur', this.actUnValue);

				that.addEventListener('keyup', this.actValue);
				that.addEventListener('focus', this.actValue);
				that.addEventListener('blur', this.actUnValue);
			}
		},
		actDaterpicker: function(e){
			e.preventDefault();

			const that = e.currentTarget;
			const el_datepicker = that.closest('.ui-datepicker');
			const el_inp = el_datepicker.querySelector('.inp-base');

			Global.sheets.bottom({
				id: el_inp.id,
				callback: function(){
					Global.datepicker.init({
						id: el_inp.id,
						date: el_inp.value,
						min: el_inp.min,
						max: el_inp.max,
						title: el_inp.title,
						period: el_inp.dataset.period,
						callback: function(){
							console.log('callback init')
						}
					});
				}
			});

		},
		actValue: function (e){
			const that = e.currentTarget;
			
			Global.form.isValue(that, true);
		},
		actUnValue: function (e){
			const inp = e.currentTarget;
			const wrap = inp.parentNode;
			const el_clear = wrap.querySelector('.ui-clear');
			const pdr = Number(inp.dataset.pdr);

			Global.form.isValue(inp, false);

			setTimeout(function(){
				inp.style.paddingRight = pdr + 'px'; 
				el_clear && el_clear.remove();
			},100);
		},
		isValue: function (inp, value){
			const el_inp = inp;
			const el_wrap = el_inp.parentNode;
			const el_inner = el_inp.closest('.ui-form-inner');
			//const el_inp = el_wrap.querySelector('.inp-base');

			let el_clear = el_wrap.querySelector('.ui-clear');
			let pdr = Number(el_inp.dataset.pdr);
			
			if (!!el_inner) {
				if (value) {
					el_inner.classList.add('is-value');
				} else {
					(!!el_inp.value) ? 
						el_inner.classList.add('is-value'):
						el_inner.classList.remove('is-value');
				}
			}
			
			if (el_inp.readonly || el_inp.disabled || el_inp.type === 'date') {
				return false;
			}

			if (el_inp.value === undefined || el_inp.value === '') {
				el_inp.style.paddingRight = pdr + 'px'; 
				el_clear = el_wrap.querySelector('.ui-clear');
				
				!!el_clear && el_clear.removeEventListener('click', this.actClear);
				!!el_clear && el_clear.remove();
			} else {
				if (!el_clear) {
					if (el_inp.tagName === 'INPUT') { 
						el_wrap.insertAdjacentHTML('beforeend', '<button type="button" class="ui-clear btn-clear" tabindex="-1" aria-hidden="true"  style="margin-right:'+ pdr +'px"><span class="a11y-hidden">내용지우기</span></button>');

						el_clear = el_wrap.querySelector('.ui-clear');
						el_clear.addEventListener('click', this.actClear);

						el_inp.style.paddingRight = pdr + el_clear.offsetWidth + 'px'; 
					} else {
						el_inp.style.paddingRight = pdr + 'px'; 
					}
				} 
			}
		},
		actClear: function(e){
			const that = e.currentTarget;
			const el_wrap = that.parentNode;
			const el_inp = el_wrap.querySelector('.inp-base');
			const pdr = Number(el_inp.dataset.pdr);

			el_inp.style.paddingRight = pdr + 'px'
			el_inp.value = '';
			el_inp.focus();
			that.remove();
		},
		fileUpload: function() {
			const el_files = document.querySelectorAll('.ui-file-inp');
			const fileTypes = [
				"image/apng",
				"image/bmp",
				"image/gif",
				"image/jpeg",
				"image/pjpeg",
				"image/png",
				"image/svg+xml",
				"image/tiff",
				"image/webp",
				"image/x-icon"
			];

            for (let i = 0, len = el_files.length; i < len; i++) {
                const el_file = el_files[i];

                if (!el_file.dataset.ready) {
					el_file.addEventListener('change', updateImageDisplay);
					el_file.dataset.ready = true;
				}
			}
			
			function updateImageDisplay(e) {
				const el_file = e.currentTarget;
				const id = el_file.id;
				const preview = document.querySelector('.ui-file-list[data-id="'+ id +'"]');

				while(preview.firstChild) {
					preview.removeChild(preview.firstChild);
				}

				const curFiles = el_file.files;

				if(curFiles.length === 0) {
					const para = document.createElement('p');
					para.textContent = 'No files currently selected for upload';
					preview.appendChild(para);
				} else {
					const list = document.createElement('ul');
					const title = document.createElement('h4');
					const delbutton = document.createElement('button');

					delbutton.type = 'button';
					delbutton.classList.add('ui-file-del');
					delbutton.dataset.id = id;

					title.textContent = 'File upload list';
					title.classList.add('a11y-hidden');
					preview.classList.add('on');
					preview.appendChild(title);
					preview.appendChild(list);
					preview.appendChild(delbutton);

					const delbuttonSpan = document.createElement('span'); 

					delbuttonSpan.textContent = 'Delete attachment';
					delbuttonSpan.classList.add('a11y-hidden');
					delbutton.appendChild(delbuttonSpan);
                    
                    for (let i = 0, len = curFiles.length; i < len; i++) {
                        const file = curFiles[i];
						const listItem = document.createElement('li');
						const para = document.createElement('p');

						if(validFileType(file)) {
							para.textContent = file.name + ', ' + returnFileSize(file.size) + '.';
							
							const image = document.createElement('img');
							image.src = URL.createObjectURL(file);
							
							listItem.appendChild(image);
							listItem.appendChild(para);
							
						} else {
							para.textContent = file.name;
							listItem.appendChild(para);
						}
				
						list.appendChild(listItem);
					}

					delbutton.addEventListener('click', fileDelete);
				}
			}

			function fileDelete(e){
				const id = e.currentTarget.dataset.id;
				const list = document.querySelector('.ui-file-list[data-id="'+ id +'"]');
				const inp = document.querySelector('#'+ id);

				list.classList.remove('on');
				while(list.firstChild) {
					list.removeChild(list.firstChild);
				}
				inp.value = ''; 
			}

			function validFileType(file) {
				return fileTypes.includes(file.type);
			}

			function returnFileSize(number) {
				if(number < 1024) {
					return number + 'bytes';
				} else if(number >= 1024 && number < 1048576) {
					return (number/1024).toFixed(1) + 'KB';
				} else if(number >= 1048576) {
					return (number/1048576).toFixed(1) + 'MB';
				}
			}
		}
		
	}

	Global.rangeSlider = {
		init: function(opt){
			const id = opt.id;
			const el_range = document.querySelector('.ui-range[data-id="'+ id +'"]');
			const el_from = el_range.querySelector('.ui-range-inp[data-range="from"]');
			const el_to = el_range.querySelector('.ui-range-inp[data-range="to"]');

			if (el_from && el_to) {
				//range
				Global.rangeSlider.rangeFrom({
					id: id
				});
				Global.rangeSlider.rangeTo({
					id: id
				});
				el_from.addEventListener("input", function(){
					Global.rangeSlider.rangeFrom({
						id: id
					});
				});
				el_to.addEventListener("input", function(){
					Global.rangeSlider.rangeTo({
						id: id
					});
				});

			} else {
				//single
				Global.rangeSlider.rangeFrom({
					id: id,
					type: 'single'
				});
				el_from.addEventListener("input", function(){
					Global.rangeSlider.rangeFrom({
						id: id,
						type: 'single'
					});
				});
			}
		},
		rangeFrom: function(opt){
			const id = opt.id;
			const v = opt.value;
			const el_range = document.querySelector('.ui-range[data-id="'+ id +'"]');
			const el_from = el_range.querySelector('.ui-range-inp[data-range="from"]');
			const el_to = el_range.querySelector('.ui-range-inp[data-range="to"]');
			const el_left = el_range.querySelector(".ui-range-btn.left");
			const el_right = el_range.querySelector(".ui-range-btn.right");
			const el_bar = el_range.querySelector(".ui-range-bar");
			const inp_froms = document.querySelectorAll('[data-'+ id +'="from"]');
			let percent;
            let value = el_from;
            let min = el_from;
            let max = el_from;

			if (v) {
				el_from.value = v;
			}

			let from_value = +el_from.value;
			
			if (opt.type !== 'single') {
				if (+el_to.value - from_value < 0) {
					from_value = +el_to.value - 0;
					el_from.value = from_value;
				}

				percent = ((from_value - +min) / (+max - +min)) * 100;

				el_right.classList.remove('on');
				el_to.classList.remove('on');
				el_left.style.left = percent + '%';
				el_bar.style.left = percent + '%';
			} else {
				if (from_value < 0) {
					from_value = 0;
				}
				percent = ((from_value - +min) / (+max - +min)) * 100;
				el_left.style.left = percent + '%';
				el_bar.style.right = (100 - percent) + '%';
			}

			el_left.classList.add('on');
			el_from.classList.add('on');
			
            for (let i = 0, len = inp_froms.length; i < len; i++ ) {
                const inp_from = inp_froms[i];

				if (inp_from.tagName === 'INPUT') {
					inp_from.value = from_value;
				} else {
					inp_from.textContent = from_value;
				}
			}
		},
		rangeTo: function(opt){
			const id = opt.id;
			const v = opt.value;
			const el_range = document.querySelector('.ui-range[data-id="'+ id +'"]');
			const el_from = el_range.querySelector('.ui-range-inp[data-range="from"]');
			const el_to = el_range.querySelector('.ui-range-inp[data-range="to"]');
			const el_left = el_range.querySelector(".ui-range-btn.left");
			const el_right = el_range.querySelector(".ui-range-btn.right");
			const el_bar = el_range.querySelector(".ui-range-bar");
			const inp_tos = document.querySelectorAll('[data-'+ id +'="to"]');
            let value = el_to;
            let min = el_to;
            let max = el_to;

			if (v) {
				el_to.value = v;
			}

			let to_value = +el_to.value;

			if (+value - +el_from.value < 0) {
				to_value = +el_from.value + 0;
				el_to.value = to_value;
			}

			let percent = ((to_value - +min) / (+max - +min)) * 100;

			el_right.classList.add('on');
			el_left.classList.remove('on');
			el_to.classList.add('on');
			el_from.classList.remove('on');
			el_right.style.right = (100 - percent) + '%';
			el_bar.style.right = (100 - percent) + '%';

            for (let i = 0, len = inp_tos.length; i < len; i++ ) {
                const inp_to = inp_tos[i];

                if (inp_to.tagName === 'INPUT') {
					inp_to.value = el_to.value;
				} else {
					inp_to.textContent = el_to.value;
				}
			}
		}
	}

	Global.sheets = {
		dim: function(opt){
            const show = opt.show;
            const callback = opt.callback;

            let dim;

 			if (show) {
				const sheet = doc.querySelector('.sheet-bottom[data-id="'+opt.id+'"]');
				sheet.insertAdjacentHTML('beforeend', '<div class="sheet-dim"></div>');

				dim = doc.querySelector('.sheet-dim');
				dim.classList.add('on');

				!!callback && callback();
			} else {
				dim = doc.querySelector('.sheet-dim');
				dim.classList.remove('on');
			}
		},
		bottom: function(opt){
            const id = opt.id;
            const state = opt.state;
            const callback = opt.callback;
			const el_base = doc.querySelector('#'+ id);
			let el_sheet = doc.querySelector('[data-id*="'+id+'"]');
			const scr_t = doc.documentElement.scrollTop;
			const win_w = win.innerWidth;
			const win_h = win.innerHeight;
			const off_t = el_base.getBoundingClientRect().top;
			const off_l = el_base.getBoundingClientRect().left;
			const base_w = el_base.offsetWidth;
			const base_h = el_base.offsetHeight;
			const is_expanded = !!el_sheet;
			let show = !is_expanded || is_expanded === 'false';

			if (state !== undefined) {
				show = state;
			}

			if (show) {
				!!callback && callback(); 
				
				el_sheet = doc.querySelector('[data-id*="'+ id +'"]');
				el_sheet.classList.add('sheet-bottom');

				const wrap_w = Number(el_sheet.offsetWidth.toFixed(2));
				const wrap_h = Number(el_sheet.offsetHeight.toFixed(2));

				Global.sheets.dim({
					id: id,
					show: true,
					callback: function(){
						const dim = doc.querySelector('.sheet-dim');

						dim.addEventListener('click', dimAct);

						function dimAct(){
							Global.sheets.bottom({
								id: id,
								state: false
							});
						}
					}
				});

				el_sheet.classList.add('on');
				el_sheet.style.left = ((wrap_w + off_l) > win_w) ? (off_l - (wrap_w - base_w))+ 'px' : off_l + 'px';
				el_sheet.style.top = (win_h - ((off_t - scr_t) + base_h) > wrap_h) ? (off_t + base_h) + scr_t + 'px' : (off_t - wrap_h) + scr_t + 'px';

				Global.focus.loop({
					selector: el_sheet
				});
			} else {
				//hide
				el_sheet.classList.remove('on');
				el_sheet.classList.add('off');
				
				setTimeout(function(){
					!!callback && callback();
					el_sheet.remove();

					doc.querySelector('#'+id).focus();
				},300);
			}
		}
	}

	Global.select = {
		options: {
			id: false, 
			current: null,
			customscroll: true,
			callback: false
		},
		init: function(option){
			const current = option !== undefined && option.current !== undefined ? option.current : null;
			const callback = option !== undefined && option.current !== undefined ? option.callback : false;
			let customscroll = option !== undefined && option.current !== undefined ? option.customscroll : true;
			const id = option !== undefined && option.current !== undefined ? option.id : false;
			const isId = !!id ? doc.querySelector('#' + option.id) : false;
			const el_uiSelects = doc.querySelectorAll('.ui-select');
			const keys = Global.state.keys;
			const isMobile = Global.state.device.mobile;

			let el_select;
			let $selectCurrent;
			let selectID;
			let listID;
			let optionSelectedID;
			let selectN;
			let selectTitle;
			let selectDisabled;
			let btnTxt = '';
			let hiddenClass = '';
			let htmlOption = '';
			let htmlButton = '' ;

			//init
			Global.state.device.mobile ? customscroll = false : '';

			//reset
			let idN = JSON.parse(sessionStorage.getItem('scrollbarID'));

			//select set
            for (let i = 0, len = el_uiSelects.length; i < len; i++) {
                const el_uiSelect = el_uiSelects[i];

                let el_btn = el_uiSelect.querySelector('.ui-select-btn');
				let el_wrap = el_uiSelect.querySelector('.ui-select-wrap');
				let el_dim = el_uiSelect.querySelector('.dim');

				el_btn && el_btn.remove();
				el_wrap && el_wrap.remove();
				el_dim && el_dim.remove();

				el_select = el_uiSelect.querySelector('select');

				selectID = el_select.id;

				if (!!id && selectID === id) {
					act(el_uiSelect, el_select, selectID);
				} else {
					act(el_uiSelect, el_select, selectID);
				}
			}

			function act(el_uiSelect, el_select, selectID){
				(selectID === undefined) ? el_select.id = 'uiSelect_' + idN : '';
				listID = selectID + '_list';

				selectDisabled = el_select.disabled;
				selectTitle = el_select.title;
				hiddenClass = '';

				//el_uiSelect.css('max-width', el_uiSelect.outerWidth());
				//callback 나중에 작업필요
				//(!el_select.data('callback') || !!callback) && el_select.data('callback', callback);

				if (customscroll) {
					htmlOption += '<div class="ui-select-wrap ui-scrollbar" scroll-id="uiSelectScrollBar_'+ idN +'">';
					idN = idN + 1;
					sessionStorage.setItem('scrollbarID', idN);
				} else {
					htmlOption += '<div class="ui-select-wrap" style="min-width:' + el_uiSelect.offsetWIdth + 'px">';
				}

				htmlOption += '<strong class="ui-select-title">'+ selectTitle +'</strong>';
				htmlOption += '<div class="ui-select-opts" role="listbox" id="' + listID + '" aria-hidden="false">';

				setOption(el_uiSelect, el_select.selectedIndex);

				htmlOption += '</div>';
				htmlOption += '<button type="button" class="ui-select-cancel"><span>취소</span></strong>';
				htmlOption += '<button type="button" class="ui-select-confirm"><span>확인</span></strong>';
				htmlOption += '</div>';
				htmlButton = '<button type="button" class="ui-select-btn '+ hiddenClass +'" id="' + selectID + '_inp" role="combobox" aria-autocomplete="list" aria-owns="' + listID + '" aria-haspopup="true" aria-expanded="false" aria-activedescendant="' + optionSelectedID + '" data-n="' + selectN + '" data-id="' + selectID + '" tabindex="-1"><span>' + btnTxt + '</span></button>';
				
				el_uiSelect.insertAdjacentHTML('beforeend', htmlButton);
				el_select.classList.add('off');
				el_select.setAttribute('aria-hidden', true)
				// el_select.setAttribute('tabindex', -1);
				el_uiSelect.insertAdjacentHTML('beforeend', htmlOption);

				if (selectDisabled) {
					const _btn = el_uiSelect.querySelector('.ui-select-btn');

					_btn.disabled = true;
					_btn.classList.add('disabled')
				}  
				
				// const _optwrap = el_uiSelect.querySelector('.ui-select-opts');
				// console.log(_optwrap);
				// const _btns = _optwrap.querySelectorAll('button');
				// for (let _btn of _btns) {
				// 	_btn.remove();
				// }
				
				eventFn();
				htmlOption = '';
				htmlButton = '';
			}
			
			function setOption(uiSelect, v){
				let _select = (uiSelect !== undefined) ? uiSelect.closest('.ui-select') : uiSelect;

				if (uiSelect !== undefined) {
					_select = _select.querySelector('select');
				}

				const _options = _select.querySelectorAll('option');
				const _optionID = _select.id + '_opt';
				const _optLen = _options.length;

				let _optionCurrent = _options[0];
				let _current = current;
				let _selected = false;
				let _disabled = false;
				let _hidden = false;
				let _val = false;
				let _hiddenCls;
				let _optionIdName;

				if (v !== undefined) {
					_current = v;
				}

				for (let i = 0; i < _optLen; i++) {
					_optionCurrent = _options[i];
					_hidden = _optionCurrent.hidden;

					if (_current !== null) {
						if (_current === i) {
							_selected = true;
							_optionCurrent.selected = true;
						} else {
							_selected = false;
							_optionCurrent.selected = false;
						}
					} else {
						_selected = _optionCurrent.selected;
					}

					_disabled = _optionCurrent.disabled;
					_hiddenCls =  _hidden ? 'hidden' : '';

					if (_selected) {
						_val = _optionCurrent.value;
						btnTxt = _optionCurrent.textContent;
						optionSelectedID = _optionID + '_' + i;
						selectN = i;
					}

					_selected && _hidden ? hiddenClass = 'opt-hidden' : '';
					_optionIdName = _optionID + '_' + i;

					if (Global.state.device.mobile) {
						_disabled ?
							_selected ?
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled selected '+ _hiddenCls + '" value="' + _optionCurrent.value + '" disabled tabindex="-1">' :
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled '+ _hiddenCls + '" value="' + _optionCurrent.value + '" disabled tabindex="-1">' :
							_selected ?
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt selected '+ _hiddenCls + '" value="' + _optionCurrent.value + '" tabindex="-1">' :
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt '+ _hiddenCls + '" value="' + _optionCurrent.value + '" tabindex="-1">';
					} else {
						_disabled ?
							_selected ?
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled selected '+ _hiddenCls + '" value="' + _optionCurrent.value + '" disabled tabindex="-1">' :
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt disabled '+ _hiddenCls + '" value="' + _optionCurrent.value + '" disabled tabindex="-1">' :
							_selected ?
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt selected '+ _hiddenCls + '" value="' + _optionCurrent.value + '" tabindex="-1">' :
								htmlOption += '<button type="button" role="option" id="' + _optionIdName + '" class="ui-select-opt '+ _hiddenCls + '" value="' + _optionCurrent.value + '" tabindex="-1">';
					}

					htmlOption += '<span class="ui-select-txt">' + _optionCurrent.textContent + '</span>';
					htmlOption += '</button>';
				}

				return htmlOption;
			}

			//event
			eventFn();
			function eventFn(){
				// $(doc).off('click.dp').on('click.dp', '.ui-select-btn', function(e){
					
				// 	var $this = $(this).closest('.ui-datepicker').find('.inp-base');
				// 	Global.sheets.bottom({
				// 		id: $this.attr('id'),
				// 		callback: function(){

				// 		}
				// 	});
				// });
				
				//const el_dims = doc.querySelectorAll('.dim-select');
				const el_confirms = doc.querySelectorAll('.ui-select-confirm');
				const el_cancels = doc.querySelectorAll('.ui-select-cancel');
				const el_btns = doc.querySelectorAll('.ui-select-btn');
				//const el_opts = doc.querySelectorAll('.ui-select-opt');
				//const el_wraps = doc.querySelectorAll('.ui-select-wrap');
				const el_labels = doc.querySelectorAll('.ui-select-label');
				const el_selects = doc.querySelectorAll('.ui-select select');

				// for (let el_dim of el_dims) {
				// 	el_dim.addEventListener('click', selectClick);
				// }
                for (let i = 0, len = el_confirms.length; i < len; i++) {
                    const el_confirm = el_confirms[i];
					el_confirm.addEventListener('click', optConfirm);
				}

                for (let i = 0, len = el_cancels.length; i < len; i++) {
                    const el_cancel = el_cancels[i];
					el_cancel.addEventListener('click', Global.select.hide);
				}

                for (let i = 0, len = el_btns.length; i < len; i++) {
                    const el_btn = el_btns[i];
					el_btn.addEventListener('click', selectClick);
					// el_btn.addEventListener('keydown', selectKey);
					// el_btn.addEventListener('mouseover', selectOver);
					// el_btn.addEventListener('focus', selectOver);
					// el_btn.addEventListener('mouseleave', selectLeave);
				}

                for (let i = 0, len = el_labels.length; i < len; i++) {
                    const el_label = el_labels[i];
					el_label.addEventListener('click', labelClick);
				}

                for (let i = 0, len = el_selects.length; i < len; i++) {
                    const el_select = el_selects[i];
					el_select.addEventListener('change', Global.select.selectChange);
				}
			}

			function labelClick(e) {
				const that = e.currentTarget;
				const idname = that.getAttribute('for');
				const inp = doc.querySelector('#' + idname);
 
				setTimeout(function() {
					inp.focus();
				}, 0);
			}

			function selectLeave() {
				const body = doc.querySelector('body');

				body.dataset.selectopen = true;
			}
			
			
			function selectClick(e) {
				const that = e.currentTarget;
				const el_uiselect = that.closest('.ui-select');
				const el_select = el_uiselect.querySelector('select');
				const opts = el_uiselect.querySelectorAll('option');
				const n = el_select.selectedIndex;

				// for (let opt of opts) {
				// 	//console.log(a.selected && Global.parts.getIndex(a));
				// 	n = opt.selected && Global.parts.getIndex(opt);
				// }

				that.dataset.sct = doc.documentElement.scrollTop;

				doc.removeEventListener('click', Global.select.back);
				setTimeout(function(){
					doc.addEventListener('click', Global.select.back);
				},0);

				setOption(that, n);
				optExpanded(that, n);
			}

			function selectKey(e) {
				const el_btn = e.currentTarget;
				const id = el_btn.dataset.id;
				const el_list = doc.querySelector('#' + id + '_list');
				const el_wrap = el_list.closest('.ui-select-wrap');
				const el_optwrap = el_wrap.querySelector('.ui-select-opts');
				const el_opts = el_wrap.querySelectorAll('.ui-select-opt');
				const list_selected = el_list.querySelector('.selected');

				let n = Number(Global.parts.getIndex(list_selected));
				let nn = 0;
				let nnn = 0;
				let wrap_h = el_wrap.offsetHeight;
				let len = el_opts.length;
				let n_top = 0;

				if (e.altKey) {
					if (e.keyCode === keys.up) {
						optOpen(el_btn);
					}

					e.keyCode === keys.down && Global.select.hide();
					return;
				}

				switch (e.keyCode) {
					case keys.up:
					case keys.left:
						nn = n - 1 < 0 ? 0 : n - 1;
						nnn = Math.abs(el_optwrap.getBoundingClientRect().top);
						n_top = el_opts[nn].getBoundingClientRect().top + nnn;

						optScroll(el_wrap, n_top, wrap_h, 'up');
						optPrev(e, id, n, len);
						break;

					case keys.down:
					case keys.right:
						nn = n + 1 > len - 1 ? len - 1 : n + 1;
						nnn = Math.abs(el_optwrap.getBoundingClientRect().top);
						n_top = el_opts[nn].getBoundingClientRect().top + nnn;
						
						optScroll(el_wrap, n_top, wrap_h, 'down');
						optNext(e, id, n, len);
						break;
				}
			}

			function optBlur(e) {
				//if (doc.querySelector('body').dataset.selectopen) { .. }); dim
				//optClose();
			}

			function optExpanded(btn) {
				if (Global.state.device.mobile) {
					optOpen(btn);
				} else {
					if (btn.getAttribute('aria-expanded') === 'false') {
						Global.select.hide();
						optOpen(btn);
					} else {
						Global.select.hide();
					}
				}
			}

			function optScroll(el_wrap, n_top, wrap_h, key) {
				const dT = doc.documentElement.scrollTop;

				Global.scroll.move({ 
					top: Number(n_top), 
					selector: customscroll ? el_wrap.querySelector(':scope > .ui-scrollbar-item') : el_wrap, 
					effect: 'auto', 
					align: 'default' 
				});
			}
			function optPrev(e, id, n, len) {
				e.preventDefault();
				const current = (n === 0) ?0 :n - 1;

				Global.select.act({ id: id, current: current });
			}
			function optNext(e, id, n, len) {
				e.preventDefault();
				const current = n === len - 1 ? len - 1 :n + 1;

				Global.select.act({ id: id, current: current });
			}
			function optOpen(btn) {
				const el_body = doc.querySelector('body');
				const el_uiselect = btn.closest('.ui-select');
				const el_wrap = el_uiselect.querySelector('.ui-select-wrap');
				let el_optwrap = el_wrap.querySelector('.ui-select-opts');
				let el_opts = el_optwrap.querySelectorAll('.ui-select-opt');
				const el_select = el_uiselect.querySelector('select');
				const el_option = el_select.querySelectorAll('option');

				//const el_opts = doc.querySelectorAll('.ui-select-opt');

				const offtop = el_uiselect.getBoundingClientRect().top;
				const scrtop = doc.documentElement.scrollTop;
				const wraph = el_wrap.offsetHeight;
				const btn_h = btn.offsetHeight;
				const opt_h = 40;
				const win_h = win.innerHeight;
				const className = win_h - ((offtop - scrtop) + btn_h) > wraph ? 'bottom' : 'top';
				const n = el_select.selectedIndex;

				el_body.classList.add('dim-select');

				btn.dataset.expanded = true;
				btn.setAttribute('aria-expanded', true);
				el_uiselect.classList.add('on');
				el_wrap.classList.add('on');
				el_wrap.classList.add(className);
				el_wrap.setAttribute('aria-hidden', false);
				el_opts[n].classList.add('selected');
				
				if (customscroll) {
					Global.scrollBar({
						selector: el_wrap
					});
				}
					
				setTimeout(function(){

					el_optwrap = el_wrap.querySelector('.ui-select-opts');
					el_opts = el_optwrap.querySelectorAll('.ui-select-opt');

					Global.scroll.move({ 
						top: Number(opt_h * n) , 
						selector: customscroll ? el_wrap.querySelector(':scope > .ui-scrollbar-item') : el_wrap, 
						effect: 'auto', 
						align: 'default' 
					});

                    for (let i = 0, len = el_opts.length; i < len; i++) {
                        const el_opt = el_opts[i];
						console.log(el_opt);
			
						el_opt.addEventListener('click', Global.select.optClick);
						el_opt.addEventListener('mouseover',  Global.select.selectOver);
					}
					
					el_wrap.addEventListener('mouseleave', selectLeave);
					el_wrap.addEventListener('blur', optBlur);
				}, 0);

				openScrollMove(el_uiselect);

				el_wrap.removeEventListener('touchstart', Global.select.wrapTouch);
				el_wrap.addEventListener('touchstart', Global.select.wrapTouch);
			}

			function openScrollMove(el_uiselect){
				const el_html = doc.querySelector('html, body');
				const dT = Math.floor(doc.documentElement.scrollTop);
				const wH = win.innerHeight;
				const el_btn = el_uiselect.querySelector('.ui-select-btn');
				const elT = el_btn.getBoundingClientRect().top;
				const elH = el_btn.offsetHeight;
				const a = Math.floor(elT - dT);
				const b = wH - 240;

				el_uiselect.dataset.orgtop = dT;

				if (a > b) {
                    if (!Global.state.browser.ie) {
                        el_html.scrollTo({
                            top: a - b + elH + 10 + dT,
                            behavior: 'smooth'
                        });
                    } else {
                        el_html.scrollTop = a - b + elH + 10 + dT;
                    }
				} 
			}

			function optConfirm(e) {
				const el_confirm = e.currentTarget;
				const el_uiSelect = el_confirm.closest('.ui-select');
				const el_body = doc.querySelector('body');
				const el_btn = el_uiSelect.querySelector('.ui-select-btn');
				const el_wrap = el_uiSelect.querySelector('.ui-select-wrap');
				const el_select = el_uiSelect.querySelector('select');
				const orgTop = el_uiSelect.dataset.orgtop;
				
				console.log(el_btn.dataset.id, el_select.selectedIndex);

				Global.select.act({ 
					id: el_btn.dataset.id, 
					current: el_select.selectedIndex
				});

				el_body.classList.remove('dim-select');
				el_btn.dataset.expanded = false;
				el_btn.setAttribute('aria-expanded', false)
				el_btn.focus();

				el_uiSelect.classList.remove('on');
				el_wrap.classList.remove('on');
				el_wrap.classList.remove('top');
				el_wrap.classList.remove('bottom');
				el_wrap.setAttribute('aria-hidden', true);

				console.log(el_select);
				//el_select.onchange();

				//$('html, body').scrollTop(orgTop);
			}

		},
		back: function(e){
			e.preventDefault();

			let isTure = '';
            
            for (let i = 0, len = e.path.length; i < len; i++) {
                const path = e.path[i];

                isTure = isTure + path.classList;
			}

			(isTure.indexOf('ui-select-wrap') < 0) && Global.select.hide();
		},
		scrollSelect: function(v, el){
			const _opts = el.querySelectorAll('.ui-select-opt');
			const el_uiSelect = el.closest('.ui-select');
			const el_btn = el_uiSelect.querySelector('.ui-select-btn');

            if (!Global.state.browser.ie) {
                el.scrollTo({
                    top: 40 * v,
                    behavior: 'smooth'
                });
            } else {
                el.scrollTop = 40 * v;
            }

			for (let i = 0, len = _opts.length; i < len; i++) {
				_opts[i].classList.remove('selected');
				
				if (v === i) {
					_opts[i].classList.add('selected');
					el_uiSelect.dataset.current = i;
				} 
			}

			// Global.select.act({ 
			// 	id: el_btn.dataset.id, 
			// 	current: v
			// });
		},
		wrapTouch: function(e){
			const that = e.currentTarget;
			const wrap = that.querySelector('.ui-select-opts');

			let timerScroll = null;
			let touchMoving = false;
			const wrapT = that.getBoundingClientRect().top;
			let getScrollTop = Math.abs(wrap.getBoundingClientRect().top - wrapT);
			let currentN = 0;

			clearTimeout(timerScroll);
			
			that.addEventListener('touchmove', actMove);
			

			function actMove(){
				touchMoving = true;
				getScrollTop = Math.abs(wrap.getBoundingClientRect().top - wrapT);

				that.addEventListener('touchcancel', actEnd);
				that.addEventListener('touchend', actEnd);
			}
			function actEnd(){
				const that = this;

				function scrollCompare(){
					timerScroll = setTimeout(function(){

						if (getScrollTop !== Math.abs(wrap.getBoundingClientRect().top - wrapT)) {
							getScrollTop = Math.abs(wrap.getBoundingClientRect().top - wrapT);
							scrollCompare();
						} else {
							currentN = Math.floor((Math.floor(getScrollTop) + 20) / 40);
							Global.select.scrollSelect(currentN,  that);
						}
					},100);
				} 

				touchMoving && scrollCompare();
				that.removeEventListener('touchmove', actMove);
			}
		},
		optClick: function(e) {
			console.log(e);

			const _uiSelect = this.closest('.ui-select');
			const _btn = _uiSelect.querySelector('.ui-select-btn');
			const el_select = _uiSelect.querySelector('select');
			const _wrap = _uiSelect.querySelector('.ui-select-wrap');
			const idx = Global.parts.getIndex(this);
			const isMobile = Global.state.device.mobile;

			

			if (!isMobile) {
				Global.select.act({ 
					id: _btn.dataset.id, 
					current: idx 
				});

				_btn.focus();
				Global.select.hide();
				el_select.onchange();
			} else {
				Global.select.scrollSelect(idx, _wrap);
			}
		},
		selectOver: function() {
			const body = doc.querySelector('body');

			body.dataset.selectopen = false;
		},
		selectChange: function(e) {
			const that = e.target;
			const uiSelect = that.closest('.ui-select');
			
			uiSelect.dataset.fn;

			Global.select.act({
				id: that.id,
				current: that.options.selectedIndex,
				original:true
			});
		},
		hide: function(){
			const el_body = doc.querySelector('body');
			const el_selects = doc.querySelectorAll('.ui-select');
			const el_selectWraps = doc.querySelectorAll('.ui-select-wrap[aria-hidden="false"]');
			const el_btns = doc.querySelectorAll('.ui-select-btn[aria-expanded="true"]');
			let el_select, el_wrap, orgTop;

			el_body.classList.remove('dim-select');
			console.log(el_btns);

            for (let i = 0, len = el_btns.length; i < len; i++) {
                const that = el_btns[i];

                el_select = that.closest('.ui-select');
				el_wrap = el_select.querySelector('.ui-select-wrap');
				orgTop = el_select.dataset.orgtop;

				that.dataset.expanded = false;
				that.setAttribute('aria-expanded', false);
				that.focus();
				el_select.classList.remove('on');

				el_wrap.classList.remove('on');
				el_wrap.classList.remove('top');
				el_wrap.classList.remove('bottom');
				el_wrap.setAttribute('aria-hidden', true);

                if (!Global.state.browser.ie) {
                    doc.querySelector('html, body').scrollTo({
                        top: orgTop,
                        behavior: 'smooth'
                    });
                } else {
                    doc.querySelector('html, body').scrollTop = orgTop;
                }
			}

			doc.removeEventListener('click', Global.select.back);
		},
		act: function(opt){
			const id = opt.id;
			const el_select = doc.querySelector('#' + id);
			const el_opts = el_select.querySelectorAll('option');
			const el_uiSelect = el_select.closest('.ui-select');
			const el_btn = el_uiSelect.querySelector('.ui-select-btn');
			const el_text = el_btn.querySelector('span');
			const el_btnopts = el_uiSelect.querySelectorAll('.ui-select-opt');

			// var dataCallback = el_select.data('callback'),
			// 	callback = opt.callback === undefined ? dataCallback === undefined ? false : dataCallback : opt.callback,
			let current = opt.current;
			const org = opt.original === undefined ? false : opt.original;

			if (el_uiSelect.dataset.current !== undefined) {
				current = el_uiSelect.dataset.current;
				el_select.selectedIndex = el_uiSelect.dataset.current;
			} 

			//!org && el_uiSelect.find('option').prop('selected', false).eq(current).prop('selected', true);
			if (!org) {
				el_opts[current].selected = true;

				// el_uiSelect.find('option').prop('selected', false).eq(current).prop('selected', true).trigger('change');
			} 
			//trigger 오류 확인필요
			
			const optCurrent = el_opts[current];

			(optCurrent.hidden === true) ? 
				el_btn.classList.remove('opt-hidden'):
				el_btn.classList.add('opt-hidden');

			console.log(current, optCurrent.textContent);

			el_text.textContent = optCurrent.textContent;

            for (let i = 0, len = el_btnopts.length; i < len; i++) {
                const el_btnopt = el_btnopts[i];

                el_btnopt.classList.remove('selected');
			}

			el_btnopts[current].classList.add('selected');

			Global.state.device.mobile && el_btnopts[current].focus();

			// callback && callback({ 
			// 	id: id, 
			// 	current: current, 
			// 	val: optCurrent.val() 
			// });
		}
	}

	Global.accordion = {
		options: {
			current: null,
			autoclose: false,
			callback: false,
			effect: Global.state.effect.easeInOut,
			effTime: '.2'
		},
		init: function(option){
			const accoId = option.id;
			const callback = option.callback !== undefined ? option.callback : false;
			let current = option.callback !== undefined ? option.current : null;
			let autoclose = option.callback !== undefined ? option.autoclose : false;
			const el_acco = doc.querySelector('#' + accoId);
			const el_wrap = el_acco.querySelectorAll(':scope > .ui-acco-wrap');
			const len = el_wrap.length;
			const para = Global.para.get('acco');
			let paras;
			let paraname;
			
			//set up : parameter > current
			if (!!para) {
				if (para.split('+').length > 1) {
					//2 or more : acco=exeAcco1*2+exeAcco2*3
					paras = para.split('+');
	
					for (var j = 0; j < paras.length; j++ ) {
						paraname = paras[j].split('*');
						opt.id === paraname[0] ? current = [Number(paraname[1])] : '';
					}
				} else {
					//only one : tab=1
					if (para.split('*').length > 1) {
						paraname = para.split('*');
						opt.id === paraname[0] ? current = [Number(paraname[1])] : '';
					} else {
						current = [Number(para)];
					}
				}
			}

			el_acco.dataset.n = len;

			//set up : parameter > current
			for (let i = 0; i < len; i++) {
				const this_wrap = el_wrap[i];
				const el_tit = this_wrap.querySelector(':scope > .ui-acco-tit');
				const el_pnl = this_wrap.querySelector(':scope > .ui-acco-pnl');
				const el_btn = el_tit.querySelector('.ui-acco-btn');

				this_wrap.dataset.n = i;
				(el_tit.tagName !== 'DT') && el_tit.setAttribute('role','heading');

				el_btn.id = accoId + 'Btn' + i;
				el_btn.dataset.selected = false;
				el_btn.setAttribute('aria-expanded', false);
				el_btn.removeAttribute('data-order');
				el_btn.dataset.n = i;

				if (!!el_pnl) {
					el_pnl.id = accoId + 'Pnl' + i;
					el_btn.setAttribute('aria-controls', el_pnl.id);
					el_pnl.setAttribute('aria-labelledby', el_btn.id);
					el_pnl.dataset.height = el_pnl.offsetHeight;
					el_pnl.setAttribute('aria-hidden', true);
					el_pnl.dataset.n = i;
					Global.parts.toggleSlide({
						el: el_pnl, 
						state: 'hide'
					});

					if (current === 'all') {
						el_btn.dataset.selected = true;
						el_btn.setAttribute('aria-expanded', true);
						el_pnl.setAttribute('aria-hidden', false);
						Global.parts.toggleSlide({
							el: el_pnl, 
							state: 'show'
						});
						
					}
				}

				if (i === 0) {
					el_btn.dataset.order = 'first';
				}

				if (i === len - 1) {
					el_btn.dataset.order = 'last';
				}

				el_btn.removeEventListener('click', Global.accordion.evtClick);
				el_btn.removeEventListener('keydown', Global.accordion.evtKeys);
				el_btn.addEventListener('click', Global.accordion.evtClick);
				el_btn.addEventListener('keydown', Global.accordion.evtKeys);
			}

			const currentLen = current === null ? 0 : current.length;
			
			if (current !== 'all') {
				for (let i = 0; i < currentLen; i++) {
					const this_wrap = el_acco.querySelector('.ui-acco-wrap[data-n="'+ current[i] +'"]');
	
					const _tit = this_wrap.querySelector(':scope > .ui-acco-tit');
					const _btn = _tit.querySelector('.ui-acco-btn');
					const _pnl = this_wrap.querySelector(':scope > .ui-acco-pnl');
	
					if (!!_pnl) {
						_btn.dataset.selected = true;
						_btn.setAttribute('aria-expanded', true);
						_pnl.setAttribute('aria-hidden', false);
						Global.parts.toggleSlide({
							el: _pnl, 
							state: 'show'
						});
					}
				}
			}
			
			!!callback && callback();

			Global.accordion[accoId] = {
				callback: callback,
				autoclose: autoclose,
				current: current
			};
		},
		evtClick: function(e){
			const that = e.currentTarget;
			const btnId = that.id;
			const n = that.dataset.n;
			
			let accoId = btnId.split('Btn');
			accoId = accoId[0];

			if (!!btnId) {
				e.preventDefault();

				Global.accordion.toggle({ 
					id: accoId, 
					current: [n]
				});
			}
		},
		evtKeys: function(e){
			const that = e.currentTarget;
			const btnId = that.id;
			const n = Number(that.dataset.n);
			const keys = Global.state.keys;

			let accoId = btnId.split('Btn');
			accoId = accoId[0];

			const acco = doc.querySelector('#' + accoId);
			const len = Number(acco.dataset.n);

			switch(e.keyCode){
				case keys.up:	
				case keys.left: upLeftKey(e);
					break;

				case keys.down:
				case keys.right: downRightKey(e);
					break;

				case keys.end: endKey(e);
					break;

				case keys.home: homeKey(e);
					break;
			}
			
			function upLeftKey(e) {
				e.preventDefault();

				that.dataset.order !== 'first' ?
				acco.querySelector('#' + accoId + 'Btn' + (n - 1)).focus():
				acco.querySelector('#' + accoId + 'Btn' + (len - 1)).focus();
			}
			function downRightKey(e) {
				e.preventDefault();

				that.dataset.order !== 'last' ?
				acco.querySelector('#' + accoId + 'Btn' + (n + 1)).focus():
				acco.querySelector('#' + accoId + 'Btn0').focus();
			}
			function endKey(e) {
				e.preventDefault();
				
				acco.querySelector('#' + accoId + 'Btn' + (len - 1)).focus();
			}
			function homeKey(e) {
				e.preventDefault();

				acco.querySelector('#' + accoId + 'Btn0').focus();
			}
		},
		toggle: function(opt){
			const id = opt.id;
			const el_acco = doc.querySelector('#' + id);
			const current = opt.current === undefined ? null : opt.current;
			const callback = opt.callback === undefined ? opt.callback : Global.accordion[id].callback;
			const state = opt.state === undefined ? 'toggle' : opt.state;
			const autoclose = opt.autoclose === undefined ? Global.accordion[id].autoclose : opt.autoclose;

			console.log(current,  state, autoclose);

			let el_wraps = el_acco.querySelectorAll(':scope > .ui-acco-wrap');
			let el_pnl;
			let el_tit;
			let el_btn;
			let len = el_wraps.length;
			let check = 0;
			
			const currentLen = current === null ? 0 : current.length;

			if (current !== 'all') {
				for (let i = 0; i < currentLen; i++) {
					const this_wrap = el_acco.querySelector('.ui-acco-wrap[data-n="'+ current[i] +'"]');

					el_tit = this_wrap.querySelector(':scope > .ui-acco-tit');
					el_pnl = this_wrap.querySelector(':scope > .ui-acco-pnl');
					el_btn = el_tit.querySelector('.ui-acco-btn');
	
					if (!!el_pnl) {
						if (state === 'toggle') {
							(el_btn.dataset.selected === 'true') ? act('down') : act('up');
						} else {
							(state === 'open') && act('up');
							(state === 'close') && act('down');
						}
					}
				}
				!!callback && callback({ 
					id:id, 
					current:current
				});
			} else if (current === 'all') {
				checking();
			}
	
			function checking() {
				//state option 
				if (state === 'open') {
					check = 0;
					el_acco.dataset.allopen = false;
				} else if (state === 'close') {
					check = len;
					el_acco.dataset.allopen = true;
				}
				//all check action
				if (el_acco.dataset.allopen !== 'true') {
					el_acco.dataset.allopen = true;
					act('down');
				} else {
					el_acco.dataset.allopen = false;
					act('up');
				}
			}
			function act(v) {
				const isDown = !(v === 'down');

				//set up close
				if (!!autoclose) {
                    for (let i = 0, len = el_wraps.length; i < len; i++) {
                        const wrap = el_wraps[i];
       
						const _tit = wrap.querySelector(':scope > .ui-acco-tit');
						const _btn = _tit.querySelector('.ui-acco-btn');
						const _pnl = wrap.querySelector(':scope > .ui-acco-pnl');
						
						console.log(_pnl.offsetHeight);

						if (!!_pnl) {
							_btn.dataset.selected = false;
							_btn.setAttribute('aria-expanded', false);
							_pnl.setAttribute('aria-hidden', true);
						}
					}
				}
	
				if (current === 'all') {
                    for (let i = 0, len = el_wraps.length; i < len; i++) {
                        const wrap = el_wraps[i];

						const _tit = wrap.querySelector(':scope > .ui-acco-tit');
						const _btn = _tit.querySelector('.ui-acco-btn');
						const _pnl = wrap.querySelector(':scope > .ui-acco-pnl');
						
						if (!!_pnl) {
							_btn.dataset.selected = isDown;
							_btn.setAttribute('aria-expanded', isDown);
							_pnl.setAttribute('aria-hidden', !isDown);
							Global.parts.toggleSlide({
								el: _pnl, 
								state: !isDown ? 'show' : 'hide'
							});
						}
					}
				} else {
					el_btn.dataset.selected = isDown;
					el_btn.setAttribute('aria-expanded', isDown);

					if (!!el_pnl) {
						console.log(!isDown);
						el_pnl.setAttribute('aria-hidden', isDown);
						Global.parts.toggleSlide({
							el: el_pnl, 
							state: 'toggle'
						});
					}
				}
			}
		}
	}
	
	Global.dropdown = {
		options: {
			ps: 'BL',
			area: doc.querySelector('body'),
			src: false,
			offset: true,
			callback:false
		},
		init: function(option){
            const id = option.id;
            const ps = option.ps !== undefined ? option.ps : 'BL';
			const area = option.area !== undefined ? option.area : doc.querySelector('body');
			const src = option.src !== undefined ? option.src : false;
			const offset = option.offset !== undefined ? option.offset : true;
			const callback = option.callback !== undefined ? option.callback : false;
            
			//ajax 
			if (!!src && !doc.querySelector('[data-id="' + id + '"]')) {
				Global.ajax.init({
					area: area,
					url: src,
					add: true,
					callback: function(){
						setDropdown();
					}
				});
			} else {
				setDropdown();
			}
			
			//set
			function setDropdown(){
				const el_btn = doc.querySelector('#' + id);
				const el_pnl = doc.querySelector('[data-id="'+ id +'"]'); 
				const el_close = el_pnl.querySelector('.ui-drop-close');

				//set up
				el_btn.setAttribute('aria-expanded', false);
				el_btn.dataset.ps = ps;
				el_pnl.setAttribute('aria-hidden', true);
				el_pnl.setAttribute('aria-labelledby', id);
				el_pnl.dataset.id = id;
				el_pnl.dataset.ps = ps;

				//event
				el_btn.addEventListener('click', action);
				el_close.addEventListener('click', actionClose);

				function actionClose(){
					const id = this.closest('.ui-drop-pnl').dataset.id;

					Global.dropdown.toggle({ 
						id: id 
					});
					doc.querySelector('#' + id).focus();
				}
				function action(e) {
					e.preventDefault();
					const that = e.currentTarget;
	
					that.dataset.sct = doc.documentElement.scrollTop;
					Global.dropdown.toggle({ 
						id: that.id,
					});
				}

				!!callback && callback();
			}
		},
		back: function(e){
			e.preventDefault();

			let isTure = '';

            for (let i = 0, len = e.path.length; i < len; i++) {
                const path = e.path[i];

                isTure = isTure + path.classList;
			}

			(isTure.indexOf('ui-drop-pnl') < 0) && Global.dropdown.hide();
		},
		toggle: function(opt) {
			const id = opt.id;
			const el_btn = doc.querySelector('#' + id);
			const el_pnl = doc.querySelector('.ui-drop-pnl[data-id="'+ id +'"]');
			const state = opt.state !== undefined ? opt.state : 'toggle';
			let btnExpanded =  el_btn.getAttribute('aria-expanded');

			let ps = el_btn.dataset.ps;
	
			if (!!el_btn.dataset.ps) {
				ps = el_btn.dataset.ps;
			}
			
			if (state === 'open') {
				btnExpanded = 'false';
			} else if (state === 'close') {
				btnExpanded = 'true';
			}
			
			btnExpanded === 'false' ? pnlShow(): pnlHide();

			function pnlShow(){
				const elBody = doc.querySelector('body');

				(!el_btn.closest('.ui-drop-pnl')) && Global.dropdown.hide();

				Global.focus.loop({
					selector: doc.querySelector('.ui-drop-pnl[data-id="'+ id +'"]'),
					callback:pnlHide
				});

				el_btn.setAttribute('aria-expanded', true);	
				el_pnl.setAttribute('aria-hidden', false)
				el_pnl.classList.add('on');

				const sT = Math.floor(doc.documentElement.scrollTop);
				const btn_w = Math.ceil(el_btn.offsetWidth);
				const btn_h = Math.ceil(el_btn.offsetHeight);
				const btn_t = Math.ceil(el_btn.getBoundingClientRect().top);
				const btn_l = Math.ceil(el_btn.getBoundingClientRect().left);
				const pnl_w = Math.ceil(el_pnl.offsetWidth);
				const pnl_h = Math.ceil(el_pnl.offsetHeight);

				switch (ps) {
					case 'BL': 
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l + 'px';
						break;
					case 'BC': 
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l - ((pnl_w - btn_w) / 2) + 'px';
						break;
					case 'BR': 
						el_pnl.style.top = btn_t + sT + btn_h + 'px';
						el_pnl.style.left = btn_l - (pnl_w - btn_w) + 'px';
						break;
					case 'TL': 
						el_pnl.style.top = btn_t + sT - pnl_h + 'px';
						el_pnl.style.left = btn_l + 'px';
						break;
					case 'TC': 
						el_pnl.style.top = btn_t + sT - pnl_h + 'px';
						el_pnl.style.left = btn_l + 'px';
						break;
					case 'TR': 
						el_pnl.style.top = btn_t + sT - pnl_h + 'px';
						el_pnl.style.left =  btn_l - (pnl_w - btn_w) + 'px';
						break;
					case 'RT': 
						el_pnl.style.top = btn_t + sT + 'px';
						el_pnl.style.left = btn_l + btn_w + 'px';
						break;
					case 'RM': 
					
						el_pnl.style.top = btn_t + sT - ((pnl_h - btn_h) / 2) + 'px';
						el_pnl.style.left = btn_l + btn_w + 'px';
						break;
					case 'RB': 
						el_pnl.style.top = btn_t + sT - (pnl_h - btn_h) + 'px';
						el_pnl.style.left = btn_l + btn_w + 'px';
						break;
					case 'LT': 
						el_pnl.style.top = btn_t + sT + 'px';
						el_pnl.style.left = btn_l - pnl_w + 'px';
						break;
					case 'LM': 
						el_pnl.style.top = btn_t + sT - ((pnl_h - btn_h) / 2) + 'px';
						el_pnl.style.left = btn_l - pnl_w + 'px';
						break;
					case 'LB': 
					el_pnl.style.top = btn_t + sT - (pnl_h - btn_h) + 'px';
						el_pnl.style.left = btn_l - pnl_w + 'px';
						break; 
					case 'CM': 
						el_pnl.style.top = '50%';
						el_pnl.style.left = '50%';
						el_pnl.style.marginTop = (pnl_h / 2 ) * -1 + 'px';
						el_pnl.style.marginLeft = (pnl_w / 2 ) * -1 + 'px';
						break;
				}
				
				setTimeout(function(){
					elBody.classList.add('dropdownOpened');
					setTimeout(function(){
						el_pnl.focus();
					},0);
				},0);

				doc.removeEventListener('click', Global.dropdown.back);
				setTimeout(function(){
					doc.addEventListener('click', Global.dropdown.back);
				},0);
			}
			function pnlHide(){
				const in_pnl = el_btn.closest('.ui-drop-pnl');
				const elBody = doc.querySelector('body');

				if (!in_pnl) {
					elBody.classList.remove('dropdownOpened');
				}
	
				el_btn.setAttribute('aria-expanded', false)
				el_btn.focus();
				el_pnl.setAttribute('aria-hidden', true)
				el_pnl.setAttribute('tabindex', -1)
				el_pnl.classList.remove('on');
			}
		}, 
		hide: function() {
			const elBody = doc.querySelector('body')
			const elDrops = doc.querySelectorAll('.ui-drop');
			const elDropPnls = doc.querySelectorAll('.ui-drop-pnl[aria-hidden="false"]');

			elBody.classList.remove('dropdownOpened');

            for (let i = 0, len = elDrops.length; i < len; i++) {
                const that = elDrops[i];

                that.setAttribute('aria-expanded', false);
			}

            for (let i = 0, len = elDropPnls.length; i < len; i++) {
                const that = elDropPnls[i];

                that.setAttribute('hidden', true);
				that.setAttribute('tabindex', -1);
				that.classList.remove('on');
			}

			doc.removeEventListener('click', Global.dropdown.back);
		}
	}	

	Global.modal = {
		/**
		 * options
		 * type: normal | system
		 * ps: center | top | bottom
		 */
		options : {
			type: 'normal', 
			ps: 'center',
			full: false,
			src: false,
			remove: false,
			width: false,
			height: false,
			callback:false,
			closeCallback:false,
			endfocus:false,
			mg: 20,

			sMessage: '',
			sBtnConfirmTxt: 'Ok',
			sBtnCancelTxt: 'Cancel',
			sClass: 'type-system',
			sZindex: false,
			sConfirmCallback: false,
			sCancelCallback: false
		},
		optionsClose : {
			remove: false,
			callback: false,
			endfocus: false
		},
		show: function(option){
			
			const elBody = doc.querySelector('body');
            const type = option.type !== undefined ? option.type : 'normal'; 
			const ps = option.ps !== undefined ? option.ps : 'center';
			const full = option.full !== undefined ? option.full : false;
			const src = option.src !== undefined ? option.src : false;
			const width = option.width !== undefined ? option.width : false;
			const height = option.height !== undefined ? option.height : false;
			const callback = option.callback !== undefined ? option.callback :false;
			const callbackClose = option.callbackClose !== undefined ? option.callbackClose :false;
            
            let endfocus = option.endfocus !== undefined ? option.endfocus : false;
			let mg = option.mg !== undefined ? option.mg : 20;
            let id = option.id;
            let remove = option.remove !== undefined ? option.remove : false;
            console.log(endfocus ,  document.activeElement);
            endfocus = endfocus === false ? document.activeElement : endfocus;
			const scr_t = doc.documentElement.scrollTop;
			let timer;
			
			//system
			const sMessage = option.sMessage !== undefined ? option.sMessage : '';
			const sBtnConfirmTxt = option.sBtnConfirmTxt !== undefined ? option.sBtnConfirmTxt : 'Ok';
			const sBtnCancelTxt = option.sBtnCancelTxt !== undefined ? option.sBtnCancelTxt : 'Cancel';
			const sClass = option.sClass !== undefined ? option.sClass : 'type-system';
			const sZindex = option.sZindex !== undefined ? option.sZindex : false;
			const sConfirmCallback = option.sConfirmCallback !== undefined ? option.sConfirmCallback : false;
			const sCancelCallback = option.sCancelCallback !== undefined ? option.sCancelCallback : false;

			//setting
			if (type === 'normal') {
				//modal
				if (!!src && !doc.querySelector('#' + option.id)) {
					Global.ajax.init({
						area: elBody,
						url: src,
						add: true,
						callback: function(){
							act();
						}
					});
				} else {
					act();
				}
                console.log(endfocus);
				endfocus.dataset.focus = id;
			} else {
				//system modal
				endfocus = null;
				remove = true;
				id = 'uiSystemModal';
				makeSystemModal();
			}

			function makeSystemModal(){
				let htmlSystem = '';
				
				htmlSystem += '<div class="ui-modal type-system '+ sClass +'" id="uiSystemModal" role="dialog" aria-modal="true" aria-live="polite">';
				htmlSystem += '<div class="ui-modal-wrap">';
				htmlSystem += '<div class="ui-modal-body">';
				htmlSystem += sMessage;
				htmlSystem += '</div>';
				htmlSystem += '<div class="ui-modal-footer">';
				htmlSystem += '<div class="btn-wrap">';

				if (type === 'confirm') {
					htmlSystem += '<button type="button" class="btn-base-m text ui-modal-cancel"><span>'+ sBtnCancelTxt +'</span></button>';
				}

				htmlSystem += '<button type="button" class="btn-base-m text primary ui-modal-confirm"><span>'+ sBtnConfirmTxt +'</span></button>';	
				htmlSystem += '</div>';
				htmlSystem += '</div>';
				htmlSystem += '</div>';
				htmlSystem += '</div>';

				elBody.insertAdjacentHTML('beforeend', htmlSystem);

				htmlSystem = '';
				act();
			}

			function act(){
				const elModal = doc.querySelector('#' + id);
				const elModals = doc.querySelectorAll('.ui-modal');

                for (let i = 0, len = elModals.length; i < len; i++) {
                    const md = elModals[i];

                    md.classList.remove('current');
					elBody.classList.add('scroll-no');
				}
				
				(!elModal.querySelector('.ui-modal-dim')) && elModal.insertAdjacentHTML('beforeend','<div class="ui-modal-dim"></div>');

				const elModalWrap = elModal.querySelector('.ui-modal-wrap');
				const elModalBody = elModalWrap.querySelector('.ui-modal-body');
				const elModalHeader = elModalWrap.querySelector('.ui-modal-header');
				const elModalFooter = elModalWrap.querySelector('.ui-modal-footer');
				const elModalTit = elModal.querySelector('.ui-modal-tit');
				const elModalDim = elModal.querySelector('.ui-modal-dim');
				const elModalCancel = elModal.querySelector('.ui-modal-cancel');
				const elModalConfirm = elModal.querySelector('.ui-modal-confirm');
				const elModalClose = elModal.querySelector('.ui-modal-close');
				const elModalOpen = doc.querySelectorAll('.ui-modal.open');
				const openLen = !!elModalOpen ? elModalOpen.length : 0;

				doc.querySelector('html').classList.add('is-modal');
				elModal.classList.add('n' + openLen);
				elModal.classList.remove('close');
				elModal.classList.remove('type-full');
				elModal.classList.remove('ps-center');
				elModal.classList.remove('ps-top');
				elModal.classList.remove('ps-bottom');
				elModal.classList.add('current');
				elModal.classList.add('ready');
				elModal.dataset.remove = remove;
				elModal.dataset.n = openLen;
				elModal.dataset.scrolltop = scr_t;
				elModal.setAttribute('role', 'dialog');
				!!elModalTit && elModalTit.setAttribute('tabindex', 0);
				elModalBody.style.overflowY = 'auto';

				const headerH = !!elModalHeader ? elModalHeader.offsetHeight : 0;
				const footerH = !!elModalFooter ? elModalFooter.offsetHeight : 0;
				const space = !!full ? 0 : mg;

				//[set] position
				switch (ps) {
					case 'center' :
						elModal.classList.add('ps-center');
						break;
					case 'top' :
						elModal.classList.add('ps-top');
						break;
					case 'bottom' :
						elModal.classList.add('ps-bottom');
						break;
					default :
						elModal.classList.add('ps-center');
						break;
				}
				
				//[set] full type / width & height
				(!!full) && elModal.classList.add('type-full');
				(!!width) ? elModalWrap.style.width = width : '';
				elModalBody.style.height = (!height) ? '100%' : height + 'px';
				elModalBody.style.maxHeight = win.innerHeight - (headerH + footerH + (space * 2))  + 'px';
				elModalBody.style.maxWidth = win.innerWidth - (space * 2) + 'px';
				
				clearTimeout(timer);
				timer = setTimeout(function(){
					Global.focus.loop({ 
						selector: elModal, 
					});

					elModal.classList.add('open');
					(!!sZindex) ? elModal.style.zIndex = sZindex : '';
					(win.innerHeight < elModalWrap.offsetHeight) ? 
						elModal.classList.add('is-over'):
						elModal.classList.remove('is-over');

					!!elModalTit && elModalTit.focus();
					!!callback && callback(id);

					//dim event
					elModalDim.addEventListener('click', Global.modal.dimAct);
				},150);

				//close button event
				if (!!elModalClose) {
					elModalClose.addEventListener('click', closeAct);
				}
				function closeAct(e){
					const elThis = e.currentTarget;
					const elThisModal = elThis.closest('.ui-modal');

					netive.modal.hide({ 
						id: elThisModal.id, 
						remove: remove,
						callbackClose: callbackClose
					});
				}

				//systyem modal confirm & cancel callback
				elModalConfirm && elModalConfirm.addEventListener('click', sConfirmCallback);
				elModalCancel && elModalCancel.addEventListener('click', sCancelCallback);
			
				//transition end event
				elModalWrap.addEventListener('transitionend', modalTrEnd);
				function modalTrEnd(){
					if (!!full) {
						elModal.classList.add('fix-header');
						elModalBody.style.paddingTop = (headerH + 10)  + 'px';
					}
				}

				//resize event
				let timerResize;
				win.addEventListener('resize', winResize);
				function winResize() {
					clearTimeout(timerResize);
					timerResize = setTimeout(function(){
						Global.modal.reset();
					}, 200);
				}
			}
		},
		dimAct: function() {
			const elOpens = doc.querySelectorAll('.ui-modal.open');
			let openN = [];

            for (let i = 0, len = elOpens.length; i < len; i++) {
                const elOpen = elOpens[i];

                elOpen.dataset.n && openN.push(elOpen.dataset.n);
			}

			const elCurrent = doc.querySelector('.ui-modal.open[data-n="'+ Math.max.apply(null, openN) +'"]');
			const currentID = elCurrent.id;

			//system modal 제외
			if (currentID !== 'uiSystemModal') {
				netive.modal.hide({ 
					id: currentID, 
					remove: elCurrent.dataset.remove
				});
			}
		},
		reset: function() {
			const elModals = doc.querySelectorAll('.ui-modal.open.ps-center');

            for (let i = 0, len = elModals.length; i < len; i++) {
                const elModal = elModals[i];

                const elModalHead = elModal.querySelector('.ui-modal-header');
				const elModalBody = elModal.querySelector('.ui-modal-body');
				const elModalFoot = elModal.querySelector('.ui-modal-footer');
				const h_win = win.innerHeight;
				const h_head = elModalHead.outerHeight();
				const h_foot = elModalFoot.outerHeight();
				const h = h_win - (h_head + h_foot);

				if (Global.browser.size !== 'desktop') {
					elModalBody.style.minHeight = h + 'px';
					elModalBody.style.maxHeight = h + 'px';
				} else {
					elModalBody.style.minHeight = '';
					elModalBody.style.maxHeight = '';
				}
			}
		},
		hide: function(option){
            const id = option.id;
            const type = option.type !== undefined ? option.type : 'normal'; 

			const remove = option.remove !== undefined ? option.remove : false;
			const callback = option.callback !== undefined ? option.callback : false;
			let endfocus = option.endfocus !== undefined ? option.endfocus : false;

            const elModal = doc.querySelector('#' + id);
			const elBody = doc.querySelector('body');
			const elHtml = doc.querySelector('html');
			const elModals = doc.querySelectorAll('.ui-modal');

			elModal.classList.add('close');
			elModal.classList.remove('open')
			elModal.classList.remove('fix-header');
			
			const elOpen = doc.querySelectorAll('.ui-modal.open');
			const len = (elOpen.length > 0) ? elOpen.length : false;

			let timer;
			let elModalPrev = false;
			
            for (let i = 0, len = elModals.length; i < len; i++) {
                const md = elModals[i];
				md.classList.remove('current');
			}

			if (!!len) {
				elModalPrev = doc.querySelector('.ui-modal.open.n' + (len - 1));
				elModalPrev.classList.add('current');
			}

			//시스템팝업이 아닌 경우
			if (type !== 'system') {
				if (!len) {
					//단일
					endfocus = endfocus === false ? 
						doc.querySelector('[data-focus="'+id+'"]') : 
						opt.endfocus;

					//$('html').off('click.uimodaldim');
					elHtml.classList.remove('is-modal');
				} else {
					//여러개
					endfocus = endfocus === false ? 
						doc.querySelector('[data-focus="'+id+'"]') : 
						opt.endfocus;
				}
			}

			Global.scroll.move({
				top: Number(elModal.dataset.scrolltop)
			});
			
			clearTimeout(timer);
			timer = setTimeout(function(){
				const elWrap = elModal.querySelector('.ui-modal-wrap');
				const elOpen = doc.querySelectorAll('.ui-modal.open');
				const len = !!elOpen ? elOpen.length : false;
	
				elWrap.removeAttribute('style');
				elBody.removeAttribute('style');
				elModal.dataset.n = null;
				
				if (!len) {
					elHtml.classList.remove('scroll-no');
					elBody.classList.remove('scroll-no');
				}

				(remove === 'true') && elModal.remove();
				!!callback && callback(id);
				!!endfocus && endfocus.focus();
			},210);
		}, 
		hideSystem: function() {
			netive.modal.hide({ 
				id: 'uiSystemModal', 
				type: 'system', 
				remove: 'true'
			});
		}
	}

	Global.toast = {
		timer : null,
		/**
		 * options 
		 * delay: short[2s] | long[3.5s]
		 * status: assertive[중요도 높은 경우] | polite[중요도가 낮은 경우] | off[default]
		 */
		options : {
			delay: 'short',
			classname : '',
			conts: '',
			status: 'assertive' 
		},
		show : function(option) {
			const delay = option.delay !== undefined ? option.delay : 'short';
			const classname = option.classname !== undefined ? option.classname  : '';
			const conts = option.conts !== undefined ? option.conts : '';
			const status = option.status !== undefined ? option.status : 'assertive';

            const el_body = document.querySelector('body');

			let toast = '<div class="ui-toast toast '+ classname +'" aria-live="'+ status +'">'+ conts +'</div>';
			let time = (delay === 'short') ? 2000 : 3500;

			if (delay === 'short') {
				time = 2000;
			} else if(delay === 'long') {
				time = 3500;
			} else {
				time = delay;
			}

			if (!!doc.querySelector('.ui-toast-ready')) {
				clearTimeout(Global.toast.timer);
				el_body.classList.remove('ui-toast-show');
				el_body.classList.remove('ui-toast-ready');
				doc.querySelector('.ui-toast').removeEventListener('transitionend', act);
				doc.querySelector('.ui-toast').remove();
			} 

			el_body.insertAdjacentHTML('beforeend', toast);
			toast = null;
			
			const el_toast = doc.querySelector('.ui-toast');
			
			el_body.classList.add('ui-toast-ready');

			setTimeout(function(){
				el_body.classList.add('ui-toast-show');
				el_toast.addEventListener('transitionend', act);
			},0);

			function act(e){
				const that = e.currentTarget;

				that.removeEventListener('transitionend', act);
				that.classList.add('on');
				Global.toast.timer = setTimeout(Global.toast.hide, time);
			}
		},
		hide : function(){
			const el_body = doc.querySelector('body');
			const el_toast = doc.querySelector('.ui-toast');

			if (!!el_toast) {
				clearTimeout(Global.toast.timer);
				el_body.classList.remove('ui-toast-show');

				el_toast.removeEventListener('transitionend', act);
				el_toast.addEventListener('transitionend', act);

				function act(e){
					const that = e.currentTarget;

					that.removeEventListener('transitionend', act);
					that.remove();
					el_body.classList.remove('ui-toast-ready');
				}
			}
		}
	}

	Global.tooltip = {
		// options: {
		// 	visible: null,
		// 	id: false,
		// 	ps: false
		// },
		timerShow: null,
		timerHide: null,
		show: function(e){
			e.preventDefault();

			const elBody = doc.querySelector('body');
			const el = e.currentTarget;
			const elId = el.getAttribute('aria-describedby');
			const elSrc = el.dataset.src;
			const evType = e.type;

			let elTooltip = doc.querySelector('#' + elId);

			if (!!elSrc && !elTooltip) {	
				elBody.insertAdjacentHTML('beforeend', '<div class="ui-tooltip" id="'+ elId +'" role="tooltip" aria-hidden="true"><div class="ui-tooltip-arrow"></div>');
				Global.ajax.init({
					area: doc.querySelector('#' + elId),
					url: elSrc,
					add: true,
					callback: function(){						
						act();
					}
				});
			} else {
				if (el.dataset.view !== 'fix') {
					act();
				} else {
					if (evType === 'click') {
						el.dataset.view = 'unfix';
						Global.tooltip.hide(e);
					} else {
						act();
					}
				}
			}

			function act(){
				elTooltip = doc.querySelector('#' + elId);

				const tooltips = doc.querySelectorAll('.ui-tooltip');
				const btns = doc.querySelectorAll('.ui-tooltip-btn');
				const elArrow = elTooltip.querySelector('.ui-tooltip-arrow');
				const classToggle = evType !== 'click' ? 'add' : 'remove';
				
				if (evType === 'click' && el.dataset.view !== 'fix') {

                    for (let i = 0, len = tooltips.length; i < len; i++) {
                        const tts = tooltips[i];

                        if (tts.id !== elId) {
							tts.removeAttribute('style');
							tts.setAttribute('aria-hidden', true);
						}
					}

                    for (let i = 0, len = btns.length; i < len; i++) {
                        const bs = btns[i];

                        bs.dataset.view = 'unfix';
					}

					el.dataset.view = 'fix';

					doc.removeEventListener('click', Global.tooltip.back);
					setTimeout(function(){
						doc.addEventListener('click', Global.tooltip.back);
					},0);
				}

                for (let i = 0, len = tooltips.length; i < len; i++) {
                    const tts = tooltips[i];

                    if (tts.id !== elId) {
						tts.classList.remove('hover');
					}
				}

				elTooltip.classList[classToggle]('hover');

				const elT = el.getBoundingClientRect().top;
				const elL = el.getBoundingClientRect().left;
				const elW = el.offsetWidth;
				const elH = el.offsetHeight;
				const wW = win.innerWidth;
				const wH = win.innerHeight;
				const dT = doc.documentElement.scrollTop;
				const dL = doc.documentElement.scrollLeft;

				clearTimeout(Global.tooltip.timerHide);
				Global.tooltip.timerShow = setTimeout(function(){
					const tW = Math.floor(elTooltip.offsetWidth);
					const left = (tW / 2 > (elL - dL) + (elW / 2)) ? 10 : elL - (tW / 2) + (elW / 2);
					wW < Math.floor(left) + tW ? elTooltip.style.right = '10px' : '';
					elTooltip.style.left = Math.floor(left) + 'px';

					const tH = Math.floor(elTooltip.offsetHeight);
					const top = (elT - dT > wH / 2) ? elT + dT - tH - 8 : elT + elH + dT + 8;
					elTooltip.style.top = Math.floor(top) + 'px';

					const arrow = (elT - dT > wH / 2) ? 'top' : 'bottom';
					elArrow.style.left = Math.floor(elL - left + (elW / 2)) + 'px';

					elTooltip.dataset.ps = arrow;
					elTooltip.setAttribute('aria-hidden', false);
					console.log(Math.floor(left) + tW, wW);
				},100);
				
				el.addEventListener('blur', Global.tooltip.hide);
				el.addEventListener('mouseleave', Global.tooltip.hide);
			}
		},
		back: function(e){
			e.preventDefault();

			const tooltips = doc.querySelectorAll('.ui-tooltip');
			const btns = doc.querySelectorAll('.ui-tooltip-btn');

            for (let i = 0, len = tooltips.length; i < len; i++) {
                const tts = tooltips[i];

                tts.setAttribute('aria-hidden', true);
			}

            for (let i = 0, len = btns.length; i < len; i++) {
                const bs = btns[i];

                bs.dataset.view = 'unfix';
			}

			doc.removeEventListener('click', Global.tooltip.back);
		},
		hide: function(e){
			e.preventDefault();

			const el = e.currentTarget;
			const elId = el.getAttribute('aria-describedby');
			const elTooltip = doc.querySelector('#' + elId);

			if (el.dataset.view !== 'fix') {
				clearTimeout(Global.tooltip.timerShow);
				elTooltip.classList.remove('hover');
				elTooltip.setAttribute('aria-hidden', true);
			}

			el.removeEventListener('blur', Global.tooltip.hide);
			el.removeEventListener('mouseleave', Global.tooltip.hide);
		},
		init: function() {
			//const opt = {...this.options, ...option};
			//const opt = Object.assign({}, Global.tooltip.options, option);
			const el_btn = doc.querySelectorAll('.ui-tooltip-btn');

            for (let i = 0, len = el_btn.length; i < len; i++) {
                const bbtns = el_btn[i];

				btn.addEventListener('mouseover', Global.tooltip.show);
				btn.addEventListener('focus', Global.tooltip.show);
				btn.addEventListener('click', Global.tooltip.show);
				win.addEventListener('resize',  Global.tooltip.back);
			}
		}
	}

	Global.floating = {
		init: function() {
			const el_body = document.body;
			const el_items = doc.querySelectorAll('.ui-floating');

			el_body.dataset.fixheight = 0;

			//setting
            for (let i = 0, len = el_items.length; i < len; i++) {
                const that = el_items[i];

				const fix = that.dataset.fix;
				const ps = that.dataset.ps;
				const el_wrap = that.querySelector('.ui-floating-wrap');
				const mg = Number(that.dataset.mg === undefined || that.dataset.mg === null ? that.dataset.mg : 0);
				const elH = el_wrap.offsetHeight;
				const elT = that.getBoundingClientRect().top;
				const wH = win.innerHeight;

				that.style.height = elH + 'px';

				if (fix === 'true') {
					//고정으로 시작
					that.dataset.state = 'fix';
					if (ps === 'top') {
						if (elT >= 0 + mg && fix === 'true') {
							el_wrap.style.marginTop = mg + 'px';
						} else {
							that.dataset.state = 'normal';
						}
					} else {
						if ((elT - wH) + elH + mg >= 0 && fix === 'true') {
							el_wrap.style.transform = 'translateY(-' + mg + 'px)';
						} else {
							that.dataset.state = 'normal';
						}
					}
				} else {
					that.dataset.state = 'normal';
				}
			}

			window.removeEventListener('scroll', this.scrollAct);
			window.addEventListener('scroll', this.scrollAct);
		},
		scrollAct: function(){
			const elBody = document.body;
			const el_items = doc.querySelectorAll('.ui-floating');

            for (let i = 0, len = el_items.length; i < len; i++) {
                const that = el_items[i];

                const fix = that.dataset.fix;
				const ps = that.dataset.ps;
				const state = that.dataset.state;
				const el_wrap = that.querySelector('.ui-floating-wrap');
				const mg = Number(that.dataset.mg === undefined || that.dataset.mg === null ? that.dataset.mg : 0);
				const elH = el_wrap.offsetHeight;
				const elT = that.getBoundingClientRect().top;
				const wH = win.innerHeight;

				if (state === 'fix') {
					if (ps === 'top') {
						//현재 상단고정상태
						if (elT <= 0 + mg && fix === 'true') {
							that.dataset.state = 'normal';
							el_wrap.style.marginTop = 0;
						}

						if (elT >= 0 + mg && fix === 'false') {
							that.dataset.state = 'normal';
							el_wrap.style.marginTop = 0;
						}

					} else {
						//현재 하단고정상태
						if ((elT - wH) + elH + mg <= 0 && fix === 'true') {
							that.dataset.state = 'normal';
							el_wrap.style.transform = 'translateY(0)';
						}

						if ((elT - wH) + elH + mg >= 0 && fix === 'false') {
							that.dataset.state = 'normal';
							el_wrap.style.transform = 'translateY(0)';
						}
					}

				} else {

					if (ps === 'top') {
						//현재 상단고정상태
						if (elT >= 0 + mg && fix === 'true') {
							that.dataset.state = 'fix';
							el_wrap.style.marginTop = mg + 'px';
						}

						if (elT <= 0 + mg && fix === 'false') {
							that.dataset.state = 'fix';
							el_wrap.style.marginTop = mg + 'px';
						}
						
					} else {
						//현재 하단고정상태
						if ((elT - wH) + elH + mg >= 0 && fix === 'true') {
							that.dataset.state = 'fix';
							el_wrap.style.transform = 'translateY(-' + mg + 'px)';
						}

						if ((elT - wH) + elH + mg <= 0 && fix === 'false') {
							that.dataset.state = 'fix';
							el_wrap.style.transform = 'translateY(-' + mg + 'px)';
						}
					}
				}
			}
		},
		range: function() {
			const el_ranges = doc.querySelectorAll('.ui-floating-range');
			
			window.removeEventListener('scroll', act);
			window.addEventListener('scroll', act);
							
			function act(){
                for (let i = 0, len = el_ranges.length; i < len; i++) {
                    const el_range = el_ranges[i];
                    const el_item = el_range.querySelector('.ui-floating-range-item');
					const mg = Number(el_range.dataset.mg === undefined || el_range.dataset.mg === null ? el_range.dataset.mg : 0);
					const itemH = el_item.offsetHeight;
					const wrapT = el_range.getBoundingClientRect().top;
					const wrapH = el_range.offsetHeight;
					const wT = win.pageYOffset;

					if (wT > (wrapT + wT - mg)) {
						if (wrapH - itemH >= wT - (wrapT + wT - mg)) {
							el_item.style.top = (wT - (wrapT + wT - mg)) + 'px';
						}
					} else {
						el_item.style.top = 0;
					}
				}
			}
		}
	}

	Global.tab = {
		options: {
			current: 0,
			onePanel: false,
			callback: false,
			effect: false,
			align : 'center'
		},
		init: function(option) {

            let current = option.current !== undefined ? option.current : 0;
			const onePanel = option.onePanel !== undefined ? option.onePanel : false;
			const callback = option.callback !== undefined ? option.callback : false;
			const effect = option.effect !== undefined ? option.effect : false;
			const align = option.align !== undefined ? option.align : 'center';

			const id = option.id;

            current = isNaN(current) ? 0 : current;

			const el_tab = doc.querySelector('#' + id);
			const el_btnwrap = el_tab.querySelector(':scope > .ui-tab-btns');
			const el_wrap = el_btnwrap.querySelector(':scope > .btn-wrap');
			const el_btns = el_btnwrap.querySelectorAll('.ui-tab-btn');
			const el_pnlwrap = el_tab.querySelector(':scope > .ui-tab-pnls');
			const el_pnls = el_pnlwrap.querySelectorAll(':scope > .ui-tab-pnl');
			const keys = Global.state.keys;
			const para = Global.para.get('tab');

			let paras;
			let paraname;

			//set up
			if (!!para) {
				if (para.split('+').length > 1) {
					//2 or more : tab=exeAcco1*2+exeAcco2*3
					paras = para.split('+');

					for (var j = 0; j < paras.length; j++ ) {
						paraname = paras[j].split('*');
						opt.id === paraname[0] ? current = Number(paraname[1]) : '';
					}
				} else {
					//only one : tab=1
					if (para.split('*').length > 1) {
						paraname = para.split('*');
						opt.id === paraname[0] ? current = Number(paraname[1]) : '';
					} else {
						current = Number(para);
					}
				}
			}

			//set up
			!!effect && el_tab.classList.add(effect);
			el_btnwrap.setAttribute('role','tablist');

			//setting
			for (let i = 0, len = el_btns.length; i < len; i++) {
				const el_btn = el_btns[i];
				const el_pnl = el_pnls[i];

				el_btn.setAttribute('role','tab');

				if (!el_btn.dataset.tab) {
					el_btn.dataset.tab = i;
				}
				el_btn.dataset.len = len;
				el_btn.dataset.n = i;

				const n = Number(el_btn.dataset.tab);
				const isCurrent = Number(current) === n;
				const cls = isCurrent ? 'add' : 'remove';

				
				if (!el_btn.id) {
					el_btn.id = id + 'Btn' + n;
				} 

				if (!onePanel) {
					el_pnl.setAttribute('role','tabpanel');

					if (!el_pnl.dataset.tab) {
						el_pnl.dataset.tab = i;
					}

					if (!el_pnl.id) {
						el_pnl.id = id + 'pnl' + n;
					} 
				} else {
					el_pnls[0].setAttribute('role','tabpanel');
					el_pnls[0].dataset.tab = current;
					el_pnls[0].id = id + 'pnl' + current;
				}
  
				const btnID = el_btn.id;
				const pnlID = !onePanel ? el_pnl.id : el_pnls[0].id;

				el_btn.setAttribute('aria-controls', pnlID);
				el_btn.classList[cls]('selected');

				if (!onePanel) {
					el_pnl.setAttribute('aria-labelledby', btnID);

					if ((Number(current) === Number(el_pnl.dataset.tab))) {
						el_pnl.setAttribute('aria-hidden', false);
						el_pnl.classList.add('selected');
					} else {
						el_pnl.setAttribute('aria-hidden', true);
						el_pnl.classList.remove('selected');
					}
				} else {
					el_pnls[0].setAttribute('aria-labelledby', btnID);
					el_pnls[0].setAttribute('aria-hidden', false);
					el_pnls[0].classList[cls]('selected');
				}

				i === 0 && el_btn.setAttribute('tab-first', true);
				i === len - 1 && el_btn.setAttribute('tab-last', true);

				if (isCurrent) {
					Global.scroll.move({ 
						selector: el_btnwrap, 
						left: el_btn.getBoundingClientRect().left + el_btnwrap.scrollLeft, 
						add : 0,
						align: align 
					});
				}

				el_btn.addEventListener('click', evtClick);
				el_btn.addEventListener('keydown', evtKeys);
			}

			callback && callback(opt);
			
			//event
			function evtClick(e) {
				Global.tab.toggle({ 
					id: id, 
					current: Number(e.currentTarget.dataset.tab), 
					align:align,
					onePanel:onePanel,
					callback:callback
				}); 
			}
			function evtKeys(e) {
				const that = this;
				const n = Number(that.dataset.n);
				const m = Number(that.dataset.len);

				switch(e.keyCode){
					case keys.up: upLeftKey(e);
					break;

					case keys.left: upLeftKey(e);
					break;

					case keys.down: downRightKey(e);
					break;

					case keys.right: downRightKey(e);
					break;

					case keys.end: endKey(e);
					break;

					case keys.home: homeKey(e);
					break;
				}

				function upLeftKey(e) {
					e.preventDefault();
					!that.getAttribute('tab-first') ? 
					Global.tab.toggle({ id: id, current: n - 1, align:align }): 
					Global.tab.toggle({ id: id, current: m - 1, align:align});
				}
				function downRightKey(e) {
					e.preventDefault();
					!that.getAttribute('tab-last') ? 
					Global.tab.toggle({ id: id, current: n + 1, align:align }): 
					Global.tab.toggle({ id: id, current: 0, align:align });
				}
				function endKey(e) {
					e.preventDefault();
					Global.tab.toggle({ id: id, current: m - 1, align:align });
				}
				function homeKey(e) {
					e.preventDefault();
					Global.tab.toggle({ id: id, current: 0, align:align });
				}
			}
		},
		toggle: function(option) {
            const id = opt.id;
			let current = option.current !== undefined ? option.current : 0;
			const onePanel = option.onePanel !== undefined ? option.onePanel : false;
			const callback = option.callback !== undefined ? option.callback : false;
			const effect = option.effect !== undefined ? option.effect : false;
			const align = option.align !== undefined ? option.align : 'center';


			
			const el_tab = doc.querySelector('#' + id);
			const el_btnwrap = el_tab.querySelector(':scope > .ui-tab-btns');
			const el_btn = el_btnwrap.querySelectorAll('.ui-tab-btn');
			const el_pnlwrap = el_tab.querySelector(':scope > .ui-tab-pnls');
			const el_pnls = el_pnlwrap.querySelectorAll(':scope > .ui-tab-pnl');
			
            current = isNaN(opt.current) ? 0 : opt.current;
			const el_current = el_btnwrap.querySelector('.ui-tab-btn[data-tab="'+ current +'"]');
			const el_pnlcurrent = el_pnlwrap.querySelector('.ui-tab-pnl[data-tab="'+ current +'"]');
			const btnId = el_current.id;
			let el_scroll = el_btnwrap.querySelector(':scope > .ui-scrollbar-item');

            for (let i = 0, len = el_btn.length; i < len; i++) {
                const that = el_btn[i];

                that.classList.remove('selected');
			}
			console.log(id);
			
			el_current.classList.add('selected')
			el_current.focus();

			if (!el_scroll) {
				el_scroll = el_btnwrap;
			}

			Global.scroll.move({ 
				selector: el_btnwrap, 
				left: el_current.getBoundingClientRect().left + el_scroll.scrollLeft, 
				add : 0,
				align: align 
			});

			if (!onePanel) {
                for (let i = 0, len = el_pnls.length; i < len; i++) {
                    const that = el_pnls[i];

                    that.setAttribute('aria-hidden', true);
					that.classList.remove('selected');
				}
				
				el_pnlcurrent.classList.add('selected');
				el_pnlcurrent.setAttribute('aria-hidden', false);
			} else {
				el_pnls[0].setAttribute('aria-hidden', false);
				el_pnls[0].setAttribute('aria-labelledby', btnId);
			}

			callback && callback(opt);
		}
	}

	

})(window, document);
