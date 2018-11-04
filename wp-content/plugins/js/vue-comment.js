Vue.component('vue-post-comments', {
    template: '<div class="avc-comments-list" :key="id">\
                    <div class="edit-comment new-comment clearfix" v-if="isOpen">\
                        <h4> New Comment </h4>\
                        <div>\
                            <textarea v-model="content" id="comment" name="comment" cols="45" rows="4" maxlength="65525" required="required">{{content}}</textarea>\
                        </div>\
                        <div class="actions">\
                            <a @click="cancelEdit" href="javascript:void(0);" class="post-edit-link cancel"> Cancel</a>\
                            <a @click="saveComment" href="javascript:void(0);" class="post-edit-link"> Post</a>\
                        </div>\
                    </div>\
                    <div class="clearfix" v-else>\
                        <a @click="newComment" class="new-comment-btn" href="javascript:void(0)">New Comment</a>\
                    </div>\
                    \
                    <ol v-for="comment in updated_comments" class="comment-list">\
                        <li class="avc-comment comment byuser comment-author-awlad bypostauthor even thread-even depth-1" :key="comment.comment_ID">\
                            <vue-comment \
                              :id="comment.comment_ID" \
                              :comment_content="comment.comment_content" \
                              :comment_date="comment.comment_date" \
                              :comment_author="comment.comment_author" \
                              :comment_post_id="comment.comment_post_ID" \
                              :comment_author_url="comment.comment_author_url" />\
                        </li>\
                    </ol>\
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
        });
    },
    methods: {
        saveComment: function(){
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
                    var result = JSON.parse(data);
                    if(result['success'] == '1'){
                        self.comments.push(result['comment']);
                        self.isOpen = false
                    }
                    else{
                        alert('something is worng. Post save is unsuccessful');
                    }
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
    template: '<div>\
                    <div class="edit-comment clearfix"\ v-if="editMode">\
                        <p class="comment-form-comment">\
                            <div>\
                                <textarea v-model="content" id="comment" name="comment" cols="45" rows="4" maxlength="65525" required="required" style="z-index: auto; position: relative; line-height: 24px; font-size: 16px; transition: none 0s ease 0s; background: transparent !important;">{{content}}</textarea>\
                            </div>\
                        </p>\
                        <div class="actions">\
                            <a @click="cancelEdit" href="javascript:void(0);" class="post-edit-link cancel"> Cancel</a>\
                            <a @click="submitComment" href="javascript:void(0);" class="post-edit-link"> Save</a>\
                        </div>\
                    </div>\
                    <article class="comment-body" v-else>\
                        <footer class="comment-meta">\
                            <div class="comment-author vcard">\
                                <img alt="" :src="author_url" v-bind:src="author_url" class="avatar avatar-100 photo" height="100" width="100">\
                                <b class="fn">{{author ? author : "Anonymous"}}</b> <span class="says">says:</span>\
                            </div>\
                            <div class="comment-metadata">\
                                <time datetime="">{{date}}</time>\
                                <span class="edit-link"><a @click="editComment" class="comment-edit-link" href="javascript:void(0)">Edit</a></span>\
                            </div>\
                        </footer>\
                        <div class="comment-content">\
                            <p>{{content}}</p>\
                        </div>\
                    </article>\
		       </div>',
    props: ['id', 'comment_content', 'comment_date', 'comment_author', 'comment_post_id', 'comment_author_url'],
    data: function () {
        return {
            CommentId: this.id,
            content: this.comment_content,
            post_id: this.comment_post_id,
            date: this.comment_date,
            author: this.comment_author,
            author_url: this.comment_author_url,
            editMode: false
        }
    },
    methods: {
        submitComment: function(){
            if (null === this.content) return;
            var action_url = window.ajaxurl + '?action=vc_submit_comment';
            var payload = {
                id: this.CommentId,
                content: this.content,
                post_id: this.post_id
            };
            self = this;
            jQuery.post( action_url,payload)
                .done(function( data ) {
                    var result = JSON.parse(data);
                    if(result['success'] == '1'){
                        self.editMode = false
                    }
                    else{
                        alert('something is worng. Post save is unsuccessful');
                    }
                });
        },
        editComment: function(){
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
    template: '<div class="avc-container comments-area" id="comments">\
                <vue-post-comments :post_id="atts.post_id" admin />\
               </div>',
    created: function () {
        this.atts = atts;
    }
});
