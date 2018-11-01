var vc = Vue.component('vue-comment', {
    template: '<div class="avc-comment" :key="atts.id">\
                    <div class="edit-comment" v-if="editMode">\
                        <textarea v-model="atts.content">{{atts.content}}</textarea>\
                        <button @click="submitCommit">Update</button>\
                    </div>\
                    <div class="display-comment" v-else>\
                        <span>{{atts.content}}</span>\
                        <span @click="editCommit"\>Edit</span>\
                    </div>\
		       </div>',
    props: ['atts'],
    data: function () {
        return {
            CommentId: this.atts.id,
            content: this.atts.content,
            post_id: this.atts.post_id,
            editMode: false
        }
    },
    methods: {
        submitCommit: function(){
            if (null === this.content) return;
            var action_url = window.ajaxurl + '?action=vc_submit_comment';
            var payload = {
                id: this.CommentId,
                content: this.content,
                post_id: this.post_id
            };
            console.log(payload);
            this.$http.post(action_url, payload)
        },
        editCommit: function(){
         this.editMode = true
        }
    }
});

var elements = document.querySelectorAll('[data-avc-attrs]');
elements.forEach(function (element) {
    // import VueResource from 'vue-resource';
    var atts = JSON.parse(element.getAttribute('data-avc-attrs'));
    var vm = new Vue({
        el: element,
        data: {
            newComment: false
        },
        template: '<div class="avc-container">\
			\<vue-comment :atts="atts" @submitted="pollSubmitted=true" />\
			</div>',
        created: function () {
            this.atts = atts;
        }
    });
    // vm.use(VueResource);
});
