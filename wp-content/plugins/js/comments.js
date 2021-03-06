Vue.component('vue-post-comments', {
    template: '<div class="avc-comments-list container" :key="id">\
                    <div class="container" v-if="isOpen">\
                        <div class="clearfix col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5">\
                            <div class="our-comment-wrapper mb-2">\
                                <div class="comment-inner border border-white bg-light p-3">\
                                    <h4> New Comment </h4>\
                                    <textarea v-model="content" id="comment" name="comment" cols="40" rows="3" maxlength="65525" required="required">{{content}}</textarea>\
                                    <div class="actions mt-2 mb-2">\
                                        <button @click="cancelEdit" class="btn btn-outline-secondary cancel"> Cancel</button>\
                                        <button @click="saveComment" class="btn btn-outline-success float-right"> Post</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="clearfix" v-else>\
                        <button @click="newComment" class="btn btn-outline-success mb-2 float-right"> New Comment</button>\
                    </div>\
                    <ol class="comment-list">\
                        <li v-for="comment in updated_comments" :key="comment.comment_ID" :id="\'comment-\'+comment.comment_ID">\
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
                        // var elmId = '#comment-' + result['comment']['comment_ID'];
                        // var elmnt = jQuery('.comment-list').find(elmId);
                        // console.log(elmnt, elmnt.offset());
                        // jQuery(window).scrollTop(elmnt.offset().top());
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
