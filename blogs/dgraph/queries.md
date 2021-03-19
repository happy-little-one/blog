---
topic: 'dgraph'
slug: '/dgraph/queries'
title: '查询'
index: 3
---

## 基础语法

dgraph 以类似 graphql 的语法(DQL)进行查询，先来看一个简单例子：

```
{
  users(func:type(User)) {
    name
    tweets @filter(anyofterm(title,"dgraph")) {
      title
    }
  }

  tweets(func:type(Tweet), first: 10) {
    title
  }
}
```

一条查询语句可以包含多条查询，每条查询被称为**查询块**，查询块必须具名。DQL 用函数(func)和指令(@filter)来做查询,其中 func 只能写在根节点，@filter 可以写在节点和边上。

依据索引指令的不同，DQL [支持各种各样的查询函数](https://dgraph.io/docs/query-language/functions/)，用这些函数，基本可以完成大部分常规业务查询了。

## 查询变量

既然一条语句里可以放多个查询块，DQL 支持把其中一块作为变量,供其他的查询块或自己内部作为查询条件来用。它的作用域在同一个查询块内和编程语言类似，只有外层变量内层可访问，和编程语言不同的是，所有变量在其他的查询块内军可用：

```
{
  A as not_a_real_query(...) {
    B as some_edge @filter(...) {
    # B, C 此处不可用
      C as ... {
        # 此处A, B, C都可用
      }

      # 此处A, B, C都可用
    }

    # 此处A, B, C都可用
  }

  # 此处A, B, C都可用
}
```

查询变量`as`表示，**变量的值是指复合条件的 uid 集合，而不是查询结果**，所以用`uid(varName)`来取值。边和查询块都可以作为变量来使用，我们来看一个典型的场景：

> 找出参演过**王家卫**电影的**演员们**，有哪些还在**其他的电影**里**合作**过。比如，梁朝伟和张曼玉都参演过王家卫的电影《花样年华》，他们也在张艺谋的电影《英雄》里合作过。

可以想象这是一个复杂的查询，而我们仅有一个关键词“王家卫”，似乎是没法做到...不着急，让我们一步一步把大象装进冰箱里：

```
{
  quries(func:eq(name, "王家卫")) @cascade {
  # 找到王家卫
    WJW_films as directFilms {
    # 获取王家卫的所有电影
      WJW_actors as actors {
      # 获取参演过王家卫电影的所有演员
        actInFilms @filter(not uid(WJW_films)) {
        # 获取这些演员参演的非王家卫电影
          actors @fliter(uid(WJW_actors)) {
          # 在这些演员里过滤出参演过王家卫电影的
            name
          }
        }
      }
    }
  }
}
```

可能稍微有一点绕，不过稍微想一下就能明白。

> 注意这里的查询之类`@cascade`，它是确保返回的数据**完全匹配**你所定义的查询结构，把不完全匹配的都过滤掉。比如`query(func:type(Tweet)) { publishDate }`将会把所有已发布 tweet 给取出来，因为那些没有发布的没有`publishDate`这条边。

如果你想让某一块仅仅作为变量，不在结果里返回，可以用`var`来包裹它。再看一个例子，张艺谋有时会在自己导演的电影里露个脸，比如《有话好好说》。我们来找下张艺谋导演并露脸的电影：

```
{
  ZYM as var(func:eq(name, "张艺谋")) {
    ZYM_films as directFilms
  }

  data(func:uid(ZYM)) {
    actInFilms @filter(uid(ZYM_films)) {
      name
    }
  }
}
```

上面的的例子都是基于变量来做查询，查询也可以用来用数组就行重新组织，比如下面的例子获取徐克的所有电影，并按流派返回：

```
{
  var(func:eq(name, "徐克")) {
    F as directFilms {
      G as genre
    }
  }

  byGenre(func:uid(G)) {
  # 获取各个徐克电影的所属流派
    genreName,
    films: ~genre @filter(uid(id)) {
    # 获取每个流派下的所有电影并过滤出徐克的。
      filmName
    }
  }
}
```

## 值变量

查询变量存的是 uid，值变量存的就是值本身，用`val(varName)`取值，并支持用`max`，`min`，`avg`，`sum`，`math`等函数进行二次计算，也就是其他数据库里的聚合操作。

```
{
  XK as q(func:eq(name, "徐克")) {
    directFilms {
      actorsNum as count(actors) # 徐克每部电影的演员数量
    }

    mostActors: max(val(actorsNum)) # 徐克一部电影用到的最多演员数
  }

  xuKe(func:uid(XK)) {
    avgActors: avg(val(actorsNum)) # 徐克电影平均使用的演员数。
  }
}
```

> 值变量是有上下文的，只有在同一上下文中才能使用。这里的“上下文”不必是同一个查询块，也可以是同一个查询语意。如上面的例子，因为是同一个查询语意，所以`actorsNum`在两个查询块中同样可用，不仅可以用在返回值，也可以作为变量用来查询和过滤语句中。

## 分组

`groupby`用于查询结果分组：

```
var(func:eq(name, "徐克")) {
  direct_films @groupby(genre) {
    res as count(uid)
  }

  byGenre(func: uid(res)) {
    name
    num_movies: val(res)
  }
}
```

它的查询块内只允许聚合和 count 操作，无法直接取返回结果。你可能疑惑上面的 res 明明是 count 运算，为何可以当 uid 来用。原因是无论何种聚合操作最终将返回两个值：聚合边的 uid 数组以及聚合值本身。

## 总结

查询变量是 DQL 里最重要的部分，有了它你可以实现任何程度的复杂/级联查询而不用担心性能损耗，这在其他数据库里只能靠大量的冗余表或冗余字段才能做到。有了查询变量，你几乎可以仅在数据库里就可以完成所有的业务需求而无需额外的业务代码，这也是 dgraph 的核心卖点。

或许你你已做好了持久战的准备，准备一章章跟着看下去，但抱歉，没有了，以上三章就已经是 dgraph 的所有核心内容，排序，翻页，过滤都非常简单，官网看下 api 就知道怎么用了。

后面将开始做一个大型网站(知乎)的数据库设计，你可以看到 dgraph 将会多大程度的缩短你的数据建模时间，为你从想法到实现的征程上带来多大的帮助！
