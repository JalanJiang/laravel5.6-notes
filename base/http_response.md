# HTTP 响应

## 创建响应

### 字符串 & 数组

从路由返回字符串或数组：

```php
Route::get('/', function () {
    //返回字符串
    // return "hello world!";
    
    //返回数组
    return [array('r' => 1, '3' => 2), array('r' => 1, '3' => 2)]; //输出json：[{"r":1,"3":2},{"r":1,"3":2}]
});
```

- 框架会自动将字符串转换为一个完整的 HTTP 响应
- 框架会自动将数组转为 JSON 响应

### 完整响应对象

完整的 `Reponse` 实例：

- 允许自定义响应的 HTTP 状态码
- 允许自定义响应头部

#### 定义状态码

```php
Route::get('/', function () {
    return response('Hello Wrold', 200);
});
```

#### 定义头部

`header()` 方法：

```php
return response('Hello Wrold', 200)
    ->header('Content-Type', 'text/plain'); //可以链式添加多个header
```

`withHeaders()` 方法：

```php
return response('Hello Wrold', 200)
        ->withHeaders([
                'Content-Type' => 'text/plain',
                'X-header-One' => 'Header value',
            ]
        );
```

#### 添加 Cookie

`cookie()` 方法：

```php
return response('Hello Wrold', 200)
        ->header('Content-Type', $type)
        ->cookie('name', 'value', $minutes);
```

**注：**

Laravel 生成的所有 Cookie 都经过加密和签名，若要部分 Cookie 不被加密，可在 `EncryptCookies` 中间件修改 `$except` 属性：

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as BaseEncrypter;

class EncryptCookies extends BaseEncrypter
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array
     */
    protected $except = [
        'name',
    ];
}
```

----

## 重定向

全局辅助函数 `redirect()`：

```php
Route::get('/', function () {
    return redirect('/test');
});
```

### 重定向至已命名路由

```php
return redirect()->route('test');
```

传递参数：

```php
// 对于具有以下 URI 的路由: test/{id}
return redirect()->route('test', ['id' => 1]);
```

**注：**命名路由需要在注册后指定 `name()`：

```php
Route::get('test/{id}', 'TestController@index')->name('test');
```

#### 通过 Eloquent 模型填充参数

> 待补充

### 重定向至控制器

```php
Route::get('/', function () {
    return redirect()->action('TestController@index');
});
```

添加参数：

```php
Route::get('/', function () {
    return redirect()->action('TestController@index', ['id' => 3]);
});
```

### 重定向外部域

```php
return redirect()->away('https://www.google.com');
```

----

## 其他响应类型

### 视图响应

`view()` 方法：

```php
return response()
        ->view('hello', $data, 200)
        ->header('Content-Type', $type);
```

### JSON响应

`json()` 方法：

- 会自动把 `Content-Type` 响应头信息设置为 `application/json`
- 使用 PHP函数 `json_encode` 将给定的数组转换为 JSON

```php
return response()->json([
    'name' => 'testName',
]);
```

#### JOSNP

`json()` + `withCallback`：

```php
return response()
        ->json(['name' => 'testName'])
        ->withCallback($request->input('callback'));
```

### 响应宏（自定义响应）

> 待补充







