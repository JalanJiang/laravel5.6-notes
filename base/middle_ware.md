# 中间件

## 什么是中间件

- HTTP 请求到达目标动作之前必须经过的"层"
- 每一层都会检查请求并且可以完全拒绝它

## 执行时间

一个中间件是请求前还是请求后执行取决于中间件本身。

### 请求前执行

在请求前处理一些任务。

```php
<?php

namespace App\Http\Middleware;

use Closure;

class BeforeMiddleware
{
    public function handle($request, Closure $next)
    {
        // 执行动作

        return $next($request);
    }
}
```

### 请求后执行

请求处理后执行其任务。

```php
<?php

namespace App\Http\Middleware;

use Closure;

class AfterMiddleware
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        // 执行动作

        return $response;
    }
}
```

## 创建

```
$ php artisan make:middleware CheckToke
```

## 定义

```php
<?php

namespace App\Http\Middleware;

use Closure;

class CheckToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->input('token') == 'testToken') {
            return redirect()->to("http://jalan.space");
        }
        return $next($request);
    }
}
```

## 注册

### 全局注册

在 `app/Http/Kernel.php` 中添加：`CheckToken::class`。

```php
/**
 * The application's global HTTP middleware stack.
 *
 * These middleware are run during every request to your application.
 *
 * @var array
 */
protected $middleware = [
    \Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
    \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
    \App\Http\Middleware\TrimStrings::class,
    \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    CheckToken::class,
];
```

### 分配指定路由

在 `app/Http/Kernel.php` 中为中间件分配key：

```php
/**
 * The application's route middleware.
 *
 * These middleware may be assigned to groups or used individually.
 *
 * @var array
 */
protected $routeMiddleware = [
    'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
    'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
    'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
    'can' => \Illuminate\Auth\Middleware\Authorize::class,
    'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
    'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
    'token' => CheckToken::class,
];
```

在路由表中使用 `middleware` 方法将其分配到路由中：

```php
Route::get('/', function () {
    return view('welcome');
})->middleware('token');
```

也可以传入数组分配多个中间件到路由中：

```php
Route::get('/', function () {
    return view('welcome');
})->middleware('token', 'auth');
```

### 中间件组

- 让一次分配给路由多个中间件的实现更加方便
- 通过使用 HTTP Kernel 提供的 `$middlewareGroups` 属性实现
    - 自带了开箱即用的 `web` 和 `api` 两个中间件组，分别包含可以应用到 Web 和 API 路由的通用中间件
    - 默认情况下，`RouteServiceProvider` 自动将中间件组 `web` 应用到 `routes/web.php` 文件，将中间件组 `api` 应用到 `routes/api.php`

设置自己的中间件组：

```php
/**
 * The application's route middleware groups.
 *
 * @var array
 */
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        // \Illuminate\Session\Middleware\AuthenticateSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],

    'api' => [
        'throttle:60,1',
        'bindings',
    ],
    
    'blog' => [
        'token' //在 $routeMiddleware 注册的key
    ],
];
```

分配中间件组：

```php
Route::group(['middleware' => ['blog']], function (){
    Route::get('/', function () {
        return view('welcome');
    });
});
```

## 传参

在 `handle` 参数列表中指定额外参数：

```php
<?php

namespace App\Http\Middleware;

use Closure;

class CheckToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param string $role
     * @return mixed
     */
    public function handle($request, Closure $next, $role)
    {
        if ($request->input('token') == 'testToken') {
            if ($role == 'editor') {
                return redirect()->to("http://jalan.space");
            }
        }
        return $next($request);
    }
}
```

在定义路由时通过 `:` 分隔中间件名和参数名来指定，多个中间件参数可以通过 `,` 分隔：

```php
Route::get('/', function () {
    return view('welcome');
})->middleware('token:editor');
```




