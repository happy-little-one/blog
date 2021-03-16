---
topic: 'dgraph'
slug: '/dgraph/schema'
title: 'schema'
index: 2
---

## 基础声明

如上一篇所示，dgraph 可以不需要任何 schema 就插入数据，但这会引起歧义，如：

```
_:jim <follow> _:tom .
_:jim <follow> _:joe .
```

这段代码你可能让 jim 关注 tom 和 joe，但如果没有 schema 定义的话，jim 会 只 关注 了 joe，dgraph 的边默认是**一对一**的，这里第二句把第一句修改了。schema 的定义语法如下：

```
type User {
  name
  follows
}

type Tweet {
  author
  title
}

type Comment {
  author
  content
}

name: string .
follows: [uid] .

title: string .
author: [uid] .
content: string .
```

dgrpah 支持的值类型是`int` `float` `string` `bool` `dateTime` `geo` ，引用类型`uid`表示，数组类型用`[type]`表示，自定义类型用`type`表示。你可能会疑惑为什么把自定义类型和标量类型分开定义，上一章提到过，dgraph 是完全原子化的，引用节点和值节点在内部会被无差别对待，所以这里只是**平铺**的为每个节点声明，只是习惯上把引用节点写在前面。

> 也因如此，Tweet 的 author 和 User 的 author 指的是同一边。当你以 author 为条件查询的时候，将会得到该 author 所有的 tweet 和 comment，这在某些场景下会很有用。如果你要避免这样的效果，就把它们命名为不同的边。

## 索引指令

索引是以指令的形式形式添加到 shema 声明中：

```
title: string @index(term) .
author: [uid] @reverse .
follows: [uid] @count .
```

带`@`的都代表添加了某种索引，而不仅仅是是`@index`。`@index`内部的参数表示索引模式，只有它可以带参数。查询，排序，搜索都基于索引,虽然某些场景下可以对无索引的边进行过滤，但有性能损耗，所以建议，所有要支持这些功能的边都添加索引。只有 int，float，datetime，string(@index(exact))支持排序。

大部分索引的目的和用法一目了然，可以自行官网查询，不做一一讲述。这里只讲述一个最重要的索引`@reverse`,这个用来建立双向关系的。考虑这样一个场景，把 user 和 tweet 做双向关联，可以获取某人的 tweet，也可以获取 tweet 的作者。基于上面的知识，你可能会这么写：

```
type User {
  tweets
}

type Tweet {
  author
}

tweets: [uid] .
author: uid .
```

但这样只是声明了 user 有一堆 tweets，tweet 有一个作者，并没有把具体的人和 tweet 关联起来，你可以每次都用两个 triple 来手动的维护这种双向关系，但这略显繁琐，好在 dgraph 提供了`@reverse`指令把一个边声明为双向的：

```
type User {}

type Tweet {
  author
}

author: uid @reverse .
```

这样就建立双向关系。值得注意的是，这里把 tweets 边删除了，获取 user 的 tweets 可以通过反向的 author 边来达到，tweets 已经完全不需要了。你可能好奇最终查询要怎么写，其实很简单，虽然我们还没讲到查询，但这里可以先瞄一眼：

```
{
  query(func:uid(0x1)) {
    tweets: ~author {
      title,
    }
  }
}
```
