// remove dependencies on bootstrap
// give styling options in css

(function($){

  function FeedBox(el,id,options) {
    this.id = id;
    this.$content = $(el);
    this.options = options;

    this.$closeButton = $('<button type="button" class="close ultx-close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
    this.$main = $('<div class="understandalytics clearfix pad-bottom"><div class="text-right col-sm-offset-6 col-sm-6 ultx-control"><span class="pad-right">' + this.options.promptMsg + '</span><button type="button" class="ultx-yes btn-success pull-right">Yes</button><button type="button" class="ultx-no btn-danger pull-right">No</button></div></div>');
      
    this.$form = $('<form class="ultx-form"><div class="form-group"><label for"unclear">' + this.options.feedbackLabel + '</label><input type="text" class="form-control ultx-response" placeholder="' + this.options.feedbackPlaceholder + '"></div><div class="form-group"></div><div class="row"><div class="col-md-5"><button type="submit" class="btn btn-primary">' + this.options.feedbackButtonTxt + '</button></div><div class="col-md-7"><div class="pull-right">by <a class="ultx-cta" href="#">Understandalytics</a></div></div></div></form>');
    this.$form.wrap('<div class="row ultx-feedback"><div class="col-md-offset-6 col-md-6 well"></div></div>');
    this.$form.before(this.$closeButton);
    
    this.$feedback =  this.$form.parents('.ultx-feedback')

    this.$controls = this.$main.find('.ultx-control');
    this.$noButton = this.$controls.find('button.ultx-no');
    this.$yesButton = this.$controls.find('button.ultx-yes');

    this._create();

  }

  FeedBox.prototype._create = function(){

    this.$content.wrap('<div class="ultx-wrap"></div>');
    this.$wrap = this.$content.parent('.ultx-wrap');    
    this.$wrap.append(this.$main);

    // to maintain "this" scope inside functions bound to events (below)
    var _this = this;

    function highlightTrigger(){

      _this.options.reportFunction({
        event: 'ultx',
        action: 'hover_highlight',
        id: _this.id,
        ref: document.URL
      });

    }

    function onNoUnderstanding(){
      
      _this.$main.append(_this.$feedback);
      _this.$main.find('.ultx-close').on('click',function(){ _this.$main.remove() });

      _this.options.reportFunction({
        event: 'ultx',
        action: 'click',
        response: 'no',
        id: _this.id,
        ref: document.URL
      });
      
    }

    function onGenericUnderstanding(){

      _this.feedbackComplete(_this.options.completeGenericMsg);  // options
      _this.$main.siblings().removeClass("ultx-highlight");

      _this.options.reportFunction({
        event: 'ultx',
        action: 'click',
        response: 'yes',
        id: _this.id,
        ref: document.URL
      });

    }

    function onCtaClick(e){

      e.preventDefault();

      _this.options.reportFunction({
        event: 'ultx',
        action: 'CTA',
        response: 'CTA',
        id: _this.id,
        ref: document.URL
      });

    }

    function onFeedbackSubmit(e){

      e.preventDefault();

      _this.feedbackComplete(_this.options.completeFeedbackMsg);
      
      _this.options.reportFunction({
        event: 'ultx',
        action: 'submit',
        id: _this.id,
        response: _this.$form.find(".ultx-response").val(),
        ref: document.URL
      });

    }

    // controls hovers
    this.$controls.on('mouseenter', highlightTrigger);
    this.$controls.on('mouseenter mouseleave', function(){ _this.$content.toggleClass("ultx-highlight") });

    // button click no
    this.$noButton.on('click', onNoUnderstanding);

    // button click yes
    this.$yesButton.on('click', onGenericUnderstanding);

    // cancelling feedback
    this.$main.find('.ultx-cancel').on('click', onGenericUnderstanding);

    // feedback submit
    this.$form.on('submit', function(e){ onFeedbackSubmit(e) }); 

    // CTA Click
    this.$form.find('a.ultx-cta').on('click', function(e){ onCtaClick(e) });

    // close button
    this.$closeButton.on('click',function(){ _this.$main.remove() });

  }

  FeedBox.prototype.feedbackComplete = function(thanks){ 

    $message = $('<div class="clearfix pull-right alert alert-success"><span class="text-right pad-right">' + thanks + '</span></div>').append(this.$closeButton);
    this.$main.empty().append($message);

  }


  $.fn.understandalytics = function(options) {

    options = $.extend({}, $.fn.understandalytics.defaults, options);
    
    if (options.desktopOnly){

      if (!$.fn.understandalytics.init){
        $('head').append('<link rel="stylesheet" href="lib/understandalytics.css">');
        $.fn.understandalytics.init = true;
      };
      
      function get(id,el){

        var feedBox = $.data(this, 'feedBox');

        if (!feedBox) {       
          feedBox = new FeedBox(el,id,options);
          $.data(el, 'feedBox', feedBox);
        }

      }
      
      return this.each(function(id,el){ get(id,el) });

    }
  };

  function mobileCheck(){
    var isMobile = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))isMobile = true})(navigator.userAgent||navigator.vendor||window.opera);
    return !isMobile;
  }

  $.fn.understandalytics.defaults = {
    
    promptMsg : "Does this section make sense? ",
    feedbackLabel : "What is unclear about this section?",
    feedbackPlaceholder : "I would like to better understand...",
    feedbackButtonTxt : "Send Feedback",
    completeFeedbackMsg : "Thank you for providing feedback. We will update this section accordingly.",
    completeGenericMsg : "Thank you for providing feedback.",
    
    reportFunction : function report(msg){
      console.log(msg)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(msg)
      },
    
    mobileCheck : mobileCheck,
    desktopOnly : mobileCheck()

  };

  $.fn.understandalytics.init = false;

}(jQuery));