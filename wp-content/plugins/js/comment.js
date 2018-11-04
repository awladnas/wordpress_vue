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
