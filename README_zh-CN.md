[English](https://github.com/kelekexiao123/genjijs/blob/master/README.md) | 简体中文
# <img src="https://user-images.githubusercontent.com/17807197/72414887-3b7b6080-37ae-11ea-87db-d350efb54a8e.png" width="28" height="28" align="center" style="margin-right: 5px" /> Genji

[![npm version](https://img.shields.io/npm/v/genjijs.svg)](https://www.npmjs.com/package/genjijs)
[![CircleCI](https://circleci.com/gh/kelekexiao123/genjijs.svg?style=svg)](https://circleci.com/gh/kelekexiao123/genjijs)
[![Coverage Status](https://coveralls.io/repos/github/kelekexiao123/genjijs/badge.svg?branch=master)](https://coveralls.io/github/kelekexiao123/genjijs?branch=master)
[![dependencies Status](https://david-dm.org/kelekexiao123/genjijs/status.svg)](https://david-dm.org/kelekexiao123/genjijs)
[![devDependencies Status](https://david-dm.org/kelekexiao123/genjijs/dev-status.svg)](https://david-dm.org/kelekexiao123/genjijs?type=dev)
[![downloads](https://img.shields.io/npm/dm/genjijs.svg)](https://npmcharts.com/compare/genjijs?minimal=true)

基于 `redux`、`redux-thunk` 的超轻量级（核心代码仅5KB）的数据状态管理方案。(Inspired by [dva](https://github.com/dvajs/dva) )

---

<img src="https://user-images.githubusercontent.com/17807197/72416259-3835a400-37b1-11ea-91ed-0ca72d361802.gif" width="300" />

> 竜神の剣を喰らえ！ -- 島田源氏

---

## 特性 :new:

* 使用命名空间分隔不同业务，并将同一命名空间下所有的数据处理逻辑集中在同一处，方便数据统一管理，提供模块的可插拔体验。
* 增强 `redux` 的 `actionCreator`，提供友好的存取数据方法，使用户无需重复手写 `reducer` ，统一同步与异步更新 `state` 的操作体验。
* 内置异步操作 `loading` 状态，更方便的获取当前操作进度。

## 安装 :gear:

如果你使用 `npm` 作为包管理工具，在项目目录下，执行以下命令：

```
npm install --save genjijs
```

如果你使用 `yarn` ，也可以：
```
yarn add genjijs
```

## 快速上手 :beginner:

本项目内置使用示例，见[这里](https://github.com/kelekexiao123/genjijs/tree/master/example)。使用了 `Genji` 的所有常用特性。

另外，下面的 `demo` 也许能帮助你更快地熟悉 `Genji` ：

* [TodoList](https://codesandbox.io/s/reverent-galois-v5c8t?fontsize=14&hidenavigation=1&theme=dark)：一个模仿Redux官方给出的TodoList。（[Redux官网示例传送门](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/todos)）

---

## Q & A :book:

* ### 与`dva`的区别？

`dva`是一个在全球范围内都十分优秀的开源项目，也是本项目的灵感来源（这从项目名上就可以看出hhh），在此特别致谢。

在 `dva` 项目中使用了 `redux-saga` 作为异步解决方案，这使得开发者不得不使用 `generator` 的方式进行异步请求，这和 `async` 与 `Promise` 结合的主流异步调用方式不同，可能会对新手开发者造成一些困惑。因此，在 `Genji` 中采用了 `Redux` 的作者 `Dan` 本人写的 `redux-thunk` 作为异步解决方案。

考虑到 `redux-saga` 所带来的用户习惯与功能增强，我们通过劫持注入的方式增强了 `redux-thunk` 的能力，从而使用户以使用类 `redux-saga` 的方式无感知的定义异步函数，并支持 `async` 与 `Promise` 方式触发异步请求。

## TODO :construction:

- [x] 异步函数 `loading` 状态注入
- [x] 为effects加入 `save` 与 `pick` 方法进行对 `state` 存取的能力
  - [x] 异步创建 `reducer` 并注入到原 `reducer树` 中
  - [x] 扩展 `redux-thunk` ，并劫持`dispatch`，扩展参数注入
  - [x] 实现 `save` 与 `pick` 功能
  - [ ] 实现 `save` 与 `pick`，如将功能作用范围扩展到对其他 `model` 中，或支持解析更多的参数类型
- [x] 加入CI、eslint、单元测试功能
- [x] 整合`reducers` 与 `effects`, 统一为 `actionCreator`
- [ ] 改写`Aciton Type`，使之支持定义跳转与智能提示
- [ ] 完善文档

## 开源许可证

[MIT](https://github.com/kelekexiao123/genjijs/blob/master/LICENSE)

（你可以随意使用此项目，不需要提前告知我，除非你需要其它服务。）