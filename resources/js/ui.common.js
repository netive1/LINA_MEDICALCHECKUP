;(function(win, doc) {
  'use strict';

  //include
  // $plugins.mainHeader = {
  //   appendHeader: function() {
  //     $("#inc_header").load("/html/service/include/include_header.html");
  //   }
  // };

  // $plugins.mainFooter = {
  //   appendFooter: function() {
  //     $.ajax({
  //       url: '/html/service/include/include_footer.html',
  //       success: function(data) {
  //         $('#inc_footer').append(data);
  //       }
  //     })
  //   }
  // };

  // modal
  $plugins.modal = {
    gTarget: null,
    gId: null,
    gModal: null,

    hideModal: function () {
      var o = this;
      $('#' + o.gId + '').removeClass('active');
    },
    showModal: function () {
      var o = this;
      $('#' + o.gId + '').addClass('active');
    },

    // hideModal: function() {
    //   var o = this;
    //   o.gModal.animate({
    //     'bottom': '-25%',
    //     'opacity': 0
    //   }, 300, function() {
    //     $('#' + o.gId + '').removeClass('active');
    //   });
    // },
    // showModal: function() {
    //   var o = this;
    //   $('#' + o.gId + '').addClass('active');
    //   o.gModal.animate({
    //     'bottom': '0',
    //     'opacity': 1
    //   }, 300);
    // },
    init: function() {
      var o = this;
      o.gTarget = $('.base-modal-link');
      o.gTarget.off().on('click', function(e) {
        if(!e) e = window.event;
        if (e.preventDefault){
            // Firefox, Chrome
            e.preventDefault();
        }else{
            // Internet Explorer
            e.returnValue = false;
        }
        o.gId = this.href.split('#')[1];
        o.gModal = $('#' + o.gId + '').find('.base-modal-wrap');
        o.showModal();
        $('#' + o.gId + '').find('.btn-close').off().on('click', function() {
          o.hideModal();
        });     
        $('.base-modal-dim').on('click', function() {
          o.hideModal();
        });
      });
    }
  }

  // 실행
  $(doc).ready(function() {
    // $plugins.mainHeader.appendHeader();
    // $plugins.mainFooter.appendFooter();
    $plugins.modal.init();
  });


})(window, document);
