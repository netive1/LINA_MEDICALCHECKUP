;(function (win, doc, jQuery, undefined) {

	'use strict';

	netive.common = {
		init: function(){
			netive.common.pageMinHeight();
		},
		pageMinHeight: function(){
			const el_html = doc.querySelector('html');
			const elMain = document.querySelector('.base-main');

			window.addEventListener('resize', act);
			function act(){
				const wh = window.innerHeight;
				elMain.style.minHeight = wh + 'px';

				if (wh < elMain.offsetHeight) {
					el_html.classList.add('is-scroll');
				} else {
					el_html.classList.remove('is-scroll');
				}
			}
			act();
		},
		stepUp: function(){
			const wrap = document.querySelector('html, body');
			const stepHide = document.querySelector('.step-toggle[data-toggle="hide"]');
			const stepShow = document.querySelector('.step-toggle[data-toggle="show"]');
			const header = document.querySelector('.header-wrap');

			stepHide.classList.add('show');
			stepShow.classList.add('hide');

			wrap.scrollTo({
				top: stepHide.getBoundingClientRect().top + document.documentElement.scrollTop - header.offsetHeight,
				behavior: 'smooth'
			});
		},
		progressBar: function () {
			const el = document.querySelectorAll('.ui-progressbar');
			const level = [0, 20, 40, 60, 80, 100];
			const levelTxt = ['양호', '주의', '경고', '위험', '고위험'];
			let ps = [];
			
			document.addEventListener('scroll', act);

			for (let i = 0, len = el.length; i < len; i++) {
				const that = el[i];
				const per = that.dataset.percent;
				ps.push(that.getBoundingClientRect().top.toFixed(0));

				for (let j = 0, len2 = level.length; j < len2; j++) {
					if (Number(per) < Number(level[j])) {
						state(that, j, per);
						break;
					}
				}
			}

			function state(a, b, c) {
				const el_level = a.querySelector('.ui-progressbar-level');
				const el_item = a.querySelector('.ui-progressbar-item');
				
				if (!!el_level) {
					a.classList.add('state-' + b);
					el_level.textContent = levelTxt[b - 1]
				}
				el_item.dataset.per = c;
				el_item.setAttribute('aria-label', c + '%');
			}

			function act() {
				const sc = document.documentElement.scrollTop + window.innerHeight - 100;
				
				for (let i = 0, len = el.length; i < len; i++) {
					const that = el[i];
					const el_item = that.querySelector('.ui-progressbar-item');

					if (sc > Number(ps[i])) {
						el_item.style.width = el_item.dataset.per + '%';
					}
				}
			}
			act();
		},
		progress: function(opt){
			const max = Number(opt.max);
			const val = Number(opt.val);
			const circleprogress = document.querySelector('.circle-progress');
			const emoji = document.querySelector('.circle-progress .emoji');
			const box = document.querySelector('.circle-progress .box');
			const percent = document.querySelector('.circle-progress .percent');

			setTimeout(function () {
				if (!!box) {
					box.style.transform = 'rotate(' + (360 * val / 100) + 'deg)';
					box.style.opacity = 1;
				}
			}, 0);

			let n = 0;

			function countUp() {
				if (val >= n) {
					percent.innerHTML = n;
					n = n + 1;
					console.log(n);
					setTimeout(function () {
						countUp();
					}, 1);
				}
			}
			countUp();

			if (val > 100) {
				circleprogress.classList.add('n5');
			} else if (val > 80) {
				circleprogress.classList.add('n4');
			} else if (val > 60) {
				circleprogress.classList.add('n3');
			} else if (val > 40) {
				circleprogress.classList.add('n2');
			} else {
				circleprogress.classList.add('n1');
			}

			new CircleProgress('.circle-progress', {
				// textFormat: 'percent',
				max: max,
				value: val,
			});
		}
	};

	
})(window, document, $);

// 공통 약관 전체선택
$.fn.uiCheckAll = function (opt) {
	const callback = opt.callback;
	const callbackCancel = opt.callbackCancel;

	return this.each(function () {
		$uiCheckAll = {
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
					$parent.addClass('chked');
					o.gItemObjParent.addClass('chked');
					callback !== undefined ? callback() : '';
				} else {
					o.gCheckedLength = 0;
					$parent.removeClass('chked');
					o.gItemObjParent.removeClass('chked');
					callbackCancel !== undefined ? callbackCancel() : '';
				}
			},
			checkItemFn: function (v) {
				var o = this,
					$t = $(v),
					$boolean = $t.is(':checked'),
					$parent = $t.parent();

				if ($boolean) {
					o.gCheckedLength = o.gCheckedLength + 1;
					$parent.addClass('chked');
				} else {
					o.gCheckedLength = o.gCheckedLength - 1;
					$parent.removeClass('chked');
				}

				if (o.gCheckedLength === o.gLength) {
					o.gAllObj.prop('checked', true);
					o.gAllObjParent.addClass('chked');
				} else {
					o.gAllObj.prop('checked', false);
					o.gAllObjParent.removeClass('chked');
				}
			},
			viewFn: function (v) {
				var o = this,
					$t = $(v),
					$parent = $t.parent();

				$t.toggleClass('open');

				if (o.gBtn.hasClass('open')) {
					$parent.addClass('open');
					o.gList.fadeIn(300);
				} else {
					$parent.removeClass('open');
					o.gList.fadeOut(300);
				}
			},
			init: function (v) {
				var o = this;
				o.gTarget = $(v);
				o.gAllObjParent = o.gTarget.find('.all-chked .chkbox');
				o.gAllObj = o.gAllObjParent.find('input[type=checkbox]');
				o.gItemObjParent = o.gTarget.find('.chklist .chkbox');
				o.gItemObj = o.gItemObjParent.find('input[type=checkbox]');
				o.gLength = o.gItemObj.length;
				o.gList = o.gTarget.find('.chklist');
				o.gCnt = o.gList.find('.chkbox');
				o.gBtn = o.gTarget.find('.all-chked .btn-more');

				// 전체 체크, 체크 해제
				o.gAllObj.on('click.allChk', function () {
					o.checkAllFn(this);
				});

				// 개별 체크
				o.gItemObj.on('click.itemChk', function () {
					o.checkItemFn(this);
				});

				o.gBtn.on('click', function () {
					o.viewFn(this);
				});
			}
		}
		$uiCheckAll.init(this);
	});
}

//progressbar
$.fn.uiProgressbar = function () {
	var getPercent = ($('.progress-cont').data('progress-percent') / 100);
	var getProgressWrapWidth = $('.progress-cont').width();
	var progressTotal = getPercent * getProgressWrapWidth;
	var animationLength = 100;

	$('.progress-bar').stop().animate({
		left: progressTotal
	}, animationLength);
}