**Get started**

This is a wordpress plugin with Vue js for the comment management.

`Installation Steps: `
 1. `git clone git@github.com:awladnas/wordpress_vue.git`
 2.  Duplicate wp-config-sample.php and rename it to wp-config.php. Set database credentials.
 3. Install and set wordpress admin user by browsing: `your_host:port/wp-admin/install.php`
 4. Go to the admin panel -> plugins. Install `Alkalab Vue Comment` plugin.
 5. Use it in anywhere by short code `alkalab_vue_comment`. You need to pass `post_id` in the parameter. Example: `[alkalab_vue_comment post_id=1 \]`