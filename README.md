# cnet-sample-code
Sample Code
Regenerate vendor folder
Initially, we try to update the Composer. Before updating, we check the location of the root user. Because the Composer must run inside the Laravel project folder.

Once we are in this directory, we run the command,

composer update
In most cases, updating the Composer will regenerate the vendor folder and the autoload.php file.

Alternatively, we can regenerate the autoload.php file using the command,

composer dump-autoload
Later on, we check if the Laravel project works.

 

Re-install Composer
If the Composer is found corrupted, we uninstall the existing one and reinstall it.

To install Composer, we run the command in the root project folder,

composer install
Later we access the PHP artisan to verify if the project works.

Reference : https://bobcares.com/blog/laravel-vendor-folder-missing/

#VUE JS EXAMPLE HELP

# vehicle-guardian-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
    npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

