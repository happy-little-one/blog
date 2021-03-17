---
topic: 'dgraph'
slug: '/dgraph/queries'
title: '查询语句'
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

第一段用来查询所有的用户和他们包含“dgraph”的 tweet，第二条查询出前 10 条帖子。这里可以总结出 DQL 的几个特点：

- 每个查询块都是具名的，返回的时候也会以查询块的名称为 key 返回。
- 一条查询语句里可以包含多个查询块，它们是并行查询。
- 和 graphql 一样根节点和边都支持过滤和查询，`func`函数只能用于根节点，`@filter`可用于两者。

依据索引指令的不同，DQL [支持各种各样的查询函数](https://dgraph.io/docs/query-language/functions/)，用这些函数，基本可以完成大部分常规业务查询了。

## 查询变量

既然一条语句里可以放多个查询块，DQL 支持把其中一块作为变量：

```
{
  A as not_a_real_query(...) {
    B as some_edge @filter(...) { # can't use C or B in this filter
      C as ... {
        # A, B and C here
      }

      # A, B and C here
    }

    # A, B and C can be used in any blocks here
  }

  # A, B and C can be used in any other query block
}
```

查询变量是 DQL 里最重要的部分，有了它你可以实现在其他数据库里只能靠冗余表或字段才能做到的查询。因为 dgraph 是原子化的，理论上你可以通过它拿到你想要的任何数据，不需要冗余字段或中间表。查询变量`as`表示，边和查询块都可以作为变量来使用，我们来看一个典型的场景：

> 找出参演过**王家卫**电影的**演员们**，有哪些还在**其他的电影**里**合作**过。比如，梁朝伟和张曼玉都参演过王家卫的电影《花样年华》，他们也在张艺谋的电影《英雄》里合作过。

可以想象这是一个复杂的查询，而我们仅有一个关键词“王家卫”，似乎是没法做到...不着急，让我们一步一步把大象装进冰箱里：

```
{
  quries(func:exact(name, "王家卫")) @cascade { # 找到王家卫
    WJW_films as directFilms { # 获取王家卫的所有电影
      WJW_actors as actors { # 获取参演过王家卫电影的所有演员
        actInFilms @filter(not uid(WJW_films)) { # 获取这些演员参演的非王家卫电影
          actors @fliter(uid(WJW_actors)) { # 在这些演员里过滤出参演过王家卫电影的
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
  ZYM as var(func:exact(name, "张艺谋")) {
    ZYM_films as directFilms
  }

  data(func:uid(ZYM)) {
    actInFilms @filter(uid(ZYM_films)) {
      name
    }
  }
}
```
