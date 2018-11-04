var element = document.querySelectorAll('[data-avc-attrs]')[0];
var atts = JSON.parse(element.getAttribute('data-avc-attrs'));
window.ajaxurl = atts.admin_url;
new Vue({
    el: element,
    template: '<div class="avc-container comments-area" id="comments">\
                <vue-post-comments :post_id="atts.post_id" admin />\
               </div>',
    created: function () {
        this.atts = atts;
    }
});
