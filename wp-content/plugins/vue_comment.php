<?php
/*
Plugin Name: Vue Comment
Description: Live-updating of comments of post.
Version: 0.1
Author: Awlad
Author URI: https://www.linkedin.com/in/litonawlad/
*/

if ( ! class_exists( 'VueComment' ) ) {
	class VueComment {

		private $shortcode_name = 'alkalab_vue_comment';

		// register all the actions and methods
		public function register() {
			add_shortcode( $this->shortcode_name, [$this, 'shortcode'] );
			add_action( 'wp_enqueue_scripts', [$this, 'scripts'] );
			add_action( 'wp_ajax_nopriv_vc_submit_comment', [$this, 'submit_comment'] );
			add_action( 'wp_ajax_vc_submit_comment', [$this, 'submit_comment'] );
		}

		// return html where shortcode used
		public function shortcode($atts) {
//			print_r($atts);
			$comments = get_comments(array( 'post_id' => $atts['post_id']));
			$vue_atts = esc_attr( json_encode( [
				'content' => '',
				'post_id'  => $atts['post_id'],
			] ) );
			$html = "<div class='alkalab-vue-new-comment' data-avc-new-attrs='$vue_atts'> </div>";
			foreach($comments as $comment) {
				$html .= $this->comment_html($comment);
			}
			echo $html;
		}

		public function comment_html($comment) {
			$vue_atts = esc_attr( json_encode( [
				'id'       => $comment->comment_ID,
				'content' => $comment->comment_content,
				'post_id'  => $comment->comment_post_ID,
			] ) );
			return "<div class='alkalab-vue-comment' data-avc-attrs='$vue_atts'> </div>";
		}

		// load all scripts
		public function scripts() {
			global $post;
			// Only enqueue scripts if we're displaying a post that contains the shortcode
			if( has_shortcode( $post->post_content, $this->shortcode_name ) ) {
				wp_enqueue_script( 'vue', 'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js', [], '2.5.16' );
				wp_enqueue_script( 'vue-comment', plugin_dir_url( __FILE__ ) . 'js/vue-comment.js', [], '0.1', true );
				wp_enqueue_style( 'vue-comment', plugin_dir_url( __FILE__ ) . 'css/vue-comment.css', [], '0.1' );
				wp_add_inline_script( 'vue-comment', 'window.ajaxurl = "' . admin_url( 'admin-ajax.php' ) . '"');
			}
		}

		// save comment
		public function submit_comment(){
			$comment = array();
			$comment['comment_approved'] = 1;
			$comment['comment_parent'] = 0;
			$comment['comment_type'] = 0;
			$comment['comment_post_ID'] = sanitize_text_field( $_REQUEST['post_id'] );;
			$comment['comment_content'] = sanitize_text_field( $_REQUEST['content'] );
			if($_REQUEST['id']){
				$comment['comment_ID'] = $_REQUEST['id'];
				wp_update_comment( $comment );
			}
			else {
				wp_insert_comment($comment);
			}
			exit( 'success' );
		}

	}
	(new VueComment())->register();
}
