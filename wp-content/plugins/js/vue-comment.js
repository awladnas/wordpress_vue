Vue.component('vue-comment', {
    template: '<div class="avc-comment" :key="atts.id">\
                    <div class="edit-comment" v-if="editMode">\
                        <textarea v-model="content">{{content}}</textarea>\
                        <button @click="submitCommit">Update</button>\
                        <span @click="cancelEdit">X</span>\
                    </div>\
                    <div class="display-comment" v-else>\
                        <pre>{{content}}</pre>\
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
            console.log(payload, content);
            // this.$http.post(action_url, payload)
            jQuery.post( action_url,payload)
            this.editMode = false
        },
        editCommit: function(){
         this.editMode = true
        },
        cancelEdit: function(){
            this.editMode = false
        }
    }
});

Vue.component('vue-new-comment', {
    template: '<div class="avc-comment">\
                    <div class="new-comment" v-if="isOpen">\
                        <textarea v-model="content">{{content}}</textarea>\
                        <button @click="submitCommit">Create</button>\
                        <span @click="cancelEdit">X</span>\
                    </div>\
                    <div class="display-comment" v-else>\
                        <button @click="newCommit">New Comment</button>\
                    </div>\
		       </div>',
    props: ['atts'],
    data: function () {
        return {
            content: '',
            post_id: this.atts.post_id,
            isOpen: false
        }
    },
    methods: {
        submitCommit: function(){
            if (null === this.content) return;
            var action_url = window.ajaxurl + '?action=vc_submit_comment';
            var payload = {
                content: this.content,
                post_id: this.post_id
            };
            console.log(payload, content);
            // this.$http.post(action_url, payload)
            jQuery.post( action_url,payload)
            this.isOpen = false
        },
        newCommit: function(){
            this.isOpen = true
        },
        cancelEdit: function(){
            this.isOpen = false
        }
    }
});

var elements = document.querySelectorAll('[data-avc-attrs]');
elements.forEach(function (element) {
    // import VueResource from 'vue-resource';
    var atts = JSON.parse(element.getAttribute('data-avc-attrs'));
    var vm = new Vue({
        el: element,
        template: '<div class="avc-container">\
			        <vue-comment :atts="atts" :content="atts.content" :post_id="atts.post_id" />\
			       </div>',
        created: function () {
            this.atts = atts;
            this.newComment = false
        }
    });
    // vm.use(VueResource);
});


var element = document.querySelectorAll('[data-avc-new-attrs]')[0];
var atts = JSON.parse(element.getAttribute('data-avc-new-attrs'));
var vm = new Vue({
    el: element,
    template: '<div class="avc-container">\
			    <vue-new-comment :atts="atts"/>\
			   </div>',
    created: function () {
        this.atts = atts;
        this.newComment = false
    }
});
