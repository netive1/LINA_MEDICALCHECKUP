// 공통 약관 전체선택
$.fn.uiCheckAll = function () {
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
        } else {
          o.gCheckedLength = 0;
          $parent.removeClass('chked');
          o.gItemObjParent.removeClass('chked');
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

        o.gBtn.on('click', function() {           
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