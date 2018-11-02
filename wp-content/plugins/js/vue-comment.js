Vue.component('vue-post-comments', {
    template: '<div class="avc-comments-list" :key="id">\
                    <div class="new-comment" v-if="isOpen">\
                        <textarea v-model="content">{{content}}</textarea>\
                        <button @click="submitCommit">Post</button>\
                        <span @click="cancelEdit">X</span>\
                    </div>\
                    <div class="new-comment-btn" v-else>\
                        <button @click="newComment">New Comment</button>\
                    </div>\
                    <div v-for="comment in updated_comments">\
                        <vue-comment \
                          :id="comment.comment_ID" \
                          :comment_content="comment.comment_content" \
                          :comment_date="comment.comment_date" \
                          :comment_author="comment.comment_author" \
                          :comment_post_id="comment.comment_post_ID" />\
                    </div>\
		       </div>',
    props: ['post_id'],
    data: function () {
        return {
            id: this.post_id,
            content: null,
            isOpen: false,
            comments: []
        }
    },
    computed:{
        updated_comments: function () {
            return this.comments;
        }
    },
    mounted: function() {
        var self = this;
        var comments_url = window.ajaxurl + '?action=vc_get_comments&post_id=' + this.post_id;
        jQuery.get( comments_url, function( data ) {
            self.comments = JSON.parse(data);
            console.log(self.comments);
        });
    },
    methods: {
        submitCommit: function(){
            if (null === this.content) return;
            var action_url = window.ajaxurl + '?action=vc_submit_comment';
            var payload = {
                content: this.content,
                post_id: this.id
            };
            var self = this;
            jQuery.post( action_url, payload)
                .done(function( data ) {
                    // self.comments.unshift(JSON.parse(data));
                    self.comments.push(JSON.parse(data));
                    self.isOpen = false
                });
        },
        newComment: function(){
            this.isOpen = true
        },
        cancelEdit: function(){
            this.isOpen = false
        }
    }
});

Vue.component('vue-comment', {
    template: '<div class="avc-comment" :key="id">\
                    <div class="edit-comment" v-if="editMode">\
                        <textarea v-model="content">{{content}}</textarea>\
                        <button @click="submitCommit">Update</button>\
                        <span @click="cancelEdit">X</span>\
                    </div>\
                    <div class="display-comment" v-else>\
                        <pre>{{content}}</pre>\
                        <div>\
                            <span v-if="author == \'\'"> Anonymous : {{date}} </span>\
                            <span v-else>{{author}} : {{date}} </span>\
                        </div>\
                        <span @click="editCommit"\>Edit</span>\
                    </div>\
		       </div>',
    props: ['id', 'comment_content', 'comment_date', 'comment_author', 'comment_post_id'],
    data: function () {
        return {
            CommentId: this.id,
            content: this.comment_content,
            post_id: this.comment_post_id,
            date: this.comment_date,
            author: this.comment_author,
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


var element = document.querySelectorAll('[data-avc-attrs]')[0];
var atts = JSON.parse(element.getAttribute('data-avc-attrs'));
window.ajaxurl = atts.admin_url;
new Vue({
    el: element,
    template: '<div class="avc-container">\
                <vue-post-comments :post_id="atts.post_id" admin />\
               </div>',
    created: function () {
        this.atts = atts;
    }
});
