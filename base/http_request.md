# HTTP 请求

## 依赖注入

### 控制器方法注入

获取当前 HTTP 请求实例时，需要在构造函数或方法中对 `\Illuminate\Http\Request` 进行依赖注入。

```php
<?php

use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * @param Request $request
     */
    public function index(Request $request)
    {
        //用户页
    }
}
```

### 闭包注入

```php
Route::get('/', function (\Illuminate\Http\Request $request) {
    //
});
```

----

## 路由参数

路由定义：

```php
Route::get('/user/{id}', 'UserController@index');
```

参数获取：

```php
/**
 * @param Request $request
 */
public function index(Request $request, $id)
{
    //用户页
    echo $id;
}
```

----

## 内置方法

### 请求路径

#### 获取请求路径

```php
$path = $request->path();
```

- 请求：`http://localhost:8000/user/1`
- 返回：`user/1`

#### 验证请求路径

`is` 方法验证请求路径是否与给定模式匹配。

```php
if($request->is('user/*')){
    //
}
```

### 获取请求 URL

#### 不包含查询字符串

```php
$url = $request->url();
```

#### 包含查询字符串

```php
$fullUrl = $request->fullUrl();
```

### 获取请求方法

```php
$method = $request->method();
```

验证请求方式是否匹配：

```php
if($request->isMethod('post')){ 
    // true or false
}
```

---

## 请求字符串处理

依赖全局中间件：

- `TrimStrings`：将字符串两端的空格清除
- `ConvertEmptyStringsToNull`：将空字符串转化为 `null`

----

## 获取请求输入

### 获取所有输入值

```php
$input = $request->all();
```

- 请求：`http://localhost:8000/user/1?token=testToken&name=testName`
- 输出：`array(2) { ["token"]=> string(9) "testToken" ["name"]=> string(8) "testName" }`

### 获取单个输入值

```php
$token = $request->input('token', 'defaultToken');
```

#### 处理表单数据

可以使用`.`来访问数组输入：

```php
$name = $request->input('products.0.name');
```

### 获取部分数据

- 方法：`only()` `except()`
- 获取输入数据的子集
- 接收一个数组或动态列表作为唯一参数

```php
$input = $request->only(['username', 'password']);
$input = $request->only('username', 'password');

$input = $request->except(['credit_card']);
$input = $request->except('credit_card');
```

### 判断参数是否存在

#### 是否存在

- 单个参数：

```php
if ($request->has('name')) {
    //
}
```

- 多个参数：

```php
if ($request->has(['name', 'email'])) {
    //
}
```

#### 存在且不为空

```php
if ($request->filled('name')) {
    //
}
```

----

## 上一次请求输入

### Session

#### 存入 Session

将当前输入存放至一次性 Session。
    
> 一次性 Session ：从 Session 中取出数据后，对应数据会从 Session 中销毁

```php
$request->flash();

$request->flashOnly('username', 'email'); //仅存放子集
$request->flashExcept('password');
```

#### 取出上次请求数据

使用 `old()` 方法。

```php
$username = $request->old('username');
```

### Cookie

#### 获取 Cookie

```php
$value = $request->cookie('name');

$value = Cookie::get('name');
```

#### 添加 Cookie 到响应

```php
return response('Hello World')->cookie(
    'cookie_name', 'value', $minutes //有效期为分钟
);
```

#### 生成 Cookie 实例

```php
$cookie = cookie('cookie_name', 'value', $minutes);
return response('Hello World')->cookie($cookie);
```

----

## 文件上传

----

## 配置信任代理