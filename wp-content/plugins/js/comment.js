Vue.component('vue-comment', {
    template: '<div class="container">\
                    <div class="edit-comment clearfix col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-5" v-if="editMode">\
                        <div class="our-comment-wrapper mb-2">\
                            <div class="comment-inner border border-white bg-light p-3">\
                                <textarea v-model="content" id="comment" name="comment" cols="40" rows="3" maxlength="65525" required="required" >{{content}}</textarea>\
                                <div class="actions mt-2 mb-2">\
                                    <button @click="cancelEdit" class="btn btn-outline-secondary cancel"> Cancel</button>\
                                    <button @click="submitComment" class="btn btn-outline-success float-right"> Save</button>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12" v-else>\
                        <div class="our-comment-wrapper mb-2">\
                            <div class="comment-inner">\
                                <div class="our-comment-img">\
                                    <img alt="" :src="author_url" v-bind:src="author_url" class="rounded-circle" height="70" width="70">\
                                </div>\
                                <div class="our-comment-text">\
                                    <div class="row">\
                                        <div class="col-sm-6 col-md-7 col-lg-6 col-xl-6"><h4>{{author ? author : "Anonymous"}}</h4></div>\
                                        <div class="col-sm-6 col-md-5 col-lg-6 col-xl-6 small float-right text-muted">{{date}}</div>\
                                    </div>\
                                    <p>{{content}}</p>\
                                    <div class="row mt-3 mx-auto">\
                                        <button @click="editComment"  type="button" class="col-sm-6 col-md-6 col-lg-4 col-xl-4 mr-1 btn btn-outline-info">Edit</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
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
