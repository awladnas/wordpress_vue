<?php
/*
Plugin Name: Alkalab Vue Comment
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
			add_action( 'wp_ajax_vc_get_comments', [$this, 'get_comments'] );
			add_action( 'wp_ajax_nopriv_vc_get_comments', [$this, 'get_comments'] );
		}

		// return html where shortcode used
		public function shortcode($atts) {
			$vue_atts = esc_attr( json_encode( [
				'content' => '',
				'post_id'  => $atts['post_id'],
				'admin_url' => admin_url( 'admin-ajax.php' )
			] ) );
			$html = "<div class='alkalab-vue-new-comment' data-avc-new-attrs='$vue_atts'> </div>";
			$html .= "<div class='alkalab-vue-comment' data-avc-attrs='$vue_atts'> </div>";
			echo $html;
		}

		// load all scripts
		public function scripts() {
			global $post;
			// Only enqueue scripts if we're displaying a post that contains the shortcode
			if( has_shortcode( $post->post_content, $this->shortcode_name ) ) {
				wp_enqueue_script( 'vue', 'https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js', [], '2.5.16' );
				wp_enqueue_script( 'vue-comments', plugin_dir_url( __FILE__ ) . 'js/comments.js', [], '0.1', true );
				wp_enqueue_script( 'vue-comment', plugin_dir_url( __FILE__ ) . 'js/comment.js', [], '0.1', true );
				wp_enqueue_script( 'vue-comment-main', plugin_dir_url( __FILE__ ) . 'js/vue-comment.js', [], '0.1', true );
				wp_enqueue_style( 'vue-comment', plugin_dir_url( __FILE__ ) . 'css/vue-comment.css', [], '0.1' );
				wp_enqueue_style( 'bootstrap-4', 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css', [], '0.1' );
			}
		}

		// save comment
		public function submit_comment(){
			$comment = array();
			$current_user = wp_get_current_user();
			$comment['comment_approved'] = 1;
			$comment['comment_author'] = $current_user->user_login;
			$comment['comment_author_url'] = esc_url( get_avatar_url( $current_user->ID ));
			$comment['user'] = $current_user->ID;
			$comment['comment_parent'] = 0;
			$comment['comment_type'] = 0;
			$comment['comment_post_ID'] = sanitize_text_field( $_REQUEST['post_id'] );;
			$comment['comment_content'] = sanitize_text_field( $_REQUEST['content'] );
			if($_REQUEST['id']){
				$comment['comment_ID'] = $_REQUEST['id'];
				echo json_encode(['success' => wp_update_comment( $comment )]);
				exit;
			}
			else {
				$comment_id = wp_insert_comment($comment);
				echo json_encode(['success' => 1, 'comment' => get_comment($comment_id)]);
				exit;
			}
		}

		// save comment
		public function get_comments(){
			$comments = get_comments(array( 'post_id' => $_REQUEST['post_id']));
			echo json_encode( $comments);
			exit;
		}

	}
	(new VueComment())->register();
}
