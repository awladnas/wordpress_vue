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
